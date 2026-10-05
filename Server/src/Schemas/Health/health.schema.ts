import z from "zod";

const healthResponseSchema = z.object({
    success: z.boolean(),

    status: z.enum(["ok", "degraded"]),

    timestamp: z.string(),

    checks: z.object({
        server: z.literal("ok"),
        postgres: z.enum(["ok", "down"]),
        redis: z.enum(["ok", "down"]),
    }),
});

export { healthResponseSchema };