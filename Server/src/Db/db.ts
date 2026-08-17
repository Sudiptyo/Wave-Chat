import { error } from "console";
import { connect } from "mongoose";

const connectDb = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing."); // Without this: connect() receives -> string | undefined
    }

    await connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ MongoDB connection error:", err.message);
    } else {
      console.error("❌ Unknown MongoDB connection error");
    }

    process.exit(1); // Stop the server if DB connection fails
  }
};

export { connectDb };
