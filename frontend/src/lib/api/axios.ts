import axios from "axios"

export const Axios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL  ?? "http://localhost:5000",
    withCredentials: true
})