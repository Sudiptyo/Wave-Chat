import "dotenv/config";
import { app } from "./App.js";
import { connectDb } from "./Db/db.js";
import { PORT } from "./Config/Dotenv.js";

const startServer = async () => {
  try {
    await app.ready();
    // await connectDb();

    app.listen({ port: PORT });
  } catch (err: unknown) {
    if (err instanceof Error) {
      app.log.error({ err: err }, "Server failed to start: ");
    } else {
      app.log.fatal(
        { err: err },
        "Server failed to start due to unknown error",
      );
    }

    process.exit(1);
  }
};

startServer();
