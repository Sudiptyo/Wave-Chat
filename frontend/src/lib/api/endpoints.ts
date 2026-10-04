const API_BASE_URL = {
    AUTH: "/api/v1/auth",
    GOOGLE: "/api/v1/auth",
}

export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: `${API_BASE_URL.AUTH}/register`,
        LOGIN: `${API_BASE_URL.AUTH}/login`,
        GET_USER: `${API_BASE_URL.AUTH}/user`,
        LOGOUT: `${API_BASE_URL.AUTH}/logout`,
        LOGOUT_ALL: `${API_BASE_URL.AUTH}/logout-all`,

    },
    GOOGLE: {
        LOGIN: `${API_BASE_URL.GOOGLE}/google`,
        CALLBACK_URL: `${API_BASE_URL.GOOGLE}/google/callback`
    }
}