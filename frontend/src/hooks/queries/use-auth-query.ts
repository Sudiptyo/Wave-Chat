import {
    loginUser,
    logoutUser,
    logoutUserFromAllDevices,
    registerUser,
} from "@/lib/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useRegisterMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: registerUser,

        onSuccess: (user) => {
            queryClient.setQueryData(["auth", "user"], user);
        },
    });
};

const useLoginMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginUser,

        onSuccess: (user) => {
            queryClient.setQueryData(["auth", "user"], user);
        },
    });
};

const useLogoutMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutUser,

        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: ["auth", "user"],
            });
        },
    });
};

const useLogoutFromAllDevicesMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutUserFromAllDevices,

        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: ["auth", "user"],
            });
        },
    });
};

export {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useLogoutFromAllDevicesMutation,
};