import apiClient from '@/services/apiClient';
import {
  User,
  StudentProfile,
  TeacherProfile,
  BasicRegisterData,
  StudentProfileData,
  TeacherProfileData,
  LoginData,
  VerifyEmailData,
  UpdateProfileData,
  ChangePasswordData,
  UploadPhotoData,
  ApiResponse,
  BasicRegisterResponse,
  AuthResponse,
  TeachersListResponse,
} from '@/types/auth.types';

// Token management functions using localStorage
const setStoredToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
};

const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

const removeStoredToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
  }
};

/**
 * Step 1: Basic registration (email, password, role only)
 */
const basicRegister = async (data: BasicRegisterData): Promise<ApiResponse<BasicRegisterResponse>> => {
  try {
    const apiData = {
      ...data,
      role: data.role.charAt(0).toUpperCase() + data.role.slice(1),
    };

    const response = await apiClient.post<ApiResponse<BasicRegisterResponse>>(
      '/user-service/users/register',
      apiData
    );

    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
    alert(`Registration Error: ${errorMessage}`);
    throw error; // Re-throw the error so it can be caught by the calling code
  }
};

/**
 * Step 2: Email verification
 */
const verifyEmail = async (code: string, email: string): Promise<ApiResponse> => {
  try {
    const payload: VerifyEmailData = { code, email };

    const response = await apiClient.post<ApiResponse>(
      '/user-service/users/verify-email',
      payload
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Email verification failed',
      error: error.response?.data?.error || error.message || 'Unknown error',
    };
  }
};

/**
 * Step 3: Complete profile with personal information
 */
const completeProfile = async (
  profileData: StudentProfileData | TeacherProfileData,
  userId: string
): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      `/user-service/users/complete-profile/${userId}`,
      profileData
    );

    if (response.data.success && response.data.data?.token) {
      setStoredToken(response.data.data.token);
    }

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Profile completion failed',
      error: error.response?.data?.error || error.message || 'Unknown error',
    };
  }
};

/**
 * User login (requires completed profile)
 */
const login = async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/user-service/users/login',
      data,
      { withCredentials: true } // Important for HTTP-only refresh token cookies
    );

    if (response.data.success && response.data.data?.token) {
      setStoredToken(response.data.data.token);
    }

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Login failed',
      error: error.response?.data?.error || error.message || 'Unknown error',
    };
  }
};

/**
 * Get current user profile
 */
const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.get<ApiResponse<User>>('/user-service/users/me');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to get user profile',
      error: error.response?.data?.error || error.message || 'Unknown error',
    };
  }
};

/**
 * Update current user profile
 */
const updateProfile = async (data: UpdateProfileData): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>('/user-service/users/me', data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update profile',
      error: error.response?.data?.error || error.message || 'Unknown error',
    };
  }
};

/**
 * User logout
 */
const logout = async (): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>(
      '/user-service/users/logout',
      {},
      { withCredentials: true } // Important for HTTP-only refresh token cookies
    );

    removeStoredToken();
    return response.data;
  } catch (error: any) {
    // Always remove token even if logout fails
    removeStoredToken();
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Logout failed',
      error: error.response?.data?.error || error.message || 'Unknown error',
    };
  }
};

/**
 * Get list of all teachers (public)
 */
const getTeachers = async (page: number = 1, limit: number = 10): Promise<ApiResponse<TeachersListResponse>> => {
  try {
    const response = await apiClient.get<ApiResponse<TeachersListResponse>>(
      `/user-service/users/teachers?page=${page}&limit=${limit}`
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to get teachers list',
      error: error.response?.data?.error || error.message || 'Unknown error',
    };
  }
};

/**
 * Get specific teacher profile (public)
 */
const getTeacherProfile = async (teacherId: string): Promise<ApiResponse<TeacherProfile>> => {
  try {
    const response = await apiClient.get<ApiResponse<TeacherProfile>>(`/user-service/users/teachers/${teacherId}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to get teacher profile',
      error: error.response?.data?.error || error.message || 'Unknown error',
    };
  }
};

/**
 * Change password
 */
const changePassword = async (data: ChangePasswordData): Promise<ApiResponse> => {
  try {
    const response = await apiClient.put<ApiResponse>('/user-service/user/change-password', data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to change password',
      error: error.response?.data?.error || error.message || 'Unknown error',
    };
  }
};

/**
 * Upload profile photo
 */
const uploadPhoto = async (data: UploadPhotoData): Promise<ApiResponse<{ photoUrl: string }>> => {
  try {
    const formData = new FormData();
    formData.append('photo', data.photo);

    const response = await apiClient.post<ApiResponse<{ photoUrl: string }>>(
      '/user-service/user/upload-photo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to upload photo',
      error: error.response?.data?.error || error.message || 'Unknown error',
    };
  }
};

/**
 * Check if user is authenticated
 */
const isAuthenticated = (): boolean => {
  return !!getStoredToken();
};

/**
 * Get current token
 */
const getToken = (): string | null => {
  return getStoredToken();
};

/**
 * Clear authentication state
 */
const clearAuth = (): void => {
  removeStoredToken();
};

// Export a singleton-like object with the same API shape as before
export const userService = {
  basicRegister,
  verifyEmail,
  completeProfile,
  login,
  getCurrentUser,
  updateProfile,
  logout,
  getTeachers,
  getTeacherProfile,
  changePassword,
  uploadPhoto,
  isAuthenticated,
  getToken,
  clearAuth,
};

export default userService;
