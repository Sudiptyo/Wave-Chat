import { app } from "../App.js";
import { prisma } from "./prisma.js";

const connectDb = async () => {
    try {
        await prisma.$connect();

        await prisma.$queryRaw`SELECT 1`;

        app.log.info("PostgreSQL connected");
    } catch (err: unknown) {
        app.log.error({ err: err }, "PostgreSQL connection failed");
        process.exit(1);
    }
};

const disconnectDb = async () => {
    await prisma.$disconnect();
};

export { connectDb, disconnectDb };