import { AuthResponse } from "./auth";
import { Axios } from "./axios";
import { API_ENDPOINTS } from "./endpoints";
import { User } from "@/types/user";


const getCurrentUser = async (): Promise<User> => {

    const res = await Axios.get<AuthResponse>(API_ENDPOINTS.AUTH.GET_USER);

    return res.data.data.user;
}

export { getCurrentUser };