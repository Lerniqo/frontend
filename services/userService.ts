import Cookies from 'js-cookie';

// User service for handling authentication and user-related API calls

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// Type definitions
interface User {
  id: string;
  email: string;
  role: 'Student' | 'Teacher' | 'Admin';
  fullName: string;
  profilePictureUrl?: string;
  isVerified: boolean;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StudentProfile extends User {
  role: 'Student';
  school?: string;
  birthday?: string;
  grade?: string;
  gender?: string;
  parentGuardianName?: string;
  parentGuardianRelationship?: string;
  parentContact?: string;
  address?: string;
  gradeLevel?: number;
  learningGoals?: string;
}

interface TeacherProfile extends User {
  role: 'Teacher';
  birthday?: string;
  address?: string;
  phoneNumber?: string;
  nationalIdOrPassport?: string;
  subjectsTaught?: string[];
  yearsOfExperience?: number;
  educationLevel?: string;
  bioOrTeachingPhilosophy?: string;
  qualifications?: string;
  experienceYears?: number;
  bio?: string;
}

// Step 1: Basic registration data (email, password, role only)
interface BasicRegisterData {
  email: string;
  password: string;
  role: 'Student' | 'Teacher';
}

// Step 2: Profile completion data
interface StudentProfileData {
  fullName: string;
  school?: string;
  birthday?: string;
  grade?: string;
  gender?: string;
  parentGuardianName?: string;
  parentGuardianRelationship?: string;
  parentContact?: string;
  address?: string;
  gradeLevel?: number;
  learningGoals?: string;
}

interface TeacherProfileData {
  fullName: string;
  birthday?: string;
  address?: string;
  phoneNumber?: string;
  nationalIdOrPassport?: string;
  subjectsTaught?: string[];
  yearsOfExperience?: number;
  educationLevel?: string;
  bioOrTeachingPhilosophy?: string;
  qualifications?: string;
  experienceYears?: number;
  bio?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface VerifyEmailData {
  code: string;
  email: string;
}

interface UpdateProfileData {
  fullName?: string;
  email?: string;
  gradeLevel?: number;
  learningGoals?: string;
  qualifications?: string;
  experienceYears?: number;
  bio?: string;
  profilePictureUrl?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface UploadPhotoData {
  photo: File;
}

// API Response interfaces
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface BasicRegisterResponse {
  user: {
    id: string;
    email: string;
  role: 'Student' | 'Teacher';
    isVerified: boolean;
    profileCompleted: boolean;
  };
  message: string;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

interface TeachersListResponse {
  teachers: TeacherProfile[];
  total: number;
  page: number;
  limit: number;
}

// Module-level state and functions replacing the UserService class
const baseURL = API_BASE_URL;
let tempUserId: string | null = null;

/**
 * Register a new user (mocked behavior preserved)
 */
const register = async (
  role: string,
  email: string,
  password: string
): Promise<ApiResponse<BasicRegisterResponse>> => {
  try {
    const registerData: BasicRegisterData = {
      // Normalize incoming role to capitalized form (idempotent)
      role: role.charAt(0).toUpperCase() + role.slice(1) as 'Student' | 'Teacher',
      email,
      password,
    };

    // TODO: Uncomment when API endpoints are ready
    // const response = await fetch(`${baseURL}/auth/register`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(registerData),
    // });

    // Mock functionality: Wait for 2 seconds and return success
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockUser = {
      id: `user_${Date.now()}`,
      email: registerData.email,
      role: registerData.role,
      isVerified: false,
      profileCompleted: false,
    };

    return {
      success: true,
      message: 'Registration successful',
      data: {
        user: mockUser,
        message: 'Registration successful',
      },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
};

const setStoredToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    Cookies.set('accessToken', token, {
      expires: 1,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
};

const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return Cookies.get('accessToken') || null;
  }
  return null;
};

const removeStoredToken = (): void => {
  if (typeof window !== 'undefined') {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  }
};

const setTempUserId = (userId: string): void => {
  tempUserId = userId;
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('tempUserId', userId);
  }
};

const getTempUserId = (): string | null => {
  if (tempUserId) return tempUserId;
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('tempUserId');
  }
  return null;
};

const clearTempUserId = (): void => {
  tempUserId = null;
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('tempUserId');
  }
};

// Helper method for making authenticated requests
const makeAuthenticatedRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getStoredToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${baseURL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token expired or invalid
    removeStoredToken();
    throw new Error('Authentication expired. Please login again.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

// Helper method for making public requests
const makePublicRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${baseURL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
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

    const response = await makePublicRequest<ApiResponse<BasicRegisterResponse>>(
      '/user-service/users/register',
      {
        method: 'POST',
        body: JSON.stringify(apiData),
      }
    );

    if (response.success && response.data?.user?.id) {
      setTempUserId(response.data.user.id);
    }

    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Step 2: Email verification
 */
const verifyEmail = async (code: string, email: string): Promise<ApiResponse> => {
  try {
    const payload: VerifyEmailData = { code, email };

    const response = await makePublicRequest<ApiResponse>('/user-service/users/verify-email', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Email verification failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Step 3: Complete profile with personal information
 */
const completeProfile = async (
  profileData: StudentProfileData | TeacherProfileData
): Promise<ApiResponse<AuthResponse>> => {
  try {
    const userId = getTempUserId();
    if (!userId) {
      throw new Error('No user ID found. Please restart the registration process.');
    }

    const response = await makePublicRequest<ApiResponse<AuthResponse>>(
      `/user-service/users/complete-profile/${userId}`,
      {
        method: 'POST',
        body: JSON.stringify(profileData),
      }
    );

    if (response.success && response.data?.token) {
      setStoredToken(response.data.token);
      clearTempUserId();
    }

    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Profile completion failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * User login (requires completed profile)
 */
const login = async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await makePublicRequest<ApiResponse<AuthResponse>>('/user-service/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data?.token) {
      setStoredToken(response.data.token);
    }

    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Login failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Get current user profile
 */
const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await makeAuthenticatedRequest<ApiResponse<User>>('/user-service/users/me');
    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get user profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Update current user profile
 */
const updateProfile = async (data: UpdateProfileData): Promise<ApiResponse<User>> => {
  try {
    const response = await makeAuthenticatedRequest<ApiResponse<User>>('/user-service/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * User logout
 */
const logout = async (): Promise<ApiResponse> => {
  try {
    const response = await makeAuthenticatedRequest<ApiResponse>('/user-service/users/logout', {
      method: 'POST',
    });

    removeStoredToken();

    return response;
  } catch (error) {
    removeStoredToken();

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Logout failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Get list of all teachers (public)
 */
const getTeachers = async (page: number = 1, limit: number = 10): Promise<ApiResponse<TeachersListResponse>> => {
  try {
    const response = await makePublicRequest<ApiResponse<TeachersListResponse>>(
      `/user-service/users/teachers?page=${page}&limit=${limit}`
    );

    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get teachers list',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Get specific teacher profile (public)
 */
const getTeacherProfile = async (teacherId: string): Promise<ApiResponse<TeacherProfile>> => {
  try {
    const response = await makePublicRequest<ApiResponse<TeacherProfile>>(`/user-service/users/teachers/${teacherId}`);
    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get teacher profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Change password
 */
const changePassword = async (data: ChangePasswordData): Promise<ApiResponse> => {
  try {
    const response = await makeAuthenticatedRequest<ApiResponse>('/user-service/user/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to change password',
      error: error instanceof Error ? error.message : 'Unknown error',
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

    const response = await makeAuthenticatedRequest<ApiResponse<{ photoUrl: string }>>('/user-service/user/upload-photo', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      },
    });

    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload photo',
      error: error instanceof Error ? error.message : 'Unknown error',
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
 * Check if user has a temporary ID (for profile completion)
 */
const hasTempUserId = (): boolean => {
  return !!getTempUserId();
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (): Promise<ApiResponse<{ token: string }>> => {
  try {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await makePublicRequest<ApiResponse<{ token: string }>>('/user-service/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    if (response.success && response.data?.token) {
      setStoredToken(response.data.token);
    }

    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Token refresh failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Clear authentication state
 */
const clearAuth = (): void => {
  removeStoredToken();
  clearTempUserId();
};

// Export a singleton-like object with the same API shape as before
export const userService = {
  register,
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
  hasTempUserId,
  refreshAccessToken,
  clearAuth,
  // expose helpers if needed
  _internal: {
    setStoredToken,
    getStoredToken,
    removeStoredToken,
    setTempUserId,
    getTempUserId,
    clearTempUserId,
  },
};

export default userService;

// Export types for use in components
export type {
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
};
