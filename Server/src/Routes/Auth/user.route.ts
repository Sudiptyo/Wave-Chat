import { FastifyPluginAsync } from "fastify";
import { forgotPasswordSchema, loginUserSchema, registerUserSchema, resetPasswordSchema, updateUserSchema } from "../../Schemas/Auth/user.schemas.js";
import { forgotPasswordUserController, getUserController, loginUserController, logoutFromAllDevicesUserController, logoutUserController, refreshAccessTokenController, registerUserController, resetPasswordUserController, updateUserController } from "../../Controllers/Auth/user.controller.js";
import { verifyUser } from "../../Middlewares/Auth/auth.middleware.js";


const userRoutes: FastifyPluginAsync = async (fastify) => {

    fastify.post("/register", {
        schema: {
            tags: ["Auth"],
            summary: "Register a local user",
            body: registerUserSchema
        }
    }, registerUserController);

    fastify.post("/login", {
        schema: {
            tags: ["Auth"],
            summary: "Login using email or mobile number",
            body: loginUserSchema
        }
    }, loginUserController);

    fastify.get("/user", {
        schema: {
            tags: ["Auth"],
            summary: "Get the authenticated user's profile",
        },
        preHandler: verifyUser
    }, getUserController);

    fastify.post("/logout", {
        schema: {
            tags: ["Auth"],
            summary: "Logout from the current session",
            security: [{ accessTokenCookie: [] }],
        },
        preHandler: verifyUser,
    }, logoutUserController);

    fastify.post("/logout-all", {
        schema: {
            tags: ["Auth"],
            summary: "Logout from all active sessions",
            security: [{ accessTokenCookie: [] }],
        },
        preHandler: verifyUser,
    }, logoutFromAllDevicesUserController);

    fastify.patch("/user", {
        schema: {
            tags: ["Auth"],
            summary: "Update the authenticated user's profile",
            security: [{ accessTokenCookie: [] }],
            body: updateUserSchema,
        },
        preHandler: verifyUser,
    }, updateUserController);

    fastify.post(
        "/refresh",
        {
            schema: {
                tags: ["Auth"],
                summary:
                    "Refresh access token",
            },
        },
        refreshAccessTokenController
    );

    fastify.post(
        "/forgot-password",
        {
            schema: {
                tags: ["Auth"],
                summary:
                    "Request password reset",
                body: forgotPasswordSchema,
            },
        },
        forgotPasswordUserController
    );

    fastify.post(
        "/reset-password",
        {
            schema: {
                tags: ["Auth"],
                summary:
                    "Reset password",
                body: resetPasswordSchema,
            },
        },
        resetPasswordUserController
    );

}

export default userRoutes