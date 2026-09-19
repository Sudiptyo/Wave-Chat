import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "../../API/userApi"


const useUserQuery = () => {
    return useQuery({
        queryKey: ["auth", "user"],
        queryFn: getCurrentUser,
        staleTime: 0, // Always consider the user data stale.
        refetchOnMount: true, // Fetch again whenever the component using this        // query mounts
        refetchOnWindowFocus: true,  // Keep user data fresh when the user comes back to the browser tab.
        retry: false // Don't keep retrying a 401.
    })
}
export { useUserQuery }