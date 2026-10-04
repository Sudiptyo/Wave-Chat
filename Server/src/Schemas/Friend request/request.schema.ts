import z from "zod";

export const sendFriendRequestSchema = z.object({
    identifier: z
        .string()
        .trim()
        .min(1, "Identifier is required"),

    message: z
        .string()
        .trim()
        .max(500, "Message must not exceed 500 characters")
        .optional(),
});

export const friendRequestIdSchema = z.object({
    requestId: z
        .string()
        .uuid("Invalid friend request id"),
});

export type SendFriendRequestSchema = z.infer<
    typeof sendFriendRequestSchema
>;

export type FriendRequestIdSchema = z.infer<
    typeof friendRequestIdSchema
>;