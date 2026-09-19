import { Prisma } from "../../../generated/prisma/client.js";
import { app } from "../../App.js";
import { GOOGLE_CLIENT_ID } from "../../Config/Dotenv.js";
import { ApiError } from "../../Config/Error.js";
import { googleClient } from "../../Config/Google.js";
import { prisma } from "../../Db/prisma.js";
import { GoogleLoginData } from "../../Interfaces/Auth/google.service.interface.js";
import { createSessionService } from "./session.service.js";


const getGoogleUserService = async (data: GoogleLoginData) => {

    try {
        const { code, ipAddress, userAgent } = data;

        /*
         * Exchange Google's authorization code
         * for Google tokens.
         */
        const { tokens } = await googleClient.getToken(code);
        if (!tokens.id_token) {
            throw new ApiError(400, "Google did not return an ID token");
        }

        /*
        * Verify the ID token with Google's
        * OAuth client.
        */
        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()
        if (!payload) {
            throw new ApiError(400, "Invalid Google account information");

        }

        const googleId = payload?.sub;
        const email = payload.email?.toLowerCase();
        const emailVerified = payload.email_verified === true;
        const fullName = payload.name?.trim() || "Google User";
        // const avatar = payload.picture;

        if (!googleId) {
            throw new ApiError(400, "Google ID not found");
        }
        if (!email) {
            throw new ApiError(400, "Google account email is unavailable");
        }

        if (!emailVerified) {
            throw new ApiError(400, "Google account email is not verified");
        }

        /*
        * First check by Google's stable user ID.
        */
        let user = await prisma.user.findUnique({
            where: {
                googleId
            }
        });

        /*
         * Existing Google account.
         */
        if (user) {
            const updatedUser = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    lastLoginAt: new Date(),
                    // avatar: avatar ?? user.avatar,
                    fullName: fullName || user.fullName,
                },
                select: {
                    id: true,
                    // avatar: true,
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
                }
            });

            if (updatedUser.status !== "ACTIVE") {
                throw new ApiError(400, "User account is not active");
            }

            const session = await createSessionService({
                userId: updatedUser.id,
                userAgent,
                ipAddress
            })

            return {
                safeUser: updatedUser,

                AccessToken: session.AccessToken,

                RefreshToken: session.RefreshToken,

                session: session.session
            }
        }

        /*
        * Do not silently link a Google account
        * to an existing local account.
        */
        const existingEmailUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingEmailUser) {
            throw new ApiError(400, "An account with this email already exists. Log in with your password and link Google from account settings.");
        }
        /*
         * Generate a deterministic username for
         * a new Google account.
         *
         * google_ + 12 characters = 19 characters.
         */
        const userName = `google_${googleId.slice(0, 12)}`;
        user = await prisma.user.create({
            data: {
                fullName: fullName.slice(0, 50),
                userName,
                // avatar,
                email,
                emailVerified: true,
                mobileNo: null,
                password: null,
                googleId,
                role: "USER",
                status: "ACTIVE",
                authProvider: "GOOGLE",
            },
            select: {
                id: true,
                // avatar: true,
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
            }
        });

        if (!user) {
            throw new ApiError(400, "Google authentication failed");
        }

        const session = await createSessionService({
            userId: user.id,
            userAgent,
            ipAddress
        })

        return {

            safeUser: user,

            AccessToken: session.AccessToken,

            RefreshToken: session.RefreshToken,

            session: session.session

        };


    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error(
                { err },
                "Google authentication failed"
            );

            throw err;
        }

        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                throw new ApiError(400, "Google account information is already in use");
            }
        }

        app.log.error({ err }, "Google authentication failed");
        throw new ApiError(400, "Google authentication failed");
    }
}

export { getGoogleUserService }