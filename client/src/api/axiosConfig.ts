// src/api/axiosConfig.ts
import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { toast } from "sonner";

// match your backend wrapper
interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (response: AxiosResponse<ApiResponse<any>>) => {
    const { success, message, data } = response.data;

    if (!success) {
      toast.error(message || "An error occurred");
      return Promise.reject(new Error(message));
    }

    return data;
  },

  (error: AxiosError) => {
    if (!error.response) {
      toast.error("Network error – check your connection");
    } else {
      const { status, data } = error.response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (data as any)?.message;

      switch (status) {
        case 400:
          toast.error(msg || "Bad request");
          break;
        case 401:
          toast.error("Unauthorized – please log in");
          break;
        case 403:
          toast.error("Forbidden");
          break;
        case 404:
          toast.error("Not found");
          break;
        case 409:
          toast.error(msg || "Conflict error");
          break;
        case 500:
          toast.error("Server error – try again later");
          break;
        default:
          toast.error(msg || "An error occurred");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
