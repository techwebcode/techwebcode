import axios from "axios";

const getBaseUrl = () => {
    if (typeof window === "undefined") {
        // Server-side rendering (SSR) in Node.js / Docker container
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
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

/**
 * Request Interceptor
 */
api.interceptors.request.use(
    (config) => {
        config.baseURL = getBaseUrl();
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 */
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.error("Unauthorized");
                    break;
                case 403:
                    console.error("Forbidden");
                    break;
                case 404:
                    console.error("Resource not found");
                    break;
                case 500:
                    console.error("Server Error");
                    break;
            }
        }
        return Promise.reject(error);
    }
);

export default api;