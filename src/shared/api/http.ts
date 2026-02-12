import axios, { AxiosError } from "axios";

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    const status = error.response?.status ?? 0;

    const apiError: ApiError = {
      status,
      message:
        error.response?.data?.message ||
        error.message ||
        "Unexpected error. Please try again.",
      details: error.response?.data,
    };

    return Promise.reject(apiError);
  },
);
