import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../../App.js";
import { createConversationSchema } from "../../Schemas/Conversation/conversation.schema.js";
import { AuthenticateUser } from "../../Interfaces/Auth/user.middleware.interface.js";
import {
    createConversationService,
    getConversationsService
} from "../../Services/Conversation/conversation.service.js";


const createConversationController = async (
    req: FastifyRequest,
    reply: FastifyReply
) => {

    try {

        const data = createConversationSchema.parse(req.body);

        const user = req.user as AuthenticateUser;

        const conversation = await createConversationService({
            creatorId: user.userId,
            name: data.name,
            conversationType: data.conversationType,
            participantIds: data.participantIds
        });

        return reply.status(201).send({
            success: true,
            message: "Conversation created successfully",
            data: conversation.data
        });

    } catch (err: unknown) {

        app.log.error(
            { err },
            "Failed to create conversation"
        );

        throw err;
    }
};


const getConversationsController = async (
    req: FastifyRequest,
    reply: FastifyReply
) => {

    try {

        const user = req.user as AuthenticateUser;

        const conversations = await getConversationsService({
            userId: user.userId
        });

        return reply.status(200).send({
            success: true,
            data: conversations.data
        });

    } catch (err: unknown) {

        app.log.error(
            { err },
            "Failed to get conversations"
        );

        throw err;
    }
};


export {
    createConversationController,
    getConversationsController
};