import { LoginUserData, RegisterUserData } from "@/types/auth";
import { User } from "@/types/user";
import { Axios } from "./axios";
import { API_ENDPOINTS } from "./endpoints";

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User
    }
}

const registerUser = async (data: RegisterUserData): Promise<User> => {

    const res = await Axios.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);

    return res.data.data.user;

}

const loginUser = async (data: LoginUserData): Promise<User> => {

    const res = await Axios.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);

    return res.data.data.user;

}

const logoutUser = async (): Promise<void> => {
    await Axios.post(API_ENDPOINTS.AUTH.LOGOUT);
}

const logoutUserFromAllDevices = async (): Promise<void> => {
    await Axios.post(API_ENDPOINTS.AUTH.LOGOUT_ALL);
}


export { registerUser, loginUser, logoutUser, logoutUserFromAllDevices };