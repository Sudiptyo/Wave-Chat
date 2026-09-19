import { FastifyReply, FastifyRequest } from "fastify";
import crypto from "node:crypto";
import { GOOGLE_SCOPES, googleClient } from "../../Config/Google.js";
import { ApiError } from "../../Config/Error.js";
import { app } from "../../App.js";
import { getGoogleUserService } from "../../Services/Auth/google.service.js";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../../Services/Auth/user.service.js";
import { CORS_ORIGIN } from "../../Config/Dotenv.js";


const googleLoginController = async (req: FastifyRequest, reply: FastifyReply) => {

    try {
        /*
       * Generate a new state value for every
       * Google authentication request.
       */
        const state = crypto.randomBytes(32).toString("hex");
        const url = googleClient.generateAuthUrl({
            access_type: "online",
            scope: GOOGLE_SCOPES,
            state,
            include_granted_scopes: true
        })

        /*
         * Store the state in a signed,
         * HTTP-only cookie.
         */
        reply.setCookie("GoogleOAuthState", state, {
            httpOnly: true,
            signed: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 10 * 60
        });

        reply.redirect(url);

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error({ err: err }, "Failed to start Google authentication");
            throw err;
        }

        throw err;
    }
}

const googleCallbackController = async (req: FastifyRequest, reply: FastifyReply) => {

    try {
        const query = req.query as {
            code?: string,
            state?: string,
            error?: string
        }

        if (query.error) {
            throw new ApiError(400, `Google authentication was cancelled or denied: ${query.error}`);
        }

        if (!query.code || !query.state) {
            throw new ApiError(400, "Invalid Google OAuth response");
        }

        /*
       * Verify the OAuth state to protect
       * against CSRF attacks.
       */
        const stateCookie = req.unsignCookie(req.cookies.GoogleOAuthState ?? "");
        if (!stateCookie.valid || stateCookie.value !== query.state) {
            throw new ApiError(400, "Invalid Google OAuth state");
        }

        /*
         * The state cookie is single-use.
         */
        reply.clearCookie("GoogleOAuthState", {
            path: "/"
        })

        const user = await getGoogleUserService({
            code: query.code,
            userAgent: req.headers["user-agent"] as string | undefined,
            ipAddress: req.ip
        });

        /*
         * Google authentication is complete.
         *
         * From this point onward WaveChat uses
         * its own AccessToken and RefreshToken.
         */
        reply
            .setCookie("AccessToken", user.AccessToken, accessTokenCookieOptions)
            .setCookie("RefreshToken", user.RefreshToken, refreshTokenCookieOptions);

        return reply.redirect(`${CORS_ORIGIN}`);

    } catch (err: unknown) {
        if (err instanceof ApiError) {
            app.log.error({ err: err }, "Failed to complete Google authentication");
            throw err;
        }

        throw err;
    }
}

export { googleLoginController, googleCallbackController };