import { group } from "node:console";
import { ApiError } from "../../Config/Error.js";
import { prisma } from "../../Db/prisma.js";
import { archiveConversationData, createConversationData, deleteConversationData, getConversationData, getConversationsData, muteConversationData, pinConversationData, unarchiveConversationData, unmuteConversationData, unpinConversationData, updateConversationData } from "../../Interfaces/Conversation/service.interface.js";
import { User } from "../../Models1/Auth/user.model.js";
import { app } from "../../App.js";
import { create } from "node:domain";


const createConversationService = async (data: createConversationData) => {

    //     1. Validate creator
    //         ↓
    // 2. Deduplicate participantIds
    //         ↓
    // 3. Validate all participants exist
    //         ↓
    // 4. Ensure creator is included
    //         ↓
    // 5. Validate PRIVATE / GROUP participant count
    //         ↓
    // 6. Validate conversation name
    //         ↓
    // 7. If self - chat
    //       → key = self: creatorId
    //       → ensure it doesn't already exist
    //       → create conversation + participant
    //         ↓
    // 8. If normal PRIVATE
    //       → get receiver
    //       → check contact
    //       → check block
    //       → key = sorted user IDs
    //       → check existing conversation
    //         ↓
    // 9. If GROUP
    //       → check group - specific rules
    //       → key = null
    //         ↓
    // 10. Create conversation + participants

    try {
        const {
            creatorId,
            conversationType,
            name,
            participantIds,
        } = data;

        // Check if user exists
        const sender = await User.findById(creatorId);

        if (!sender) {
            throw new ApiError(404, "User not found");
        }

        // Remove duplicates -> deduplication
        const uniqueParticipantIds = [...new Set(participantIds)];

        // Validate participants
        const participants = await User.find({
            _id: {
                $in: uniqueParticipantIds,
            },
        });

        // Check if participants exist
        if (participants.length !== uniqueParticipantIds.length) {
            throw new ApiError(404, "Participants not found");
        }

        // Check if creator is included
        if (!uniqueParticipantIds.includes(creatorId)) {
            throw new ApiError(
                400,
                "Creator must be a participant",
            );
        }

        // Check if name is valid
        if (!name?.trim()) {
            throw new ApiError(400, "Name is required");
        }

        // ─────────────────────────────
        // SELF CHAT
        // ─────────────────────────────

        // Self conversation
        if (
            conversationType === "PRIVATE" &&
            uniqueParticipantIds.length === 1 &&
            uniqueParticipantIds[0] === creatorId
        ) {
            const existingConversationWithOwn =
                await prisma.conversation.findUnique({
                    where: {
                        privateParticipantKey: `self:${creatorId}`,
                    },
                });

            if (existingConversationWithOwn) {
                throw new ApiError(
                    409,
                    "Private conversation with yourself already exists",
                );
            }

            const conversation =
                await prisma.conversation.create({
                    data: {
                        createdBy: creatorId,
                        name: name.trim(),
                        conversationType: "PRIVATE",
                        privateParticipantKey: `self:${creatorId}`,
                        participants: {
                            create: {
                                userId: creatorId,
                            },
                        },
                    },
                });

            return {
                data: conversation,
            };
        }

        // ─────────────────────────────
        // PRIVATE CHAT
        // ─────────────────────────────

        if (conversationType === "PRIVATE") {

            // Check if private conversation has exactly 2 participants
            if (uniqueParticipantIds.length !== 2) {
                throw new ApiError(
                    400,
                    "Private conversation must have exactly 2 participants",
                );
            }

            // Get receiver
            const receiverId = uniqueParticipantIds.find(
                (id) => id !== creatorId,
            );

            if (!receiverId) {
                throw new ApiError(400, "Receiver not found");
            }

            // Check if contact exists
            const isContacted = await prisma.contact.findFirst({
                where: {
                    OR: [
                        {
                            userId: creatorId,
                            contactedId: receiverId,
                        },
                        {
                            userId: receiverId,
                            contactedId: creatorId,
                        },
                    ],
                },
            });

            if (!isContacted) {
                throw new ApiError(
                    400,
                    "Cannot create private conversation with uncontacted user",
                );
            }

            // Check if blocked
            const isBlocked = await prisma.block.findFirst({
                where: {
                    OR: [
                        {
                            blockerId: creatorId,
                            blockedId: receiverId,
                        },
                        {
                            blockerId: receiverId,
                            blockedId: creatorId,
                        },
                    ],
                },
            });

            if (isBlocked) {
                throw new ApiError(
                    400,
                    "Cannot create private conversation with blocked user",
                );
            }

            // Generate privateParticipantKey
            const privateParticipantKey = [...uniqueParticipantIds]
                .sort()
                .join(":");

            // Check if private conversation already exists
            const existingConversation =
                await prisma.conversation.findUnique({
                    where: {
                        privateParticipantKey,
                    },
                });

            if (existingConversation) {
                throw new ApiError(
                    409,
                    "Private conversation already exists",
                );
            }

            const conversation =
                await prisma.conversation.create({
                    data: {
                        createdBy: creatorId,
                        name: name.trim(),
                        conversationType: "PRIVATE",
                        privateParticipantKey,
                        participants: {
                            create: uniqueParticipantIds.map((userId) => ({
                                userId,
                            })),
                        },
                    },
                    include: {
                        participants: true,
                    },
                });

            return {
                data: conversation,
            };
        }

        // ─────────────────────────────
        // GROUP CHAT
        // ─────────────────────────────

        if (conversationType === "GROUP") {

            // Check if group conversation has at least 3 participants
            if (uniqueParticipantIds.length < 3) {
                throw new ApiError(
                    400,
                    "Group conversation must have at least 3 participants",
                );
            }

            const groupParticipants = uniqueParticipantIds.filter(
                (id) => id !== creatorId,
            );

            // Check whether creator has blocked any participant
            // or any participant has blocked the creator
            const blockedParticipant = await prisma.block.findFirst({
                where: {
                    OR: [
                        {
                            blockerId: creatorId,
                            blockedId: {
                                in: groupParticipants,
                            },
                        },
                        {
                            blockerId: {
                                in: groupParticipants,
                            },
                            blockedId: creatorId,
                        },
                    ],
                },
            });

            if (blockedParticipant) {
                throw new ApiError(
                    400,
                    "Cannot create group conversation with blocked user",
                );
            }

            const conversation =
                await prisma.conversation.create({
                    data: {
                        createdBy: creatorId,
                        name: name.trim(),
                        conversationType: "GROUP",
                        privateParticipantKey: null,
                        participants: {
                            create: uniqueParticipantIds.map((userId) => ({
                                userId,
                            })),
                        },

                        groupChat: {
                            create: {
                                createdBy: creatorId,
                                memberCount: uniqueParticipantIds.length,
                                adminCount: 1,

                                members: {
                                    create: uniqueParticipantIds.map((userId) => ({
                                        userId,
                                        role: userId === creatorId ? "OWNER" : "MEMBER",
                                        status: "ACTIVE",
                                    }))
                                }
                            }
                        },
                    },

                    include: {
                        participants: true,
                    },
                });

            return {
                data: conversation,
            };
        }

        // Invalid conversation type
        throw new ApiError(
            400,
            "Invalid conversation type",
        );

    } catch (err) {
        if (err instanceof ApiError) {
            throw err;
            app.log.error({ err: err }, "Failed to create conversation");
        }

        throw new ApiError(
            500,
            "Failed to create conversation",
        );
    }
};


