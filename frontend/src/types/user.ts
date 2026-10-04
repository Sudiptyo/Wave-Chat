export interface User {
    id: string;
    avatar?: string | null;
    fullName: string;
    userName: string;
    mobileNo: string | null;
    role: "ADMIN" | "USER";
    about: string | null;
    email: string | null;
    emailVerified: boolean;
    authProvider: "LOCAL" | "GOOGLE";
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    lastLoginAt: string;
    lastSeen: string;
    credits: number;
    createdAt: string;
    updatedAt: string;
}