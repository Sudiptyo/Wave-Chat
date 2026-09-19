import { useMutation, useQueryClient } from "@tanstack/react-query"
import { loginUser, logoutUser, registerUser } from "../../API/authApi";


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
        }
    })
}

const useLogoutMutation = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["auth", "user"] });
        },
    });
};

export { useRegisterMutation, useLoginMutation, useLogoutMutation };