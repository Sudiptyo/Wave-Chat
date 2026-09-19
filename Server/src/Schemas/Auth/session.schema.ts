import z from "zod";


export const createSessionSchema = z.object({
    deviceId: z
        .string()
        .trim()
        .max(255)
        .optional(),

    deviceName: z
        .string()
        .trim()
        .max(255)
        .optional(),
})

export type createSessionData = z.infer<typeof createSessionSchema>;