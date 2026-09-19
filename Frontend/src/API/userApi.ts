import { toast } from "react-toastify";
import { Axios } from "../Config/Axios";
import type { User } from "../Types/user.types";
import { API_ENDPOINTS } from "./apiEndpoints";


const getCurrentUser = async (): Promise<User> => {

    const res = await Axios.get<{
        success: boolean,
        message: string,
        data: {
            user: User
        }
    }>(API_ENDPOINTS.AUTH.GET_USER);

    toast.success(res.data.message || "User fetched successfully");
    return res.data.data.user;
}

export { getCurrentUser }