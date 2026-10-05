import { CookieSerializeOptions } from "@fastify/cookie";
import { Prisma } from "../../../generated/prisma/client.js";
import { ApiError } from "../../Config/Error.js";
import { COOKIE_ENV, REFRESH_TOKEN_EXPIRY_IN_MS } from "../../Config/Dotenv.js";
import {
    ForgotPasswordData,
    GetUserData,
    LoginContext,
    LoginUserData,
    LogoutUserData,
    LogoutUserFromAllDevicesData,
    RegisterContext,
    RegisterUserData,
    ResetPasswordData,
    UpdateUserData
} from "../../Interfaces/Auth/user.service.interface.js";
import { app } from "../../App.js";
import { prisma } from "../../Db/prisma.js";
import bcrypt from "bcryptjs";
import {
    createSessionService,
    revokeAllUserSessionsService,
    revokeSessionService
} from "./session.service.js";
import crypto from "node:crypto";
import { passwordResetKey } from "../Redis/keys.js";
import { redis } from "../Redis/Redis.js";
import { sendPasswordResetEmail } from "../Email/email.service.js";


export const accessTokenCookieOptions: CookieSerializeOptions = {
    httpOnly: true,
    path: "/",
    secure: COOKIE_ENV,
    sameSite: "lax" as const,
    maxAge: 24 * 60 * 60
}


export const refreshTokenCookieOptions: CookieSerializeOptions = {
    httpOnly: true,
    path: "/",
    secure: COOKIE_ENV,
    sameSite: "lax" as const,
    maxAge: Math.floor(REFRESH_TOKEN_EXPIRY_IN_MS / 1000)
}


const safeUserSelect = {
    id: true,
    avatar: true,
    fullName: true,
    userName: true,
    mobileNo: true,
    email: true,
    emailVerified: true,
    authProvider: true,
    role: true,
    about: true,
    status: true,
    lastLoginAt: true,
    lastSeen: true,
    credits: true,
    createdAt: true,
    updatedAt: true,
} as const;


const handlePrismaError = (err: unknown): never => {

    if (
        err instanceof Prisma.PrismaClientKnownRequestError
    ) {

        if (err.code === "P2002") {

            const target = Array.isArray(err.meta?.target)
                ? err.meta.target.join(", ")
                : String(err.meta?.target ?? "");

            if (target.includes("email")) {
                throw new ApiError(
                    409,
                    "Email is already in use"
                );
            }

            if (target.includes("mobileNo")) {
                throw new ApiError(
                    409,
                    "Mobile number is already in use"
                );
            }

            if (target.includes("userName")) {
                throw new ApiError(
                    409,
                    "Username is already in use"
                );
            }

            if (target.includes("googleId")) {
                throw new ApiError(
                    409,
                    "Google account is already linked"
                );
            }

            throw new ApiError(
                409,
                "A unique user field already exists"
            );
        }

        if (err.code === "P2025") {
            throw new ApiError(
                404,
                "User not found"
            );
        }
    }

    throw err;
};


// Register user
const registerUserService = async (
    data: RegisterUserData,
    context: RegisterContext
) => {

    try {

        const {
            fullName,
            userName,
            mobileNo,
            email,
            password,
        } = data;

        app.log.info(
            {
                name: fullName,
            },
            "Registering user"
        );

        if (!password) {
            throw new ApiError(
                400,
                "Password is required"
            );
        }

        /*
         * Local registration requires
         * a mobile number and password.
         */

        const [
            existingMobile,
            existingUsername,
            existingEmail
        ] = await Promise.all([

            prisma.user.findUnique({
                where: {
                    mobileNo
                }
            }),

            prisma.user.findUnique({
                where: {
                    userName
                }
            }),

            email
                ? prisma.user.findUnique({
                    where: {
                        email
                    }
                })
                : null,

        ]);


        if (existingMobile) {
            throw new ApiError(
                409,
                "Mobile number is already in use"
            );
        }

        if (existingUsername) {
            throw new ApiError(
                409,
                "Username is already in use"
            );
        }

        if (existingEmail) {
            throw new ApiError(
                409,
                "Email is already in use"
            );
        }


        const passwordHash =
            await bcrypt.hash(password, 12);


        const user = await prisma.user.create({

            data: {
                fullName,
                userName,
                mobileNo,
                email,
                password: passwordHash,

                role: "USER",
                status: "ACTIVE",
                authProvider: "LOCAL",

            },

            select: safeUserSelect,

        });


        const session =
            await createSessionService({

                userId: user.id,

                deviceId: context.deviceId,
                deviceName: context.deviceName,
                userAgent: context.userAgent,
                ipAddress: context.ipAddress

            });


        return {

            safeUser: user,

            session: session.session,

            AccessToken: session.AccessToken,

            RefreshToken: session.RefreshToken

        };


    } catch (err: unknown) {

        if (err instanceof ApiError) {

            app.log.error(
                { err },
                "User registration failed"
            );

            throw err;
        }

        handlePrismaError(err);
    }
};


