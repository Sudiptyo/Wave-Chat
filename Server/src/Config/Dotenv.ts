import { StringValue } from "ms";

const PORT = Number(process.env.PORT ?? 3000);

if (Number.isNaN(PORT)) {
    throw new Error("Invalid PORT is defined");
}

const ENV = process.env.ENV ?? "development";

const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const LOGGER = ENV === "development" ? "debug" : "info";

// const COOKIE_ENV = (ENV ?? "development") ? false : true;
const COOKIE_ENV = ENV === "production";

const COOKIE_SECRET = process.env.COOKIE_SECRET;

if (!COOKIE_SECRET) {
    throw new Error("COOKIE_SECRET is not defined");
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
}

const ACCESS_TOKEN_EXPIRY = (process.env.ACCESS_TOKEN_EXPIRY as StringValue) ?? "1d";

if (!ACCESS_TOKEN_EXPIRY) {
    throw new Error("ACCESS_TOKEN_EXPIRY is not defined");
}

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
}

const REFRESH_TOKEN_EXPIRY = (process.env.REFRESH_TOKEN_EXPIRY as StringValue) ?? "10d";

if (!REFRESH_TOKEN_EXPIRY) {
    throw new Error("REFRESH_TOKEN_EXPIRY is not defined");
}

const REFRESH_TOKEN_EXPIRY_IN_MS = Number(process.env.REFRESH_TOKEN_EXPIRY_IN_MS ?? 864000000);

if (Number.isNaN(REFRESH_TOKEN_EXPIRY_IN_MS)) {
    throw new Error("Invalid REFRESH_TOKEN_EXPIRY_IN_MS is defined");
}

const DATABASE_URL = process.env.DATABASE_URL;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not defined");
}

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is not defined");
}

const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

if (!GOOGLE_CALLBACK_URL) {
    throw new Error("GOOGLE_CALLBACK_URL is not defined");
}


export { PORT, ENV, CORS_ORIGIN, LOGGER, COOKIE_ENV, COOKIE_SECRET, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY_IN_MS, DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL };