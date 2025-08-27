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
  experienceYears?: number;
  bio?: string;
  school?: string;
  birthday?: string;
  grade?: string;
  gender?: string;
  parentGuardianName?: string;
  parentGuardianRelationship?: string;
  parentContact?: string;
  address?: string;
  phoneNumber?: string;
  nationalIdOrPassport?: string;
  subjectsTaught?: string[];
  yearsOfExperience?: number;
  educationLevel?: string;
  bioOrTeachingPhilosophy?: string;
}

// Extended user profiles for specific roles
export interface StudentProfile extends User {
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

export interface TeacherProfile extends User {
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
  grade?: string;
  gender?: string;
  parentGuardianName?: string;
  parentGuardianRelationship?: string;
  parentContact?: string;
  address?: string;
  gradeLevel?: number;
  learningGoals?: string;
}

export interface TeacherProfileData {
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

// Authentication and API related interfaces
export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  code: string;
  email: string;
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