// Login user
const loginUserService = async (
    data: LoginUserData,
    context: LoginContext
) => {

    try {

        const {
            identifier,
            password
        } = data;

        if (!identifier) {
            throw new ApiError(
                400,
                "Email or mobile number is required"
            );
        }

        if (!password) {
            throw new ApiError(
                400,
                "Password is required"
            );
        }


        /*
         * Check whether the identifier is
         * an email or a mobile number.
         */

        const isEmail = identifier.includes("@");


        const normalizedIdentifier =
            isEmail
                ? identifier.toLowerCase()
                : identifier;


        const user =
            await prisma.user.findFirst({

                where: isEmail
                    ? {
                        email: normalizedIdentifier
                    }
                    : {
                        mobileNo: normalizedIdentifier
                    },
            });


        if (!user) {

            throw new ApiError(
                401,
                "Invalid email/mobile or password"
            );

        }


        if (user.status !== "ACTIVE") {

            throw new ApiError(
                403,
                "User account is not active"
            );

        }


        if (!user.password) {

            throw new ApiError(
                400,
                "Password login is not configured for this account"
            );

        }


        /*
         * Compare provided password
         * with the hashed password.
         */

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            throw new ApiError(
                401,
                "Invalid email/mobile or password"
            );

        }


        const loggedInUser =
            await prisma.user.update({

                where: {
                    id: user.id
                },

                data: {
                    lastLoginAt: new Date()
                },

                select: safeUserSelect

            });


        const session =
            await createSessionService({

                userId: loggedInUser.id,

                deviceId: context.deviceId,
                deviceName: context.deviceName,
                userAgent: context.userAgent,
                ipAddress: context.ipAddress

            });


        return {

            safeUser: loggedInUser,

            session: session.session,

            AccessToken: session.AccessToken,

            RefreshToken: session.RefreshToken

        };


    } catch (err: unknown) {

        if (err instanceof ApiError) {

            app.log.error(
                { err },
                "User login failed"
            );

            throw err;
        }

        handlePrismaError(err);
    }
};


// Get user
const getUserService = async (
    data: GetUserData
) => {

    try {

        const {
            userId
        } = data;


        const user =
            await prisma.user.findUnique({

                where: {
                    id: userId
                },

                select: safeUserSelect

            });


        if (!user) {

            throw new ApiError(
                404,
                "User not found"
            );

        }


        return {
            safeUser: user
        };


    } catch (err: unknown) {

        if (err instanceof ApiError) {

            app.log.error(
                { err },
                "Failed to get user"
            );

            throw err;
        }

        handlePrismaError(err);
    }
};


