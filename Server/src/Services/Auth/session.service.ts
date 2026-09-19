import { ApiError } from "../../Config/Error.js"
import { randomUUID } from "node:crypto";

import {
    CreateSessionData,
    FindActiveSessionData,
    FindSessionData,
    RevokeAllUserSessionData,
    RevokeSessionData,
    RotateRefreshTokenData
} from "../../Interfaces/Auth/session.service.interface.js"

import { prisma } from "../../Db/prisma.js"

import {
    ACCESS_TOKEN_EXPIRY,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY_IN_MS,
    REFRESH_TOKEN_SECRET
} from "../../Config/Dotenv.js";

import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";

import { app } from "../../App.js";


// Create session
const createSessionService = async (data: CreateSessionData) => {

    try {

        const {
            userId,
            deviceId,
            deviceName,
            userAgent,
            ipAddress
        } = data;

        const expiresAt = new Date(
            Date.now() + REFRESH_TOKEN_EXPIRY_IN_MS
        );

        const lastActiveAt = new Date();

        /*
         * Generate the session ID before creating
         * the JWT because the JWT contains the session ID.
         */
        const sessionId = randomUUID();

        if (!ACCESS_TOKEN_SECRET) {

            throw new Error(
                "ACCESS_TOKEN_SECRET is not defined"
            );

        }

        if (!REFRESH_TOKEN_SECRET) {

            throw new Error(
                "REFRESH_TOKEN_SECRET is not defined"
            );

        }

        const accessToken = jwt.sign(

            {
                sub: userId,
                sid: sessionId,
                type: "access"
            },

            ACCESS_TOKEN_SECRET,

            {
                expiresIn: ACCESS_TOKEN_EXPIRY
            }

        );

        const refreshToken = jwt.sign(

            {
                sub: userId,
                sid: sessionId,
                type: "refresh"
            },

            REFRESH_TOKEN_SECRET,

            {
                expiresIn: REFRESH_TOKEN_EXPIRY
            }

        );

        const refreshTokenHash = await bcrypt.hash(
            refreshToken,
            12
        );

        const session = await prisma.authSession.create({

            data: {

                id: sessionId,

                userId,

                deviceId,

                deviceName,

                userAgent,

                ipAddress,

                refreshTokenHash,

                expiresAt,

                lastActiveAt,

                isRevoked: false,

            }

        });

        return {

            session,

            AccessToken: accessToken,

            RefreshToken: refreshToken

        };

    } catch (err: unknown) {

        if (err instanceof ApiError) {

            app.log.error(
                { err },
                "Failed to generate session"
            );

        }

        throw err;

    }

};


// Check if session exists
const findSessionService = async (data: FindSessionData) => {

    try {

        const {
            sessionId,
            userId
        } = data;

        if (!userId) {

            throw new ApiError(
                400,
                "userId is required"
            );

        }

        return await prisma.authSession.findFirst({

            where: {

                id: sessionId,

                userId,

            }

        });

    } catch (err: unknown) {

        if (err instanceof ApiError) {

            app.log.error(
                { err },
                "Failed to find session"
            );

        }

        throw err;

    }

};


// Check if session is valid
const findActiveSessionService = async (
    data: FindActiveSessionData
) => {

    try {

        const {
            sessionId,
            userId
        } = data;

        const session =
            await prisma.authSession.findFirst({

                where: {

                    id: sessionId,

                    userId,

                    isRevoked: false

                }

            });

        if (!session) {

            throw new ApiError(
                401,
                "Session is invalid or has been revoked"
            );

        }

        if (
            session.expiresAt.getTime() <= Date.now()
        ) {

            throw new ApiError(
                401,
                "Session has expired"
            );

        }

        return {
            session
        };

    } catch (err: unknown) {

        if (err instanceof ApiError) {

            app.log.error(
                { err },
                "Failed to find active session"
            );

        }

        throw err;

    }

};


// Log out from current device -> Revoke this session
const revokeSessionService = async (
    data: RevokeSessionData
) => {

    try {

        const {
            sessionId,
            userId
        } = data;

        // Check if not already revoked

        const session =
            await prisma.authSession.findFirst({

                where: {

                    id: sessionId,

                    userId,

                    isRevoked: false

                }

            });

        if (!session) {

            throw new ApiError(
                400,
                "Session has already been revoked"
            );

        }

        return await prisma.authSession.update({

            where: {

                id: sessionId,

            },

            data: {

                isRevoked: true,

                revokedAt: new Date(),

            },

        });

    } catch (err: unknown) {

        if (err instanceof ApiError) {

            app.log.error(
                { err },
                "Failed to revoke session"
            );

        }

        throw err;

    }

};


