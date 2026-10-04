import z from "zod";


export const createConversationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Conversation name is required")
        .max(100, "Conversation name must not exceed 100 characters"),

    conversationType: z.enum([
        "PRIVATE",
        "GROUP",
    ]),

    participantIds: z
        .array(
            z.string().uuid({ message: "Invalid participant id" }),
        )
        .min(1, "At least one participant is required"),
});


export const conversationIdSchema = z.object({
    conversationId: z
        .string()
        .uuid("Invalid conversation id"),
});


export type CreateConversationSchema = z.infer<
    typeof createConversationSchema
>;

export type ConversationIdSchema = z.infer<
    typeof conversationIdSchema
>;