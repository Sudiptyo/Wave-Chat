import { DATABASE_URL } from "../Config/Dotenv.js";
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../generated/prisma/client.js";

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
    connectionString: DATABASE_URL
})
const prisma = new PrismaClient({
    adapter
})

export { prisma } 