// Update user profile
const updateUserService = async (
    data: UpdateUserData
) => {

    try {

        const {
            userId,
            fullName,
            userName,
            avatar,
            about,
            email,
            mobileNo,
            currentPassword,
            newPassword,
            confirmPassword,
        } = data;


        const existingUser =
            await prisma.user.findUnique({

                where: {
                    id: userId
                },

            });


        if (!existingUser) {

            throw new ApiError(
                404,
                "User not found"
            );

        }


        const updateData: Prisma.UserUpdateInput = {};


        if (fullName !== undefined) {
            updateData.fullName = fullName;
        }


        if (avatar !== undefined) {
            updateData.avatar = avatar;
        }


        if (about !== undefined) {
            updateData.about = about;
        }


        if (userName !== undefined) {

            if (userName !== existingUser.userName) {

                const usernameExists =
                    await prisma.user.findFirst({

                        where: {
                            userName,
                            NOT: {
                                id: userId
                            }
                        }

                    });


                if (usernameExists) {

                    throw new ApiError(
                        409,
                        "Username is already in use"
                    );

                }

            }

            updateData.userName = userName;
        }


        /*
         * Google users should keep their
         * Google account email.
         */

        if (email !== undefined) {

            if (
                existingUser.authProvider === "GOOGLE" &&
                email !== existingUser.email
            ) {

                throw new ApiError(
                    400,
                    "Google account email cannot be changed"
                );

            }


            if (email !== existingUser.email) {

                const emailExists =
                    await prisma.user.findFirst({

                        where: {

                            email,

                            NOT: {
                                id: userId
                            }

                        }

                    });


                if (emailExists) {

                    throw new ApiError(
                        409,
                        "Email is already in use"
                    );

                }


                updateData.email = email;

                /*
                 * Changing an email requires
                 * email verification again.
                 */

                updateData.emailVerified = false;

            }

        }


        if (mobileNo !== undefined) {

            if (mobileNo !== existingUser.mobileNo) {

                const mobileExists =
                    await prisma.user.findFirst({

                        where: {

                            mobileNo,

                            NOT: {
                                id: userId
                            }

                        }

                    });


                if (mobileExists) {

                    throw new ApiError(
                        409,
                        "Mobile number is already in use"
                    );

                }

            }

            updateData.mobileNo = mobileNo;
        }


        if (newPassword !== undefined) {

            if (!confirmPassword) {

                throw new ApiError(
                    400,
                    "Confirm password is required"
                );

            }


            if (newPassword !== confirmPassword) {

                throw new ApiError(
                    400,
                    "Passwords do not match"
                );

            }


            /*
             * Existing password users must
             * prove ownership before changing
             * their password.
             *
             * Google users initially have no
             * password, so they can create one.
             */

            if (existingUser.password) {

                if (!currentPassword) {

                    throw new ApiError(
                        400,
                        "Current password is required"
                    );

                }


                const passwordCorrect =
                    await bcrypt.compare(
                        currentPassword,
                        existingUser.password
                    );


                if (!passwordCorrect) {

                    throw new ApiError(
                        401,
                        "Current password is incorrect"
                    );

                }

            }


            updateData.password =
                await bcrypt.hash(
                    newPassword,
                    12
                );

        }


        if (Object.keys(updateData).length === 0) {

            throw new ApiError(
                400,
                "No profile changes were provided"
            );

        }


        const updatedUser =
            await prisma.user.update({

                where: {
                    id: userId
                },

                data: updateData,

                select: safeUserSelect

            });


        return {
            safeUser: updatedUser
        };


    } catch (err: unknown) {

        if (err instanceof ApiError) {

            app.log.error(
                { err },
                "Failed to update user"
            );

            throw err;
        }

        handlePrismaError(err);
    }
};


// Logout user
const logoutUserService = async (
    data: LogoutUserData
) => {

    try {

        const {
            sessionId,
            userId
        } = data;

        await revokeSessionService({
            sessionId,
            userId
        });

        return {
            message: "User logged out successfully"
        }

    } catch (err: unknown) {

        if (err instanceof ApiError) {

            app.log.error(
                { err },
                "Failed to log out user: "
            );

            throw err;
        }

        throw err;
    }
};


// Logout user from all devices
const logoutFromAllDevicesUserService = async (
    data: LogoutUserFromAllDevicesData
) => {

    try {

        const {
            userId
        } = data;

        await revokeAllUserSessionsService({
            userId
        });

        return {
            message:
                "User logged out from all devices successfully"
        }

    } catch (err: unknown) {

        if (err instanceof ApiError) {

            app.log.error(
                { err },
                "Failed to log out user from all devices: "
            );

            throw err;
        }

        throw err;
    }
};

