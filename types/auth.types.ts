// Core User interface with proper role union type
export interface User {
  userId: string;
  email: string;
  role: 'Student' | 'Teacher' | 'Admin';
  fullName: string;
  profileImage?: string;
  isVerified: boolean;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
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
  birthday?: string; // DateTime from backend
  address?: string; // Text from backend
  phoneNumber?: string; // phone_number from backend
  nationalIdPassport?: string; // national_id_passport from backend
  yearsOfExperience?: number; // years_of_experience from backend
  highestEducationLevel?: string; // highest_education_level from backend
  qualifications?: string; // Optional Text from backend
  shortBio?: string; // short_bio from backend
}

// Enhanced teacher profile interface for detailed display
export interface DetailedTeacherProfile extends TeacherProfile {
  // Professional Information
  experienceSummary?: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  subjectsTaught: string[];
  bioOrTeachingPhilosophy?: string;
  
  // Verification & Status
  isOnline?: boolean;
  availability: {
    status: 'available' | 'busy' | 'offline';
    nextAvailable?: string;
  };
  
  // Performance Metrics
  rating: number;
  totalStudents?: number;
  totalLessons?: number;
  responseTime?: string; // e.g., "Usually responds in 2 hours"
  
  // Professional Details
  hourlyRate?: number;
  currency?: string;
  languages?: string[];
  timezone?: string;
  
  // Metadata
  joinDate?: string;
  lastActive?: string;
  
  // Additional Features
  badges?: TeacherBadge[];
  specializations?: string[];
  teachingStyle?: string[];
}

export interface TeacherBadge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

// Filter and search interfaces
export interface FilterOptions {
  experienceLevel: ('beginner' | 'intermediate' | 'advanced' | 'expert')[];
  subjects: string[];
  yearsOfExperience: { min: number; max: number };
  rating: number; // Keep for backward compatibility but not actively used
  availability: boolean;
  verified: boolean;
  hourlyRate?: { min: number; max: number };
  languages?: string[]; // Keep for backward compatibility but not actively used
}

export interface SortOptions {
  field: 'name' | 'experience' | 'joinDate' | 'hourlyRate'; // Removed 'rating'
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
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
  birthday?: string; // DateTime field
  address?: string; // Text field
  phoneNumber?: string; // phone_number field
  nationalIdPassport?: string; // national_id_passport field
  yearsOfExperience?: number; // years_of_experience field
  highestEducationLevel?: string; // highest_education_level field
  qualifications?: string; // Optional Text field
  shortBio?: string; // short_bio field
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
  accessToken: string;
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