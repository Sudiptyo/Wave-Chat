import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { REDIS_URL } from "../../Config/Dotenv.js";

// const connection = {
//     host: "localhost",
//     port: 6379
// }

const EMAIL_QUEUE_NAME = "email";
const queueConnection = new Redis(REDIS_URL);

const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
    connection: queueConnection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 3000
        },
    },
});

export { EMAIL_QUEUE_NAME, emailQueue };