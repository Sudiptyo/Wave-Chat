import { FastifyPluginAsync } from "fastify";
import { friendRequestIdSchema, sendFriendRequestSchema } from "../../Schemas/Friend request/request.schema.js";
import { acceptFriendRequestController, rejectFriendRequestController, sendFriendRequestController } from "../../Controllers/Request/request.controller.js";
import { verifyUser } from "../../Middlewares/Auth/auth.middleware.js";

const friendRequestRoutes: FastifyPluginAsync = async (fastify) => {

    fastify.post(
        "/requests",
        {
            schema: {
                tags: ["Friends"],
                summary: "Send a friend request",
                description:
                    "Send a friend request using the recipient's email address or mobile number.",
                security: [
                    {
                        accessTokenCookie: [],
                    },
                ],
                body: sendFriendRequestSchema,
            },
            preHandler: verifyUser,
        },
        sendFriendRequestController,
    );

    fastify.post(
        "/requests/:requestId/accept",
        {
            schema: {
                tags: ["Friends"],
                summary: "Accept a friend request",
                security: [
                    {
                        accessTokenCookie: [],
                    },
                ],
                params: friendRequestIdSchema,
            },
            preHandler: verifyUser,
        },
        acceptFriendRequestController);


    fastify.post(
        "/requests/:requestId/reject",
        {
            schema: {
                tags: ["Friends"],
                summary: "Reject a friend request",
                security: [
                    {
                        accessTokenCookie: [],
                    },
                ],
                params: friendRequestIdSchema,
            },
            preHandler: verifyUser,
        },
        rejectFriendRequestController);
}

export default friendRequestRoutes