const refreshAccessTokenService = async () => {

    try {

    } catch (err: unknown) {
        if (err instanceof ApiError) {

        }
    }
}

const forgotPasswordService = async (data: ForgotPasswordData) => {

    try {
        const { identifier } = data;
        if (!identifier) {
            throw new ApiError(400, "Email or mobile number is required");
        }

        const isEmail = identifier.includes("@");
        const normalizedIdentifier = isEmail ? identifier.trim().toLowerCase() : identifier.trim();

        const user = await prisma.user.findFirst({
            where: isEmail ?
                {
                    email: normalizedIdentifier
                } : {
                    mobileNo: normalizedIdentifier
                }
        });

        if (!user) {
            throw new ApiError(404, "If an account exists, a password reset link has been sent");
        }

        // Generate reset token
        /*
        * Generate a cryptographically secure
        * reset token.
        */
        const resetToken =
            crypto
                .randomBytes(32)
                .toString("hex");

        /*
         * Store only the hash in Redis.
         */
        const tokenHash =
            crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");

        const key = passwordResetKey(tokenHash);

        /*
        * Token expires after 15 minutes.
        */
        await redis.set(key, user.id, "EX", 15 * 60);
        if (user.email) {
            await sendPasswordResetEmail({
                email: user.email,
                fullName: user.fullName,
                resetToken
            })
        }

        return {
            message:
                "If an account exists, a password reset link has been sent",
        };

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error(
                { err },
                "Failed to create password reset request"
            );

            throw err;
        }

        throw new ApiError(
            500,
            "Failed to process password reset request"
        );
    }
}

const resetPasswordService = async (data: ResetPasswordData) => {

    try {
        const { token, newPassword, confirmPassword } = data;
        if (!token) {
            throw new ApiError(400, "User Id is required");
        }

        if (!newPassword) {
            throw new ApiError(400, "New password is required");
        }

        if (!confirmPassword) {
            throw new ApiError(400, "Confirm password is required");
        }

        if (newPassword.trim() !== confirmPassword.trim()) {
            throw new ApiError(400, "Passwords do not match");
        }

        /*
         * Hash incoming token.
         */
        const tokenHash =
            crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");
        const key = passwordResetKey(tokenHash);

        /*
         * Redis contains the user ID.
         */
        const userId = await redis.get(key);
        if (!userId) {
            throw new ApiError(400, "Invalid or expired reset token");
        }

        const hashedPassword = await bcrypt.hash(newPassword.trim(), 12);

        /*
        * Change password and revoke
        * every existing login session.
        */
        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: {
                    id: userId
                },
                data: {
                    password: hashedPassword
                }
            });

            await tx.authSession.updateMany({
                where: {
                    userId,
                    isRevoked: false
                },
                data: {
                    isRevoked: true,
                    revokedAt: new Date(),
                }
            });
        });

        /*
        * One-time token.
        */
        await redis.del(key);

        return {
            message:
                "Password reset successfully",
        };

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error({ err }, "Failed to reset password");

            throw err;
        }

        throw new ApiError(
            500,
            "Failed to process password reset request"
        );
    }
}

const emailVerificationService = async () => {

    try {

    } catch (err: unknown) {
        if (err instanceof ApiError) {

        }
    }
}
const resendEmailVerificationService = async () => {

    try {

    } catch (err: unknown) {
        if (err instanceof ApiError) {

        }
    }
}

const deleteAccountService = async () => {

    try {

    } catch (err: unknown) {
        if (err instanceof ApiError) {

        }
    }
}


export {
    registerUserService,
    loginUserService,
    getUserService,
    updateUserService,
    logoutUserService,
    logoutFromAllDevicesUserService,
    refreshAccessTokenService,
    forgotPasswordService,
    resetPasswordService,
    emailVerificationService,
    resendEmailVerificationService,
    deleteAccountService
}