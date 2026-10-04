import { app } from "../../App.js";
import { ApiError } from "../../Config/Error.js";
import { prisma } from "../../Db/prisma.js";
import { acceptFriendRequestData, friendRequestData, rejectFriendRequestData } from "../../Interfaces/Friend/service.interface.js";

const sendFriendRequestService = async (data: friendRequestData) => {

    try {
        const { senderId, identifier, message } = data;

        if (!senderId) {
            throw new ApiError(400, "Sender id is required");
        }

        if (!identifier?.trim()) {
            throw new ApiError(400, "Identifier is required");
        }

        const sender = await prisma.user.findUnique({
            where: {
                id: senderId
            }
        })

        if (!sender) {
            throw new ApiError(404, "User not found");
        }

        const normalizedIdentifier = identifier.includes("@") ? identifier.trim().toLocaleLowerCase() : identifier.trim();

        const isEmail = normalizedIdentifier.includes("@");

        const receiver = await prisma.user.findUnique({
            where: isEmail ? {
                email: normalizedIdentifier
            } : {
                mobileNo: normalizedIdentifier
            }
        })

        if (!receiver) {
            throw new ApiError(404, "User not found");
        }

        // SELF REQUEST
        if (senderId === receiver.id) {
            throw new ApiError(400, "You cannot send friend request to yourself");
        }

        // MESSAGE
        const trimmedMessage = message?.trim();

        if (trimmedMessage && trimmedMessage.length > 500) {
            throw new ApiError(400, "Message is too long");
        }

        // ALREADY FRIENDS
        const isAlreadyFriend = await prisma.contact.findFirst({
            where: {
                OR: [
                    {
                        userId: senderId,
                        contactedId: receiver.id,
                    },
                    {
                        userId: receiver.id,
                        contactedId: senderId,
                    },
                ],
            },
        });

        if (isAlreadyFriend) {
            throw new ApiError(400, "You are already friends");
        }

        // BLOCK CHECK
        const isBlocked = await prisma.block.findFirst({
            where: {
                OR: [
                    {
                        blockerId: senderId,
                        blockedId: receiver.id,
                    }, {
                        blockerId: receiver.id,
                        blockedId: senderId,
                    }
                ]
            }
        })

        if (isBlocked) {
            throw new ApiError(400, "Cannot send friend request to this user",);
        }

        // EXISTING PENDING REQUEST
        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                status: "PENDING",
                expiresAt: {
                    gt: new Date()
                },
                OR: [
                    {
                        senderId: senderId,
                        receiverId: receiver.id,
                    }, {
                        senderId: receiver.id,
                        receiverId: senderId,
                    }
                ]
            }
        })

        if (existingRequest) {
            throw new ApiError(400, "Friend request already sent");
        }

        const FRIEND_REQUEST_TTL_DAYS = 7;

        // CREATE REQUEST
        const request = await prisma.friendRequest.create({
            data: {
                senderId,
                receiverId: receiver.id,
                status: "PENDING",
                message: trimmedMessage || "Hey 👋 I'd like to connect with you on WaveChat",
                respondedAt: null,
                expiresAt: new Date(Date.now() + FRIEND_REQUEST_TTL_DAYS * 24 * 60 * 60 * 1000) // 7 days
            }
        })

        return {
            data: request
        }

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error({ err }, "Failed to send friend request");
            throw err;
        }

        throw new ApiError(500, "Failed to send friend request");
    }
}

const acceptFriendRequestService = async (data: acceptFriendRequestData) => {

    try {
        const { requestId, receiverId } = data;
        if (!requestId) {
            throw new ApiError(400, "Request id is required");
        }

        if (!receiverId) {
            throw new ApiError(400, "Receiver id is required");
        }

        const isFriendRequestSent = await prisma.friendRequest.findFirst({
            where: {
                id: requestId,
                status: "PENDING",
                expiresAt: {
                    gt: new Date()
                }
            }
        })

        if (!isFriendRequestSent) {
            throw new ApiError(400, "Friend request not found");
        }

        const request = isFriendRequestSent;

        if (receiverId !== request.receiverId) {
            throw new ApiError(403, "You cannot accept this friend request");
        }

        const isAlreadyFriend = await prisma.contact.findFirst({
            where: {
                OR: [
                    {
                        userId: request.senderId,
                        contactedId: receiverId
                    }, {
                        userId: receiverId,
                        contactedId: request.senderId
                    }
                ]
            }
        })

        if (isAlreadyFriend) {
            throw new ApiError(400, "You are already friends");
        }

        const result = await prisma.$transaction(async (tx) => {
            const updatedRequest = await tx.friendRequest.update({
                where: {
                    id: request.id,
                },
                data: {
                    status: "ACCEPTED",
                    respondedAt: new Date()
                }
            });

            await tx.contact.createMany({
                data: [
                    {
                        userId: request.senderId,
                        contactedId: request.receiverId
                    },
                    {
                        userId: request.receiverId,
                        contactedId: request.senderId
                    }
                ]
            });

            return updatedRequest;
        })

        return {
            data: result
        };

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error({ err }, "Failed to accept friend request");
            throw err;
        }

        throw new ApiError(500, "Failed to accept friend request");
    }
}

const rejectFriendRequestService = async (data: rejectFriendRequestData) => {

    try {
        const { requestId, receiverId } = data;

        if (!requestId) {
            throw new ApiError(400, "Request id is required");
        }

        if (!receiverId) {
            throw new ApiError(400, "Receiver id is required");
        }

        const isFriendRequestSent = await prisma.friendRequest.findFirst({
            where: {
                id: requestId,
                status: "PENDING",
                expiresAt: {
                    gt: new Date()
                }
            }
        })

        if (!isFriendRequestSent) {
            throw new ApiError(400, "Friend request not found");
        }

        const request = isFriendRequestSent;

        if (receiverId !== request.receiverId) {
            throw new ApiError(403, "You cannot reject this friend request");
        }

        const rejectedRequest = await prisma.friendRequest.update({
            where: {
                id: request.id
            },
            data: {
                status: "REJECTED",
                respondedAt: new Date()
            }
        })

        return {
            data: rejectedRequest
        }

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error({ err }, "Failed to reject friend request");
            throw err;
        }

        throw new ApiError(500, "Failed to reject friend request");
    }
}

export { sendFriendRequestService, acceptFriendRequestService, rejectFriendRequestService };