

const PORT = Number(process.env.PORT ?? 3000);

if (Number.isNaN(PORT)) {
    throw new Error("Invalid PORT is defined");
}

const ENV = process.env.ENV ?? "development";

const CORS_ORIGIN = process.env.CORS_ORIGIN ?? " http://localhost:5173";

const LOGGER = ENV === "development" ? "debug" : "info";

const COOKIE_ENV = (ENV ?? "development") ? false : true;

const COOKIE_SECRET = process.env.COOKIE_SECRET;

if (!COOKIE_SECRET) {
    throw new Error("COOKIE_SECRET is not defined");
}


export { PORT, ENV, CORS_ORIGIN, LOGGER, COOKIE_ENV, COOKIE_SECRET }