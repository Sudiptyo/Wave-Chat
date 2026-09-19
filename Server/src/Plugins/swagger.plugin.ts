import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";


const swaggerPlugin = fp(async (app) => {

    await app.register(swagger, {

        openapi: {

            openapi: "3.0.3",

            info: {
                title: "Wave Chat API",

                description:
                    "Backend API for authentication, account management, messaging, and user services.",

                version: "1.0.0",
            },

            servers: [

                {
                    url: "http://localhost:3000",

                    description:
                        "Development server",
                },

            ],

            tags: [

                {
                    name: "Auth",

                    description:
                        "Authentication and account management",
                },

            ],

            components: {

                securitySchemes: {

                    accessTokenCookie: {

                        type: "apiKey",

                        in: "cookie",

                        name: "AccessToken",

                    },

                    refreshTokenCookie: {

                        type: "apiKey",

                        in: "cookie",

                        name: "RefreshToken",

                    },

                },

            },

        },

    });


    await app.register(swaggerUi, {

        routePrefix: "/docs",

        uiConfig: {

            docExpansion: "list",

            deepLinking: true,

        },

        staticCSP: true,

    });

});


export {
    swaggerPlugin
};