import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AuthResponse, ErrorResponse } from '@/types/api.types';

// Create an Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com', // Set this in your .env.local file
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
let isRefreshing = false;
let failedRequestsQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

apiClient.interceptors.response.use(
  (response: AxiosResponse<AuthResponse>) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the token to be refreshed
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post<AuthResponse>(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com'}/user-service/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { token: newAccessToken } = response.data;

        // Update access token in localStorage
        localStorage.setItem('accessToken', newAccessToken);

        // Process failed requests
        failedRequestsQueue.forEach(({ resolve }) => resolve());
        failedRequestsQueue = [];

        // Retry original request with new token
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        window.location.href = '/Login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject<ErrorResponse>(error.response?.data || { error: error.message });
  }
);

export default apiClient;