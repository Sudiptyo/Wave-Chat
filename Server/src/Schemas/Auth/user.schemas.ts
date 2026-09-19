import z from "zod"

const mobileNumberSchema = z
    .string()
    .trim()
    .regex(
        /^\+?[1-9]\d{9,14}$/,
        "Please enter a valid mobile number"
    );


const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must not exceed 72 characters");

const usernameSchema = z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .regex(
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers and underscores",
    );


export const registerUserSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name must not exceed 50 characters"),

    userName: usernameSchema,

    mobileNo: mobileNumberSchema,

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email")
        .optional(),

    password: passwordSchema,
})

export const loginUserSchema = z.object({
    identifier: z
        .string()
        .trim()
        .min(1, "Email or mobile number is required")
        .max(254, "Identifier is too long")
        .refine(
            (value) => {
                const isEmail =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

                const isMobile =
                    /^\+?[1-9]\d{9,14}$/.test(value);

                return isEmail || isMobile;
            },
            "Enter a valid email or mobile number"
        ),

    password: passwordSchema,
})

export const updateUserSchema = z.object({

    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name must not exceed 50 characters")
        .optional(),

    userName: usernameSchema.optional(),

    avatar: z
        .string()
        .trim()
        .url("Avatar must be a valid URL")
        .max(2048)
        .optional(),

    about: z
        .string()
        .trim()
        .max(500, "About must not exceed 500 characters")
        .optional(),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email")
        .max(254)
        .optional(),

    mobileNo: mobileNumberSchema.optional(),

    currentPassword: z
        .string()
        .min(1, "Current password is required")
        .optional(),

    newPassword: passwordSchema.optional(),

    confirmPassword: passwordSchema.optional(),

})
    .superRefine((data, ctx) => {

        if (
            data.newPassword &&
            data.newPassword !== data.confirmPassword
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Passwords do not match",
            });
        }

    });

export type registerUserData = z.infer<typeof registerUserSchema>;
export type loginUserData = z.infer<typeof loginUserSchema>;
export type updateUserData =
    z.infer<typeof updateUserSchema>;   
