import { JwtPayload } from "jsonwebtoken";

export interface AuthenticateUser {
    userId: string;
    sessionId: string;
}

export interface AccessPayload extends JwtPayload {
    type: "access",
    sub: string,
    sid: string
}