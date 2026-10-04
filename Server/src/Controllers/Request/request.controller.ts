import {
    FastifyReply,
    FastifyRequest,
} from "fastify";

import { ApiError } from "../../Config/Error.js";
import { app } from "../../App.js";

import { AuthenticateUser } from "../../Interfaces/Auth/user.middleware.interface.js";
import { friendRequestIdSchema, sendFriendRequestSchema } from "../../Schemas/Friend request/request.schema.js";
import { acceptFriendRequestService, rejectFriendRequestService, sendFriendRequestService } from "../../Services/Friend Request/service.js";


const sendFriendRequestController = async (
    req: FastifyRequest,
    reply: FastifyReply,
) => {
    try {
        const data = sendFriendRequestSchema.parse(req.body);

        const user = req.user as AuthenticateUser;

        const request = await sendFriendRequestService({
            senderId: user.userId,
            identifier: data.identifier,
            message: data.message,
        });

        return reply.status(201).send({
            success: true,
            message: "Friend request sent successfully",
            data: request.data,
        });

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error(
                { err },
                "Failed to send friend request",
            );

            throw err;
        }

        throw err;
    }
};


const acceptFriendRequestController = async (
    req: FastifyRequest,
    reply: FastifyReply,
) => {
    try {
        const { requestId } = friendRequestIdSchema.parse(
            req.params,
        );

        const user = req.user as AuthenticateUser;

        const request = await acceptFriendRequestService({
            requestId,
            receiverId: user.userId,
        });

        return reply.status(200).send({
            success: true,
            message: "Friend request accepted successfully",
            data: request.data,
        });

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error(
                { err },
                "Failed to accept friend request",
            );

            throw err;
        }

        throw err;
    }
};


const rejectFriendRequestController = async (
    req: FastifyRequest,
    reply: FastifyReply,
) => {
    try {
        const { requestId } = friendRequestIdSchema.parse(
            req.params,
        );

        const user = req.user as AuthenticateUser;

        const request = await rejectFriendRequestService({
            requestId,
            receiverId: user.userId,
        });

        return reply.status(200).send({
            success: true,
            message: "Friend request rejected successfully",
            data: request.data,
        });

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error(
                { err },
                "Failed to reject friend request",
            );

            throw err;
        }

        throw err;
    }
};


export {
    sendFriendRequestController,
    acceptFriendRequestController,
    rejectFriendRequestController,
};