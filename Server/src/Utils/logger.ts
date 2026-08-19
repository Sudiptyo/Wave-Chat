import pino from "pino";

const PINO_ENV = process.env.PINO_ENV ?? "development";
const PINO_LEVEL = process.env.PINO_LEVEL ?? "info";

const logger = pino({
  level: PINO_LEVEL,

  ...(PINO_ENV !== "production" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  }),
});

export { logger };
