import axios from "axios";

const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes("localhost")) {
            return process.env.NEXT_PUBLIC_API_URL;
        }
        return `${window.location.protocol}//${window.location.hostname}:8080/api/v1`;
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
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