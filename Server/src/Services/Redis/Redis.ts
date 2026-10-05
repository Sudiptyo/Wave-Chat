import { Redis } from "ioredis";
import { REDIS_URL } from "../../Config/Dotenv.js";
import { app } from "../../App.js";

const redis = new Redis(REDIS_URL);

redis.on("error", (err) => app.log.error({ err: err }, "Redis Client error "));

redis.on("connect", () => app.log.info("Redis Client connected to server"));

export { redis };