import {
    createTransport,
    type SentMessageInfo,
} from "nodemailer";

import {
    EMAIL_PASS,
    EMAIL_USER,
} from "../Config/Dotenv.js";

import { app } from "../App.js";

interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
}

if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
        "EMAIL_USER or EMAIL_PASS is not defined"
    );
}

const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

const sendMail = async ({
    to,
    subject,
    html,
}: SendMailOptions): Promise<SentMessageInfo> => {
    try {
        const info =
            await transporter.sendMail({
                from: `"WaveChat" <${EMAIL_USER}>`,
                to,
                subject,
                html,
            });

        app.log.info(
            {
                messageId: info.messageId,
            },
            "Email sent successfully"
        );

        return info;
    } catch (error) {
        app.log.error(
            { err: error },
            "Failed to send email"
        );

        throw error;
    }
};

export {
    transporter,
    sendMail,
};