import Cookies from 'js-cookie';

// User service for handling authentication and user-related API calls

// Base API configuration
const API_BASE_URL = 'https://xzx0dtp51i.execute-api.us-east-1.amazonaws.com/dev/api';

// Type definitions
interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  fullName: string;
  profilePictureUrl?: string;
  isVerified: boolean;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StudentProfile extends User {
  role: 'student';
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
  role: 'teacher';
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
  role: 'student' | 'teacher';
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
    role: 'student' | 'teacher';
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

class UserService {
  private baseURL: string;
  private tempUserId: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Token management
  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return Cookies.get('accessToken') || null;
    }
    return null;
  }

  private setStoredToken(token: string): void {
    if (typeof window !== 'undefined') {
      Cookies.set('accessToken', token, { 
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
  }

  private removeStoredToken(): void {
    if (typeof window !== 'undefined') {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  }

  // Store temporary user ID for profile completion
  private setTempUserId(userId: string): void {
    this.tempUserId = userId;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('tempUserId', userId);
    }
  }

  private getTempUserId(): string | null {
    if (this.tempUserId) return this.tempUserId;
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('tempUserId');
    }
    return null;
  }

  private clearTempUserId(): void {
    this.tempUserId = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('tempUserId');
    }
  }

  // Helper method for making authenticated requests
  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token expired or invalid
      this.removeStoredToken();
      throw new Error('Authentication expired. Please login again.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  // Helper method for making public requests
  private async makePublicRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
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
  }

  /**
   * Step 1: Basic registration (email, password, role only)
   */
  async basicRegister(data: BasicRegisterData): Promise<ApiResponse<BasicRegisterResponse>> {
    try {
      const response = await this.makePublicRequest<ApiResponse<BasicRegisterResponse>>(
        '/user-service/users/register',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

      if (response.success && response.data?.user?.id) {
        // Store temporary user ID for profile completion
        this.setTempUserId(response.data.user.id);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Step 2: Email verification
   */
  async verifyEmail(code: string): Promise<ApiResponse> {
    try {
      const response = await this.makePublicRequest<ApiResponse>(
        '/user-service/users/verify-email',
        {
          method: 'POST',
          body: JSON.stringify({ code }),
        }
      );

      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Email verification failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Step 3: Complete profile with personal information
   */
  async completeProfile(profileData: StudentProfileData | TeacherProfileData): Promise<ApiResponse<AuthResponse>> {
    try {
      const userId = this.getTempUserId();
      if (!userId) {
        throw new Error('No user ID found. Please restart the registration process.');
      }

      const response = await this.makePublicRequest<ApiResponse<AuthResponse>>(
        `/user-service/users/complete-profile/${userId}`,
        {
          method: 'POST',
          body: JSON.stringify(profileData),
        }
      );

      if (response.success && response.data?.token) {
        // Profile completed successfully, set token and clear temp ID
        this.setStoredToken(response.data.token);
        this.clearTempUserId();
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Profile completion failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * User login (requires completed profile)
   */
  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.makePublicRequest<ApiResponse<AuthResponse>>(
        '/user-service/users/login',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

      if (response.success && response.data?.token) {
        this.setStoredToken(response.data.token);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await this.makeAuthenticatedRequest<ApiResponse<User>>(
        '/user-service/users/me'
      );

      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get user profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Update current user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    try {
      const response = await this.makeAuthenticatedRequest<ApiResponse<User>>(
        '/user-service/users/me',
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );

      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * User logout
   */
  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.makeAuthenticatedRequest<ApiResponse>(
        '/user-service/users/logout',
        {
          method: 'POST',
        }
      );

      // Remove token on successful logout
      this.removeStoredToken();

      return response;
    } catch (error) {
      // Even if the API call fails, remove the local token
      this.removeStoredToken();
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get list of all teachers (public)
   */
  async getTeachers(page: number = 1, limit: number = 10): Promise<ApiResponse<TeachersListResponse>> {
    try {
      const response = await this.makePublicRequest<ApiResponse<TeachersListResponse>>(
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
  }

  /**
   * Get specific teacher profile (public)
   */
  async getTeacherProfile(teacherId: string): Promise<ApiResponse<TeacherProfile>> {
    try {
      const response = await this.makePublicRequest<ApiResponse<TeacherProfile>>(
        `/user-service/users/teachers/${teacherId}`
      );

      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get teacher profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    try {
      const response = await this.makeAuthenticatedRequest<ApiResponse>(
        '/user-service/user/change-password',
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );

      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to change password',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Upload profile photo
   */
  async uploadPhoto(data: UploadPhotoData): Promise<ApiResponse<{ photoUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append('photo', data.photo);

      const response = await this.makeAuthenticatedRequest<ApiResponse<{ photoUrl: string }>>(
        '/user-service/user/upload-photo',
        {
          method: 'POST',
          body: formData,
          headers: {
            // Don't set Content-Type for FormData, let browser set it
          },
        }
      );

      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to upload photo',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.getStoredToken();
  }

  /**
   * Check if user has a temporary ID (for profile completion)
   */
  hasTempUserId(): boolean {
    return !!this.getTempUserId();
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await this.makePublicRequest<ApiResponse<{ token: string }>>(
        '/user-service/auth/refresh',
        {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (response.success && response.data?.token) {
        this.setStoredToken(response.data.token);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Token refresh failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Clear authentication state
   */
  clearAuth(): void {
    this.removeStoredToken();
    this.clearTempUserId();
  }
}

// Export a singleton instance
export const userService = new UserService();

// Export the class for testing or multiple instances if needed
export default UserService;

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
