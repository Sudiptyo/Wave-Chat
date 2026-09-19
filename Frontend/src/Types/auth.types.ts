export interface RegisterUserData {
    fullName: string;
    userName: string;
    mobileNo: string;
    email?: string;
    password: string;
}

export interface LoginUserData {
    identifier: string;
    password: string;
}