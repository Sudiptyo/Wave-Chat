interface CreateSessionData {
    userId: string;

    deviceId?: string;
    deviceName?: string;

    userAgent?: string;
    ipAddress?: string;
}

interface FindSessionData {
    sessionId: string;
    userId?: string;
}

interface FindActiveSessionData {
    sessionId: string;
    userId?: string;
}

interface RevokeSessionData {
    sessionId: string;
    userId?: string;
}

interface RevokeAllUserSessionData {
    userId: string
}

interface RotateRefreshTokenData {
    refreshToken: string
}

interface SessionTokens {
    session: any;
    AccessToken: string;
    RefreshToken: string;
}

export { CreateSessionData, FindSessionData, FindActiveSessionData, RevokeSessionData, RevokeAllUserSessionData, RotateRefreshTokenData, SessionTokens }