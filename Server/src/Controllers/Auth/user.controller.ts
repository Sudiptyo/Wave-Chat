import { FastifyReply, FastifyRequest } from "fastify"
import { ApiError } from "../../Config/Error.js"
import { forgotPasswordSchema, loginUserSchema, registerUserSchema, resetPasswordSchema, updateUserSchema } from "../../Schemas/Auth/user.schemas.js"
import { accessTokenCookieOptions, forgotPasswordService, getUserService, loginUserService, logoutFromAllDevicesUserService, logoutUserService, refreshTokenCookieOptions, registerUserService, resetPasswordService, updateUserService } from "../../Services/Auth/user.service.js";
import { LoginUserData, RegisterUserData, UpdateUserData } from "../../Interfaces/Auth/user.service.interface.js";
import { app } from "../../App.js";
import { AuthenticateUser } from "../../Interfaces/Auth/user.middleware.interface.js";
import { rotateRefreshTokenService } from "../../Services/Auth/session.service.js";


const registerUserController = async (req: FastifyRequest, reply: FastifyReply) => {

    try {

        const data = registerUserSchema.parse(req.body);

        const User: RegisterUserData = {
            fullName: data.fullName.trim(),
            userName: data.userName.trim().toLowerCase(),
            mobileNo: data.mobileNo.trim(),
            email: data.email?.trim().toLowerCase(),
            password: data.password.trim(),
        }

        const user = await registerUserService(User, {
            userAgent: req.headers["user-agent"] as string,
            ipAddress: req.ip
        })

        if (!user) {
            throw new ApiError(400, "Registration failed");
        }

        reply
            .setCookie("AccessToken", user.AccessToken, accessTokenCookieOptions)
            .setCookie("RefreshToken", user.RefreshToken, refreshTokenCookieOptions);

        return reply.status(201).send({
            success: true,
            message: "User registered successfully",
            data: {
                user: user.safeUser
            }
        })

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error({ err }, "Failed to register user");
            throw err;
        }

        throw err;
    }
}

const loginUserController = async (req: FastifyRequest, reply: FastifyReply) => {

    try {
        const data = loginUserSchema.parse(req.body);

        const User: LoginUserData = {
            identifier: data.identifier.trim(),
            password: data.password.trim(),
        }

        const user = await loginUserService(User, {
            userAgent: req.headers["user-agent"] as string,
            ipAddress: req.ip
        })

        if (!user) {
            throw new ApiError(400, "Login failed");
        }

        reply
            .setCookie("AccessToken", user.AccessToken, accessTokenCookieOptions)
            .setCookie("RefreshToken", user.RefreshToken, refreshTokenCookieOptions);

        return reply.status(200).send({
            success: true,
            message: "User logged in successfully",
            data: {
                user: user.safeUser
            }
        })

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error({ err: err }, "Failed to login user");
            throw err;
        }

        throw err;
    }
}

const getUserController = async (req: FastifyRequest, reply: FastifyReply) => {

    try {
        const user = await getUserService({ userId: (req.user as AuthenticateUser).userId });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return reply.status(200).send({
            success: true,
            data: {
                user: user.safeUser
            }
        })

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error({ err }, "Failed to get user",
            );
            throw err;
        }

        throw err;
    }
}

const logoutUserController = async (req: FastifyRequest, reply: FastifyReply) => {

    try {
        const user = req.user as AuthenticateUser;

        await logoutUserService({
            userId: user.userId,
            sessionId: user.sessionId,
        })

        reply
            .clearCookie("AccessToken", accessTokenCookieOptions)
            .clearCookie("RefreshToken", refreshTokenCookieOptions);

        return reply.status(200).send({
            success: true,
            message: "User logged out successfully"
        })

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error({ err: err }, "Failed to log out user");
            throw err;
        }

        throw err;
    }
}

