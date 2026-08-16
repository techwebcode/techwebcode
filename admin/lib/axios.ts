import axios from "axios";

const getBaseUrl = () => {
    if (typeof window === "undefined") {
        // Server-side rendering (SSR) inside Node.js / Docker container
        return (
            process.env.INTERNAL_API_URL ||
            process.env.NEXT_PUBLIC_API_URL ||
            "http://backend:8080/api/v1"
        );
    }
    // Client-side browser rendering
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082/api/v1";
};

const api = axios.create({
    baseURL: getBaseUrl(),
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    config.baseURL = getBaseUrl();

    let secret = "";

    if (typeof window !== "undefined") {
        secret =
            localStorage.getItem("admin_secret") ||
            localStorage.getItem("token") ||
            "";
    }

    if (secret) {
        config.headers["X-Admin-Secret"] = secret;
        config.headers["Authorization"] = `Bearer ${secret}`;
    }

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