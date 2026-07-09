import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_ADMIN_API || "http://localhost:8080/api/v1",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const secret = process.env.NEXT_PUBLIC_ADMIN_SECRET;
    
    if (secret) {
        config.headers["X-Admin-Secret"] = secret;
    }
    console.log(config.headers);
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error(error);
        return Promise.reject(error);
    }
);

export default api;