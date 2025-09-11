import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AuthResponse, ErrorResponse } from '@/types/api.types';

// Create an Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com') + '/api', // Add /api prefix to all requests
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }
    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data
      });
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
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
    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    return response; 
  },
  async (error) => {
    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message || error.message,
        data: error.response?.data
      });
    }
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh the token
    // Don't try to refresh token for login/signup/auth endpoints
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url?.includes('/login') &&
        !originalRequest.url?.includes('/signup') &&
        !originalRequest.url?.includes('/register') &&
        !originalRequest.url?.includes('/verify-email') &&
        !originalRequest.url?.includes('/refresh-token')) {
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
        const response = await axios.post(
          `${(process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com')}/api/user-service/users/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        // Handle the backend response format: { success: true, data: { accessToken, user }, message }
        if (response.data?.success && response.data?.data?.accessToken) {
          const { accessToken } = response.data.data;
          
          // Update access token in localStorage
          localStorage.setItem('accessToken', accessToken);

          // Process failed requests
          failedRequestsQueue.forEach(({ resolve }) => resolve());
          failedRequestsQueue = [];

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } else {
          throw new Error('Invalid refresh token response');
        }
      } catch (refreshError) {
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        
        // Process failed requests with rejection
        failedRequestsQueue.forEach(({ reject }) => reject(refreshError));
        failedRequestsQueue = [];
        
        // Only redirect if we're not already on the login page
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject<ErrorResponse>(error.response?.data || { error: error.message });
  }
);

export default apiClient;