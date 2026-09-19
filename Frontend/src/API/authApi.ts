import type { LoginUserData, RegisterUserData } from "../Types/auth.types";
import type { User } from "../Types/user.types";
import { API_ENDPOINTS } from "./apiEndpoints";
import { toast } from "react-toastify";
import { Axios } from "../Config/Axios";


interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
    };
}

const registerUser = async (data: RegisterUserData): Promise<User> => {

    const res = await Axios.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);

    toast.success(res.data.message || "User registered successfully");
    return res.data.data.user;
}

const loginUser = async (data: LoginUserData,): Promise<User> => {

    const res = await Axios.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        data,
    );

    return res.data.data.user;
};

const logoutUser = async (): Promise<void> => {
    await Axios.post(API_ENDPOINTS.AUTH.LOGOUT);
}

export { registerUser, loginUser, logoutUser };