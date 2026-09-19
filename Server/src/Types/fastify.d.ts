import { AuthenticateUser } from "../Interfaces/Auth/user.middleware.interface.ts";

declare module "fastify" {
    interface FastifyRequest {
        user: AuthenticateUser;
    }
}