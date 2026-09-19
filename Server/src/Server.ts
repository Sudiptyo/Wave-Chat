import "dotenv/config";
import { app } from "./App.js";
// import { connectDb } from "./Db/dbMongo.js";
import { connectDb, disconnectDb } from "./Db/db.js"
import { PORT } from "./Config/Dotenv.js";

const startServer = async () => {
  try {
    await connectDb();
    await app.ready();

    app.listen({ port: PORT });
    app.log.info("PostgreSQL + Prisma initialized");
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

const stopServer = async () => {
  try {
    await disconnectDb();
    await app.close();
  } catch (err: unknown) {
    if (err instanceof Error) {
      app.log.error({ err: err }, "Server failed to stop: ");
    } else {
      app.log.fatal(
        { err: err },
        "Server failed to stop due to unknown error",
      );
    }
  }
};

await startServer();
