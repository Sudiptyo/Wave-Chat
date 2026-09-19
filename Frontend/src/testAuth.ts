import { registerUser } from "./API/authApi";
import { getCurrentUser } from "./API/userApi";

const testAuth = async () => {
    try {
        console.log("Registering user...");

        const registeredUser = await registerUser({
            fullName: "Test User",
            userName: "tesser123",
            mobileNo: "9876090710",
            email: "teest@example.com",
            password: "Test@12345",
        });

        console.log("REGISTER RESPONSE:", registeredUser);

        console.log("Fetching current user...");

        const currentUser = await getCurrentUser();

        console.log("GET USER RESPONSE:", currentUser);
    } catch (error) {
        console.error("AUTH TEST FAILED:", error);
    }
};

testAuth();