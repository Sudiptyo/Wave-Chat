import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";
import { CORS_ORIGIN } from "../Config/Dotenv.js";

let io: Server;

const initializeSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: CORS_ORIGIN,
            credentials: true
        }
    })

    return io;
}

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io is not initialized");
    }

    return io;
}

export { initializeSocket, getIO };