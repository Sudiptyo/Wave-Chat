import dotenv from "dotenv";

dotenv.config();

import { app } from "./App.js";
import { connectDb } from "./Db/db.js";
import { logger } from "./Utils/logger.js";

const PORT = Number(process.env.PORT ?? "3000");

if (Number.isNaN(PORT)) {
  throw new Error("Invalid PORT value in .env");
}

const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, () => {
      logger.info({ port: PORT }, `Server is running on port`);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error({ err: err }, "❌ Failed to start server:");
    } else {
      logger.error(
        { err: err },
        "❌ Failed to start server due to an unknown error.",
      );
    }

    process.exit(1);
  }
};

startServer();
