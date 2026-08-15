import axios from "axios";

const getBaseUrl = () => {
    return (
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_API ||
        process.env.NEXT_ADMIN_API ||
        "http://localhost:8090/api/v1"
    );
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

    let secret = process.env.NEXT_PUBLIC_ADMIN_SECRET;

    if (typeof window !== "undefined") {
        const localSecret =
            localStorage.getItem("admin_secret") ||
            localStorage.getItem("token");
        if (localSecret) {
            secret = localSecret;
        }
    }

    if (!secret) {
        secret = "xL6Lwfl5GgKVBMl1ehHiZ1";
    }

    config.headers["X-Admin-Secret"] = secret;
    config.headers["Authorization"] = `Bearer ${secret}`;

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