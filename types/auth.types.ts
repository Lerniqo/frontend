// Core User interface with proper role union type
export interface User {
  id: string;
  email: string;
  role: 'Student' | 'Teacher' | 'Admin';
  fullName: string;
  profilePictureUrl?: string;
  isVerified: boolean;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  // Optional properties that may be present based on user type
  gradeLevel?: number;
  learningGoals?: string;
  qualifications?: string;
  school?: string;
  birthday?: string;
  gender?: string;
  parentGuardianName?: string;
  relationship?: string; // Updated field name
  parentContact?: string;
  addressCity?: string; // Updated field name for students
  address?: string; // For teachers
  phoneNumber?: string;
  nationalIdPassport?: string; // Updated field name
  yearsOfExperience?: number;
  highestEducationLevel?: string; // Updated field name
  shortBio?: string; // Updated field name
}

// Extended user profiles for specific roles
export interface StudentProfile extends User {
  role: 'Student';
  school?: string;
  birthday?: string;
  gradeLevel?: number;
  gender?: string;
  parentGuardianName?: string;
  relationship?: string; // Updated field name
  parentContact?: string;
  addressCity?: string; // Updated field name
  learningGoals?: string;
}

export interface TeacherProfile extends User {
  role: 'Teacher';
  birthday?: string;
  address?: string;
  phoneNumber?: string;
  nationalIdPassport?: string; // Updated field name
  yearsOfExperience?: number;
  highestEducationLevel?: string; // Updated field name
  qualifications?: string;
  shortBio?: string; // Updated field name
}

// Registration and profile data interfaces
export interface BasicRegisterData {
  email: string;
  password: string;
  role: 'Student' | 'Teacher';
}

export interface StudentProfileData {
  fullName: string;
  school?: string;
  birthday?: string;
  gradeLevel?: number; // Changed from 'grade' string to number
  gender?: string;
  parentGuardianName?: string;
  relationship?: string; // Changed from 'parentGuardianRelationship'
  parentContact?: string;
  addressCity?: string; // Changed from 'address'
  learningGoals?: string;
}

export interface TeacherProfileData {
  fullName: string;
  birthday?: string;
  address?: string;
  phoneNumber?: string;
  nationalIdPassport?: string; // Changed from 'nationalIdOrPassport'
  yearsOfExperience?: number;
  highestEducationLevel?: string; // Changed from 'educationLevel'
  qualifications?: string;
  shortBio?: string; // Changed from 'bioOrTeachingPhilosophy'
}

// Authentication and API related interfaces
export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  code: string;
  email: string;
}

// Verify email API response (direct format from backend)
export interface VerifyEmailResponse {
  message: string;
  userId: string;
  role: string;
}

// Complete profile API response (direct format from backend)
export interface CompleteProfileResponse {
  message: string;
  userId: string;
  email: string;
  role: string;
  fullName: string;
}

// Processed verification data for frontend components
export interface VerifyEmailSuccessData {
  userId: string;
  role: string;
  message: string;
}

export interface UpdateProfileData {
  fullName?: string;
  email?: string;
  gradeLevel?: number;
  learningGoals?: string;
  qualifications?: string;
  experienceYears?: number;
  bio?: string;
  profilePictureUrl?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UploadPhotoData {
  photo: File;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface BasicRegisterResponse {
  userId: string;
  email: string;
  role: string;
  message: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface TeachersListResponse {
  teachers: TeacherProfile[];
  total: number;
  page: number;
  limit: number;
}

// Authentication context and state interfaces
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: any) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}