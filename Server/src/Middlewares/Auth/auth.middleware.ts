import jwt, { JwtPayload } from "jsonwebtoken";
import { AccessPayload } from "../../Interfaces/Auth/user.middleware.interface.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../../Config/Error.js";
import { app } from "../../App.js";
import { ACCESS_TOKEN_SECRET } from "../../Config/Dotenv.js";
import { prisma } from "../../Db/prisma.js";


const isAccessPayload = (payload: string | JwtPayload): payload is AccessPayload => {

    return (
        typeof payload !== "string" &&
        payload.type === "access" &&
        typeof payload.sub === "string" &&
        typeof payload.sid === "string"
    );
};

const verifyUser = async (req: FastifyRequest, reply: FastifyReply) => {

    try {
        const accessToken = req.cookies.AccessToken;

        if (!accessToken) {
            throw new ApiError(401, "Access token missing");
        }

        /*
           * Verify JWT signature and expiration.
           */
        let payload: string | JwtPayload;

        if (!ACCESS_TOKEN_SECRET) {
            throw new Error("ACCESS_TOKEN_SECRET is not defined");
        }

        try {
            payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

        } catch (err: unknown) {
            if (err instanceof jwt.TokenExpiredError) {
                throw new ApiError(401, "Access token expired");
            }

            throw new ApiError(
                401,
                "Invalid access token",
            );
        }

        if (!isAccessPayload(payload)) {
            throw new ApiError(
                401,
                "Invalid access token",
            );
        }

        /*
        * Find the user's active session.
        *
        * This is what makes server-side
        * session revocation work.
        */

        const session = await prisma.authSession.findFirst({
            where: {
                id: payload.sid,
                userId: payload.sub,
                isRevoked: false
            }
        })

        if (!session) {
            throw new ApiError(401, "Session is invalid or has been revoked");
        }

        /*
          * Check session expiration explicitly.
          */
        if (session.expiresAt.getTime() < Date.now()) {
            throw new ApiError(401, "Session has expired");
        }

        /*
          * Make sure the user still exists.
          *
          * Only select the fields required
          * for authentication.
          */

        const user = await prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
            select: {
                id: true,
                status: true
            }
        })

        if (!user) {
            throw new ApiError(401, "User not found");
        }

        /*
        * Don't allow suspended/inactive
        * accounts to authenticate.
        */
        if (user.status === "SUSPENDED" || user.status === "INACTIVE") {
            throw new ApiError(401, "User is suspended or inactive");
        }

        /*
         * Attach only the authenticated
         * identity to Fastify's request.
         */
        req.user = {
            userId: payload.sub,
            sessionId: payload.sid
        }

        /*
         * Authentication successful.
         */
        return;

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.warn({ statusCode: err.statusCode, message: err.message }, "User authentication failed");
            throw err;
        }

        // Unexpected server error.
        app.log.error({ err: err }, "Unexpected error while verifying user");
        throw new ApiError(500, "User authentication failed");
    }
}

export { verifyUser };