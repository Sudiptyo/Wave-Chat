import { connect } from "mongoose";
import { app } from "../App.js";

const connectDb = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing."); // Without this: connect() receives -> string | undefined
    }

    await connect(MONGO_URI);
    app.log.info("MongoDB connected");
  } catch (err: unknown) {
    if (err instanceof Error) {
      app.log.error({ err: err }, "MongoDB connection error:");
    } else {
      app.log.error("Unknown MongoDB connection error");
    }

    process.exit(1); // Stop the server if DB connection fails
  }
};

export { connectDb };
