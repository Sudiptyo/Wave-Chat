import { google } from "googleapis";
import { config } from "googleapis/build/src/apis/config/index.js";
import crypto from "node:crypto";
import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./Dotenv.js";

const googleClient = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL
)

const GOOGLE_SCOPES = [
    "openid",
    "email",
    "profile"
];

export { googleClient, GOOGLE_SCOPES };