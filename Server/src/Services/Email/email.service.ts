import { render } from "@react-email/render";
import PasswordResetEmail from "../../Templates/password-reset.js";

import {
    CORS_ORIGIN,
} from "../../Config/Dotenv.js";

import {
    sendMail,
} from "../../Utils/nodeMailer.js";

import { app } from "../../App.js";

interface PasswordResetEmailData {
    email: string;
    fullName: string;
    resetToken: string;
}

const sendPasswordResetEmail = async (
    data: PasswordResetEmailData
) => {
    try {
        const resetUrl =
            `${CORS_ORIGIN}/reset-password?token=${encodeURIComponent(
                data.resetToken
            )}`;

        const html = await render(
            PasswordResetEmail({
                fullName: data.fullName,
                resetUrl,
            })
        );

        await sendMail({
            to: data.email,
            subject:
                "Reset your WaveChat password",
            html,
        });
    } catch (err) {
        app.log.error(
            { err },
            "Failed to send password reset email"
        );

        throw err;
    }
};

export {
    sendPasswordResetEmail,
};