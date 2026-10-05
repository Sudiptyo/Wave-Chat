import { Job, Worker } from "bullmq";
import { Redis } from "ioredis";
import { REDIS_URL } from "../../Config/Dotenv.js";
import type { PasswordResetEmailJob } from "./producer.service.js";
import { EMAIL_QUEUE_NAME } from "./Queue.js";
import { sendPasswordResetEmail } from "../Email/email.service.js";

const workerConnection = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
});

const emailWorker = new Worker<PasswordResetEmailJob>(
    EMAIL_QUEUE_NAME,
    async (job: Job<PasswordResetEmailJob>) => {
        switch (job.data.type) {
            case "PASSWORD_RESET":
                await sendPasswordResetEmail({
                    email: job.data.email,
                    fullName: job.data.fullName,
                    resetToken: job.data.resetToken,
                });

                return {
                    success: true,
                };

            default:
                throw new Error(
                    `Invalid job type: ${job.data.type}`
                );
        }
    },
    {
        connection: workerConnection,
        concurrency: 5,
    }
);

emailWorker.on("completed", (job) => {
    console.log(`Email job completed: ${job.id}`);
});

emailWorker.on("failed", (job, error) => {
    console.error(
        `Email job failed: ${job?.id}`,
        error
    );
});

export {
    emailWorker,
};