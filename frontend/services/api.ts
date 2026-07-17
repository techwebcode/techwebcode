import axios from "axios";

const api = axios.create({

    baseURL:
        process.env.NEXT_PUBLIC_API_URL,

    timeout: 15000,

    headers: {

        "Content-Type":
            "application/json",

        Accept:
            "application/json",

    },

});

/**
 * Request Interceptor
 */

api.interceptors.request.use(

    (config) => {

        // Future:
        // JWT Token
        // Language
        // Tenant
        // Device ID

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

            switch (
                error.response.status
            ) {

                case 401:

                    console.error(
                        "Unauthorized"
                    );

                    break;

                case 403:

                    console.error(
                        "Forbidden"
                    );

                    break;

                case 404:

                    console.error(
                        "Resource not found"
                    );

                    break;

                case 500:

                    console.error(
                        "Server Error"
                    );

                    break;

            }

        }

        return Promise.reject(error);

    }

);

export default api;