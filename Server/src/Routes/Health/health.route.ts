import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../../Db/prisma.js";
import { redis } from "../../Services/Redis/Redis.js";
import { healthResponseSchema } from "../../Schemas/Health/health.schema.js";


const healthRoute: FastifyPluginAsync = async (app) => {
    app.get(
        "/",
        {
            schema: {
                tags: ["Health"],
                summary: "Check server health",
                description:
                    "Checks the health of the WaveChat server, PostgreSQL database, and Redis.",

                response: {
                    200: healthResponseSchema,
                    503: healthResponseSchema,
                },
            },
        },

        async (_request, reply) => {
            const checks: {
                server: "ok";
                postgres: "ok" | "down";
                redis: "ok" | "down";
            } = {
                server: "ok",
                postgres: "down",
                redis: "down",
            };

            // PostgreSQL
            try {
                await prisma.$queryRaw`SELECT 1`;

                checks.postgres = "ok";
            } catch (err) {
                app.log.error(
                    { err },
                    "PostgreSQL health check failed"
                );

                checks.postgres = "down";
            }

            // Redis
            try {
                const response = await redis.ping();

                checks.redis =
                    response === "PONG"
                        ? "ok"
                        : "down";
            } catch (err) {
                app.log.error(
                    { err },
                    "Redis health check failed"
                );

                checks.redis = "down";
            }

            const healthy =
                checks.server === "ok" &&
                checks.postgres === "ok" &&
                checks.redis === "ok";

            return reply
                .status(healthy ? 200 : 503)
                .send({
                    success: healthy,
                    status: healthy ? "ok" : "degraded",
                    timestamp: new Date().toISOString(),
                    checks,
                });
        }
    );
};

export default healthRoute;