const logoutFromAllDevicesUserController = async (req: FastifyRequest, reply: FastifyReply) => {

    try {
        const user = req.user as AuthenticateUser;

        await logoutFromAllDevicesUserService({
            userId: user.userId,
        })

        reply.clearCookie("AccessToken", accessTokenCookieOptions)
            .clearCookie("RefreshToken", refreshTokenCookieOptions);

        return reply.status(200).send({
            success: true,
            message: "User logged out from all devices successfully"
        })


    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error({ err: err }, "Failed to log out user from all devices");
            throw err;
        }

        throw err;
    }
}

const updateUserController = async (req: FastifyRequest, reply: FastifyReply) => {

    try {

        const data = updateUserSchema.parse(req.body);

        const authenticatedUser =
            req.user as AuthenticateUser;


        const User: UpdateUserData = {

            userId:
                authenticatedUser.userId,

            fullName:
                data.fullName?.trim(),

            userName:
                data.userName?.trim().toLowerCase(),

            avatar:
                data.avatar?.trim(),

            about:
                data.about?.trim(),

            email:
                data.email?.trim().toLowerCase(),

            mobileNo:
                data.mobileNo?.trim(),

            currentPassword:
                data.currentPassword,

            newPassword:
                data.newPassword,

            confirmPassword:
                data.confirmPassword,

        };


        const user = await updateUserService(User);

        if (!user) {

            throw new ApiError(400, "User not found");
        }


        return reply.status(200).send({

            success: true,

            message:
                "User profile updated successfully",

            data: {
                user: user.safeUser
            }

        });


    } catch (err: unknown) {

        if (err instanceof ApiError) {

            app.log.error(
                { err },
                "Failed to update user"
            );

            throw err;
        }

        throw err;
    }
};

const verifyEmailController = async () => {

    try {

    } catch (err: unknown) {
        if (err instanceof ApiError) {

        }
    }
}

const resendEmailVerificationController = async (req: FastifyRequest, reply: FastifyReply) => {

    try {

    } catch (err: unknown) {
        if (err instanceof ApiError) {

        }
    }
}

const deleteUserController = async (req: FastifyRequest, reply: FastifyReply) => {

    try {

    } catch (err: unknown) {
        if (err instanceof ApiError) {

        }
    }
}

const forgotPasswordUserController = async (req: FastifyRequest, reply: FastifyReply) => {

    try {
        const data = forgotPasswordSchema.parse(req.body);

        const res = await forgotPasswordService({
            identifier: data.identifier,
        });

        return reply.status(200).send({
            success: true,
            message: res.message,
        });

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error(
                { err },
                "Failed to process forgot password"
            );

            throw err;
        }

        throw err;
    }
}

const resetPasswordUserController = async (req: FastifyRequest, reply: FastifyReply) => {

    try {
        const data = resetPasswordSchema.parse(req.body);

        const res = await resetPasswordService({
            token: data.token,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
        })

        return reply.status(200).send({
            success: true,
            message: res.message,
        });

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error(
                { err },
                "Failed to reset password"
            );

            throw err;
        }

        throw err;
    }
}

const refreshAccessTokenController = async (req: FastifyRequest, reply: FastifyReply) => {

    try {
        const refreshToken = req.cookies.RefreshToken;

        if (!refreshToken) {
            throw new ApiError(401, "Refresh token not found");
        }

        const res = await rotateRefreshTokenService({
            refreshToken
        });

        reply.setCookie("AccessToken", res.AccessToken, accessTokenCookieOptions);
        reply.setCookie("RefreshToken", res.RefreshToken, refreshTokenCookieOptions);

        return reply.status(200).send({
            success: true,
            message: "Access token refreshed successfully",
        })

    } catch (err: unknown) {
    if (err instanceof ApiError) {
        app.log.error(
            { err },
            "Failed to refresh access token"
        );

        throw err;
    }

    throw err;
}
}

export { registerUserController, loginUserController, getUserController, logoutUserController, logoutFromAllDevicesUserController, verifyEmailController, resendEmailVerificationController, updateUserController, deleteUserController, forgotPasswordUserController, resetPasswordUserController, refreshAccessTokenController }