const getConversationsService = async (data: getConversationsData) => {

    try {
        const { userId } = data;

        const conversations = await prisma.conversation.findMany({
            where: {
                isDeleted: false,
                participants: {
                    some: {
                        userId
                    }
                },

                // Only conversations that actually have messages
                messages: {
                    some: {}
                }
            },

            // Most recently active conversations first
            orderBy: {
                lastMessageAt: "desc",
            },

            include: {
                participants: true
            }
        })

        if (conversations.length === 0) {
            throw new ApiError(
                404,
                "No conversations found",
            );
        }

        return {
            data: conversations
        }

    } catch (err) {
        if (err instanceof ApiError) {
            throw err;
            app.log.error({ err: err }, "Failed to get conversations: ");
        }

        throw new ApiError(
            500,
            "Failed to get conversations",
        );
    }
};

const updateConversationService = async (data: updateConversationData) => {

    try {

    } catch (err) {
        if (err instanceof ApiError) {

        }

    }
};

const deleteConversationService = async (data: deleteConversationData) => {

    try {

    } catch (err) {
        if (err instanceof ApiError) {

        }

    }
};

const pinConversationService = async (data: pinConversationData) => {

    try {

    } catch (err) {
        if (err instanceof ApiError) {

        }

    }
};

const unpinConversationService = async (data: unpinConversationData) => {

    try {

    } catch (err) {
        if (err instanceof ApiError) {

        }

    }
};

const muteConversationService = async (data: muteConversationData) => {

    try {

    } catch (err) {
        if (err instanceof ApiError) {

        }

    }
};

const unmuteConversationService = async (data: unmuteConversationData) => {

    try {

    } catch (err) {
        if (err instanceof ApiError) {

        }

    }
};

const archiveConversationService = async (data: archiveConversationData) => {

    try {

    } catch (err) {
        if (err instanceof ApiError) {

        }

    }
};

const unarchiveConversationService = async (data: unarchiveConversationData) => {

    try {

    } catch (err) {
        if (err instanceof ApiError) {

        }

    }
};

export { createConversationService, getConversationsService, updateConversationService, deleteConversationService, pinConversationService, unpinConversationService, muteConversationService, unmuteConversationService, archiveConversationService, unarchiveConversationService };