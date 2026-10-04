import { FastifyPluginAsync } from "fastify";
import { createConversationSchema } from "../../Schemas/Conversation/conversation.schema.js";
import { verifyUser } from "../../Middlewares/Auth/auth.middleware.js";
import { createConversationController, getConversationsController } from "../../Controllers/Conversation/conversation.controller.js";


const conversationRoutes: FastifyPluginAsync = async (fastify) => {

    fastify.post("/", {
        schema: {
            tags: ["Conversations"],
            summary: "Create a new conversation",
            security: [
                {
                    accessTokenCookie: []
                }
            ],
            body: createConversationSchema
        },
        preHandler: verifyUser
    }, createConversationController);

    fastify.get(
        "/",
        {
            schema: {
                tags: ["Conversations"],
                summary: "Get the authenticated user's conversations",
                security: [
                    {
                        accessTokenCookie: [],
                    },
                ],
            },
            preHandler: verifyUser,
        },
        getConversationsController);


}

export default conversationRoutes;