// Log out from all devices -> Revoke every session
const revokeAllUserSessionsService = async (
    data: RevokeAllUserSessionData
) => {

    try {

        const {
            userId
        } = data;

        const res =
            await prisma.authSession.updateMany({

                where: {

                    userId,

                    isRevoked: false,

                },

                data: {

                    isRevoked: true,

                    revokedAt: new Date()

                }

            });

        return res.count;

    } catch (err: unknown) {

        if (err instanceof ApiError) {

            app.log.error(
                { err },
                "Failed to revoke all user sessions"
            );

        }

        throw err;

    }

};


const rotateRefreshTokenService = async (
    data: RotateRefreshTokenData
) => {

    try {

        const {
            refreshToken
        } = data;

        if (!ACCESS_TOKEN_SECRET) {

            throw new Error(
                "ACCESS_TOKEN_SECRET is not defined"
            );

        }

        if (!REFRESH_TOKEN_SECRET) {

            throw new Error(
                "REFRESH_TOKEN_SECRET is not defined"
            );

        }

        let payload: {

            sub?: string;

            sid?: string;

            type?: string;

        };

        try {

            payload = jwt.verify(
                refreshToken,
                REFRESH_TOKEN_SECRET
            ) as typeof payload;

        } catch (err) {

            if (
                err instanceof jwt.TokenExpiredError
            ) {

                throw new ApiError(
                    401,
                    "Refresh token has expired"
                );

            }

            throw new ApiError(
                401,
                "Invalid refresh token"
            );

        }

        if (
            payload.type !== "refresh" ||
            !payload.sub ||
            !payload.sid
        ) {

            throw new ApiError(
                401,
                "Invalid refresh token payload"
            );

        }

        const session =
            await prisma.authSession.findFirst({

                where: {

                    id: payload.sid,

                    userId: payload.sub,

                },

            });

        if (!session) {

            throw new ApiError(
                401,
                "Session not found"
            );

        }

        if (session.isRevoked) {

            throw new ApiError(
                401,
                "Session has been revoked"
            );

        }

        if (
            session.expiresAt.getTime() <= Date.now()
        ) {

            throw new ApiError(
                401,
                "Session has expired"
            );

        }

        if (!session.refreshTokenHash) {

            throw new ApiError(
                401,
                "Refresh token is invalid"
            );

        }

        /*
         * Compare incoming refresh token
         * against the stored bcrypt hash.
         */

        const isValidRefreshToken =
            await bcrypt.compare(
                refreshToken,
                session.refreshTokenHash
            );

        if (!isValidRefreshToken) {

            /*
             * Refresh-token mismatch can indicate
             * token reuse. Revoke the session.
             */

            await prisma.authSession.update({

                where: {

                    id: session.id,

                },

                data: {

                    isRevoked: true,

                    revokedAt: new Date()

                }

            });

            throw new ApiError(
                401,
                "Invalid refresh token"
            );

        }


        // Rotate refresh token.

        const newAccessToken = jwt.sign(

            {

                sub: session.userId,

                sid: session.id,

                type: "access",

            },

            ACCESS_TOKEN_SECRET,

            {

                expiresIn: ACCESS_TOKEN_EXPIRY

            }

        );


        const newRefreshToken = jwt.sign(

            {

                sub: session.userId,

                sid: session.id,

                type: "refresh"

            },

            REFRESH_TOKEN_SECRET,

            {

                expiresIn: REFRESH_TOKEN_EXPIRY

            }

        );


        const newRefreshTokenHash =
            await bcrypt.hash(
                newRefreshToken,
                12
            );


        const updatedSession =
            await prisma.authSession.update({

                where: {

                    id: session.id,

                },

                data: {

                    refreshTokenHash:
                        newRefreshTokenHash,

                    lastActiveAt:
                        new Date(),

                },

            });


        return {

            session: updatedSession,

            AccessToken: newAccessToken,

            RefreshToken: newRefreshToken,

        };

    } catch (err: unknown) {

        if (err instanceof ApiError) {

            app.log.error(
                { err },
                "Failed to rotate refresh token"
            );

        }

        throw err;

    }

};


export {
    createSessionService,
    findSessionService,
    findActiveSessionService,
    revokeSessionService,
    revokeAllUserSessionsService,
    rotateRefreshTokenService
};