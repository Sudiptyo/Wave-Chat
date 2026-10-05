import { app } from "../../App.js";
import { emailQueue } from "./Queue.js";

interface PasswordResetEmailJob {
    type: "PASSWORD_RESET";
    email: string;
    fullName: string;
    resetToken: string;
}

const addPasswordResetEmailJob = async (data: Omit<PasswordResetEmailJob, "type">) => {

    try {
        await emailQueue.add("password-reset", {
            type: "PASSWORD_RESET",
            ...data
        }, {
            jobId: `password-reset:${Date.now()}`,
        });

    } catch (err) {
        app.log.error({ err: err }, "Failed to add password reset email job");
        throw err;
    }
}

export { addPasswordResetEmailJob };
export type { PasswordResetEmailJob };