
export const USER_ROLE = {
    ADMIN: "admin",
    USER: "user",
} as const;

export const USER_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    SUSPENDED: "suspended",
} as const;

export const AUTH_PROVIDER = {
    LOCAL: "LOCAL",
    GOOGLE: "GOOGLE",
} as const;

export type USER_ROLE = typeof USER_ROLE[keyof typeof USER_ROLE];
export type USER_STATUS = typeof USER_STATUS[keyof typeof USER_STATUS];
export type AUTH_PROVIDER = typeof AUTH_PROVIDER[keyof typeof AUTH_PROVIDER];

interface RegisterUserData {
    avatar?: string;
    fullName: string;
    userName: string;
    mobileNo: string;
    email?: string;
    password?: string;
    role?: USER_ROLE;
    status?: USER_STATUS;
}

interface RegisterContext {
    deviceId?: string;
    deviceName?: string;
    userAgent?: string;
    ipAddress?: string;
}

interface LoginUserData {
    // mobileNo?: string;
    // email: string;
    identifier: string,
    password?: string;
}

interface LoginContext {
    deviceId?: string;
    deviceName?: string;
    userAgent?: string;
    ipAddress?: string;
}

interface GetUserData {
    userId: string;
}

interface UpdateUserData {
    userId: string;

    fullName?: string;
    userName?: string;
    avatar?: string;
    about?: string;
    email?: string;
    mobileNo?: string;

    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

interface LogoutUserData {
    userId: string;
    sessionId: string;
}

interface LogoutUserFromAllDevicesData {
    userId: string;
}

interface ForgotPasswordData {
    email: string;
}

interface ChangePasswordData {
    userId: string;
    oldPassword?: string;
    newPassword: string;
    confirmPassword: string;
}

export { RegisterUserData, RegisterContext, GetUserData, LoginUserData, LoginContext, LogoutUserData, LogoutUserFromAllDevicesData, UpdateUserData, ForgotPasswordData, ChangePasswordData }