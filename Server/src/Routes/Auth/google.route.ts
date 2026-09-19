import {
    FastifyPluginAsync
} from "fastify";
import { googleCallbackController, googleLoginController } from "../../Controllers/Auth/google.controller.js";



const googleRoutes: FastifyPluginAsync =
    async (fastify) => {

        fastify.get(
            "/google",
            {
                schema: {
                    tags: ["Auth"],
                    summary: "Start Google OAuth login" 
                }
            },
            googleLoginController
        );


        fastify.get(
            "/google/callback",
            {
                schema: {
                    tags: ["Auth"],
                    summary: "Handle Google OAuth callback"
                }
            },
            googleCallbackController
        );

    };


export default googleRoutes;