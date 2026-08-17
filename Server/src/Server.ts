import dotenv from "dotenv";

dotenv.config();

import { app } from "./App.js";
import { connectDb } from "./Db/db.js";

// const PORT:number = Number(process.env.PORT) || 3000;
const PORT = Number(process.env.PORT ?? "3000");

if (Number.isNaN(PORT)) {
  throw new Error("Invalid PORT value in .env");
}

const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`⚙️  Server is running on port ${PORT}`);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Failed to start server:", err.message);
    } else {
      console.error("❌ Failed to start server due to an unknown error.");
    }

    process.exit(1);
  }
};

startServer();
