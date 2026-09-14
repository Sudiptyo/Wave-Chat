import fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import compress from "@fastify/compress";
import sensible from "@fastify/sensible";
import crypto from "node:crypto";
import { COOKIE_SECRET, CORS_ORIGIN, ENV, LOGGER } from "./Config/Dotenv.js";
import { ZodTypeProvider, serializerCompiler, validatorCompiler, hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod"
import { ZodError } from 'zod';
import { ApiError } from "./Config/Error.js";

const app = fastify({
  logger: {
    level: LOGGER,
    redact: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers['set-cookie']",
    ]
  },
  trustProxy: ENV === "production",
  requestIdHeader: "x-request-id",
  genReqId: () => crypto.randomUUID(),
}).withTypeProvider<ZodTypeProvider>();

await app.register(cors, {
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
})

await app.register(helmet, {
  global: true
})

await app.register(cookie, {
  secret: COOKIE_SECRET
})

await app.register(rateLimit, {
  global: true,
  max: 100,
  timeWindow: "1 minute",
})

await app.register(compress, {
  global: true,
  threshold: 1024,
})

await app.register(sensible);

app.setSerializerCompiler(serializerCompiler);

app.setValidatorCompiler(validatorCompiler);


app.setErrorHandler((err, request, reply) => {
  if (err instanceof ApiError) {
    return reply.status(err.statusCode).send({
      success: false,
      message: err.message,
      retryable: err.retryable,
    });
  }

  if (err instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
      retryable: false,
    });
  }


  if (hasZodFastifySchemaValidationErrors(err)) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      retryable: false,
    });
  }

  request.log.error({ err }, "Unhandled request error");

  throw new ApiError(500, "Internal Server Error", false);
});

// 404 middleware
app.setNotFoundHandler((_request, reply) => {
  reply.status(404).send({
    success: false,
    message: "Route not found",
    retryable: false,
  });
});

export { app };
