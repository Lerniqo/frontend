// User service for handling authentication and user-related API calls

interface RegisterData {
  role: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

interface VerifyEmailData {
  email: string;
  code: string;
}

interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

interface ResendCodeData {
  email: string;
}

interface ResendCodeResponse {
  success: boolean;
  message: string;
}

interface StudentProfileData {
  fullName: string;
  school: string;
  birthday: string;
  grade: string;
  gender?: string;
  parentGuardianName: string;
  parentGuardianRelationship: string;
  parentContact: string;
  address?: string;
  profilePicture?: File;
}

interface TeacherProfileData {
  fullName: string;
  birthday: string;
  address: string;
  phoneNumber: string;
  nationalIdOrPassport: string;
  idProofFront?: File;
  idProofBack?: File;
  subjectsTaught: string[];
  yearsOfExperience: number;
  educationLevel: string;
  bioOrTeachingPhilosophy: string;
  profilePicture?: File;
  certificates: File[];
}

interface UpdateUserDataResponse {
  success: boolean;
  message: string;
  user?: any;
}

interface GetProfileImageResponse {
  success: boolean;
  message: string;
  imageUrl?: string;
}

interface UserProfile {
  id: string;
  email: string;
  role: string;
  status: string;
  fullName: string;
  profilePictureUrl: string;
  gradeLevel: number | null;
  learningGoals: string | null;
  qualifications: string | null;
  experienceYears: number | null;
  bio: string | null;
  isVerified: boolean | null;
}

interface GetMyProfileResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}

interface UpdateMyProfileData {
  fullName?: string;
  email?: string;
  gradeLevel?: number | null;
  learningGoals?: string | null;
  qualifications?: string | null;
  experienceYears?: number | null;
  bio?: string | null;
  profilePictureUrl?: string;
}

interface UpdateMyProfileResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}

interface TeacherProfile {
  userId: string;
  fullName: string;
  qualifications: string;
  experienceSummary: string;
  level: number; // 0, 1, 2, 3
}

interface DetailedTeacherProfile {
  userId: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  qualifications: string;
  experienceSummary: string;
  yearsOfExperience: number;
  level: number; // 0, 1, 2, 3
  educationLevel: string;
  bioOrTeachingPhilosophy: string;
  subjectsTaught: string[];
  profilePictureUrl?: string;
  isVerified: boolean;
}

interface GetAllTeachersResponse {
  success: boolean;
  message: string;
  teachers?: TeacherProfile[];
}

interface GetTeacherResponse {
  success: boolean;
  message: string;
  teacher?: DetailedTeacherProfile;
}

class UserService {
  private baseURL: string;

  constructor() {
    // You can set your API base URL here
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  }

  /**
   * Register a new user
   * @param role - User role (e.g., 'student', 'teacher', 'admin')
   * @param email - User email address
   * @param password - User password
   * @returns Promise with registration response
   */
  async register(
    role: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> {
    try {
      const registerData: RegisterData = {
        role,
        email,
        password,
      };

      // TODO: Uncomment when API endpoints are ready
      // const response = await fetch(`${this.baseURL}/auth/register`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(registerData),
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || 'Registration failed');
      // }

      // Mock functionality: Wait for 2 seconds and return success
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful response
      const mockUser = {
        id: `user_${Date.now()}`,
        email: registerData.email,
        role: registerData.role,
      };

      return {
        success: true,
        message: "Registration successful",
        user: mockUser,
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }

  /**
   * Verify email with verification code
   * @param email - User email address
   * @param code - 6-digit verification code
   * @returns Promise with verification response
   */
  async verifyEmail(email: string, code: string): Promise<VerifyEmailResponse> {
    try {
      const verifyData: VerifyEmailData = {
        email,
        code,
      };

      // TODO: Uncomment when API endpoints are ready
      // const response = await fetch("/api/verify-email", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(verifyData),
      // });

      // const data = await response.json();

      // if (response.ok) {
      //   return {
      //     success: true,
      //     message: data.message || "Email verified successfully",
      //   };
      // } else {
      //   return {
      //     success: false,
      //     message: data.message || "Invalid verification code",
      //   };
      // }

      // Mock functionality: Wait for 2 seconds and return success
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return {
        success: true,
        message: "Email verified successfully",
      };
    } catch (error) {
      console.error("Email verification error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  /**
   * Resend verification code to email
   * @param email - User email address
   * @returns Promise with resend response
   */
  async resendVerificationCode(email: string): Promise<ResendCodeResponse> {
    try {
      const resendData: ResendCodeData = {
        email,
      };

      const response = await fetch("/api/resend-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resendData),
      });

      if (response.ok) {
        return {
          success: true,
          message: "Verification code sent successfully",
        };
      } else {
        const data = await response.json();
        return {
          success: false,
          message: data.message || "Failed to resend code",
        };
      }
    } catch (error) {
      console.error("Resend code error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  /**
   * Update user profile data
   * @param data - Student profile data
   * @returns Promise with update response
   */
  async updateStudentProfileData(
    data: StudentProfileData
  ): Promise<UpdateUserDataResponse> {
    try {
      // Create FormData to handle file upload if profilePicture is provided
      const formData = new FormData();

      // Add all fields to FormData
      formData.append("fullName", data.fullName);
      formData.append("school", data.school);
      formData.append("birthday", data.birthday);
      formData.append("grade", data.grade);
      formData.append("parentGuardianName", data.parentGuardianName);
      formData.append(
        "parentGuardianRelationship",
        data.parentGuardianRelationship
      );
      formData.append("parentContact", data.parentContact);

      // Add optional fields if they exist
      if (data.gender) {
        formData.append("gender", data.gender);
      }
      if (data.address) {
        formData.append("address", data.address);
      }
      if (data.profilePicture) {
        formData.append("profilePicture", data.profilePicture);
      }

      // TODO: Uncomment when API endpoints are ready
      // const response = await fetch(`${this.baseURL}/user/profile`, {
      //   method: 'PUT',
      //   body: formData,
      //   // Note: Don't set Content-Type header when using FormData
      //   // The browser will set it automatically with the correct boundary
      // });

      // const responseData = await response.json();

      // if (!response.ok) {
      //   throw new Error(responseData.message || 'Failed to update user data');
      // }

      // return {
      //   success: true,
      //   message: responseData.message || 'Profile updated successfully',
      //   user: responseData.user,
      // };

      // Mock functionality: Wait for 2 seconds and return success
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful response
      return {
        success: true,
        message: "Profile updated successfully",
        user: {
          id: `user_${Date.now()}`,
          ...data,
          profilePicture: data.profilePicture ? "uploaded_file_url" : undefined,
        },
      };
    } catch (error) {
      console.error("Update user data error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }

  /**
   * Update teacher profile data
   * @param data - Teacher profile data
   * @returns Promise with update response
   */
  async updateTeacherProfileData(
    data: TeacherProfileData
  ): Promise<UpdateUserDataResponse> {
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add all text fields to FormData
      formData.append("fullName", data.fullName);
      formData.append("birthday", data.birthday);
      formData.append("address", data.address);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("nationalIdOrPassport", data.nationalIdOrPassport);
      formData.append("yearsOfExperience", data.yearsOfExperience.toString());
      formData.append("educationLevel", data.educationLevel);
      formData.append("bioOrTeachingPhilosophy", data.bioOrTeachingPhilosophy);

      // Add subjects taught as JSON string
      formData.append("subjectsTaught", JSON.stringify(data.subjectsTaught));

      // Add optional file uploads
      if (data.profilePicture) {
        formData.append("profilePicture", data.profilePicture);
      }
      if (data.idProofFront) {
        formData.append("idProofFront", data.idProofFront);
      }
      if (data.idProofBack) {
        formData.append("idProofBack", data.idProofBack);
      }

      // Add certificates
      data.certificates.forEach((certificate, index) => {
        formData.append(`certificate_${index}`, certificate);
      });

      // TODO: Uncomment when API endpoints are ready
      // const response = await fetch(`${this.baseURL}/teacher/profile`, {
      //   method: 'PUT',
      //   body: formData,
      //   // Note: Don't set Content-Type header when using FormData
      //   // The browser will set it automatically with the correct boundary
      // });

      // const responseData = await response.json();

      // if (!response.ok) {
      //   throw new Error(responseData.message || 'Failed to update teacher data');
      // }

      // return {
      //   success: true,
      //   message: responseData.message || 'Teacher profile updated successfully',
      //   user: responseData.user,
      // };

      // Mock functionality: Wait for 2 seconds and return success
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful response
      return {
        success: true,
        message: "Teacher profile updated successfully",
        user: {
          id: `teacher_${Date.now()}`,
          ...data,
          subjectsTaught: data.subjectsTaught,
          profilePicture: data.profilePicture
            ? "uploaded_profile_url"
            : undefined,
          idProofFront: data.idProofFront ? "uploaded_id_front_url" : undefined,
          idProofBack: data.idProofBack ? "uploaded_id_back_url" : undefined,
          certificates: data.certificates.map(
            (_, index) => `uploaded_cert_${index}_url`
          ),
        },
      };
    } catch (error) {
      console.error("Update teacher data error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }

  /**
   * Update the profile of the currently authenticated user
   * @param data - Profile data to update
   * @returns Promise with update response
   */
  async updateMyProfile(
    data: UpdateMyProfileData
  ): Promise<UpdateMyProfileResponse> {
    try {
      // TODO: Uncomment when API endpoints are ready and authentication is implemented
      // const response = await fetch(`${this.baseURL}/users/me`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // Add authorization header when authentication is implemented
      //     // 'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(data),
      // });

      // const responseData = await response.json();

      // if (!response.ok) {
      //   throw new Error(responseData.message || 'Failed to update profile');
      // }

      // return {
      //   success: true,
      //   message: responseData.message || 'Profile updated successfully',
      //   user: responseData.user,
      // };

      // Mock functionality: Wait for 2 seconds and return success
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock updated user profile data
      const updatedUserProfile: UserProfile = {
        id: "uuid-123-456-789",
        email: data.email || "john.doe@example.com",
        role: "student",
        status: "active",
        fullName: data.fullName || "John Doe",
        profilePictureUrl: data.profilePictureUrl || "/Profile.jpg",
        gradeLevel: data.gradeLevel !== undefined ? data.gradeLevel : 10,
        learningGoals:
          data.learningGoals !== undefined
            ? data.learningGoals
            : "Improve mathematics and science skills",
        qualifications:
          data.qualifications !== undefined ? data.qualifications : null,
        experienceYears:
          data.experienceYears !== undefined ? data.experienceYears : null,
        bio:
          data.bio !== undefined
            ? data.bio
            : "Enthusiastic learner passionate about STEM subjects",
        isVerified: true,
      };

      return {
        success: true,
        message: "Profile updated successfully",
        user: updatedUserProfile,
      };
    } catch (error) {
      console.error("Update my profile error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }

  /**
   * Get the full profile of the currently authenticated user
   * @returns Promise with user profile response
   */
  async getMyProfile(): Promise<GetMyProfileResponse> {
    try {
      // TODO: Uncomment when API endpoints are ready and authentication is implemented
      // const response = await fetch(`${this.baseURL}/users/me`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // Add authorization header when authentication is implemented
      //     // 'Authorization': `Bearer ${token}`,
      //   },
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || 'Failed to fetch user profile');
      // }

      // return {
      //   success: true,
      //   message: 'User profile fetched successfully',
      //   user: data,
      // };

      // Mock functionality: Return mock user profile data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user profile data - you can customize this based on different user types
      const mockUserProfile: UserProfile = {
        id: "uuid-123-456-789",
        email: "john.doe@example.com",
        role: "student",
        status: "active",
        fullName: "John Doe",
        profilePictureUrl: "/Profile.jpg",
        gradeLevel: 10,
        learningGoals: "Improve mathematics and science skills",
        qualifications: null, // For students, this might be null
        experienceYears: null, // For students, this might be null
        bio: "Enthusiastic learner passionate about STEM subjects",
        isVerified: true,
      };

      return {
        success: true,
        message: "User profile fetched successfully",
        user: mockUserProfile,
      };
    } catch (error) {
      console.error("Get my profile error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }

  /**
   * Get user profile image
   * @param userId - User ID (optional, for now returns default from public folder)
   * @returns Promise with profile image URL
   */
  async getProfileImage(userId?: string): Promise<GetProfileImageResponse> {
    try {
      // TODO: Uncomment when API endpoints are ready
      // const response = await fetch(`${this.baseURL}/user/profile-image/${userId}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // Add authorization header when authentication is implemented
      //     // 'Authorization': `Bearer ${token}`,
      //   },
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || 'Failed to fetch profile image');
      // }

      // return {
      //   success: true,
      //   message: 'Profile image fetched successfully',
      //   imageUrl: data.imageUrl,
      // };

      // Mock functionality: Return default profile image from public folder
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        message: "Profile image fetched successfully",
        imageUrl: "/Profile.jpg", // Assuming you'll add a default profile image to public folder
      };
    } catch (error) {
      console.error("Get profile image error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }

  /**
   * Get all teachers
   * @returns Promise with all teachers response
   */
  async getAllTeachers(): Promise<GetAllTeachersResponse> {
    try {
      // TODO: Uncomment when API endpoints are ready
      // const response = await fetch(`${this.baseURL}/users/teachers`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || 'Failed to fetch teachers');
      // }

      // return {
      //   success: true,
      //   message: 'Teachers fetched successfully',
      //   teachers: data,
      // };

      // Mock functionality: Return mock teacher data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock teacher profiles data
      const mockTeachers: TeacherProfile[] = [
        {
          userId: "teacher-uuid-1",
          fullName: "Mr. Perera",
          qualifications: "M.Sc. in Mathematics",
          experienceSummary: "10+ years of teaching experience.",
          level: 3,
        },
        {
          userId: "teacher-uuid-2",
          fullName: "Ms. Fernando",
          qualifications: "B.Sc. in Physics, M.Ed.",
          experienceSummary: "8 years of teaching physics and science.",
          level: 2,
        },
        {
          userId: "teacher-uuid-3",
          fullName: "Dr. Silva",
          qualifications: "Ph.D. in Chemistry",
          experienceSummary: "15 years of university and high school teaching.",
          level: 3,
        },
        {
          userId: "teacher-uuid-4",
          fullName: "Mrs. Wickramasinghe",
          qualifications: "B.A. in English Literature",
          experienceSummary: "12 years of teaching English and literature.",
          level: 2,
        },
        {
          userId: "teacher-uuid-5",
          fullName: "Mr. Jayasinghe",
          qualifications: "B.Sc. in Computer Science",
          experienceSummary: "6 years of teaching programming and IT.",
          level: 1,
        },
        {
          userId: "teacher-uuid-6",
          fullName: "Ms. Rathnayake",
          qualifications: "B.Ed. in Primary Education",
          experienceSummary: "3 years of elementary teaching experience.",
          level: 0,
        },
        {
          userId: "teacher-uuid-7",
          fullName: "Mr. Gunasekara",
          qualifications: "M.A. in History",
          experienceSummary: "7 years of secondary school teaching.",
          level: 1,
        },
        {
          userId: "teacher-uuid-8",
          fullName: "Dr. Mendis",
          qualifications: "Ph.D. in Biology, M.Sc.",
          experienceSummary: "20+ years of advanced biology instruction.",
          level: 3,
        },
      ];

      return {
        success: true,
        message: "Teachers fetched successfully",
        teachers: mockTeachers,
      };
    } catch (error) {
      console.error("Get all teachers error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }

  /**
   * Get a specific teacher profile by userId
   * @param userId - Teacher user ID
   * @returns Promise with teacher profile response
   */
  async getTeacher(userId: string): Promise<GetTeacherResponse> {
    try {
      // TODO: Uncomment when API endpoints are ready
      // const response = await fetch(`${this.baseURL}/users/teachers/${userId}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || 'Failed to fetch teacher profile');
      // }

      // return {
      //   success: true,
      //   message: 'Teacher profile fetched successfully',
      //   teacher: data,
      // };

      // Mock functionality: Return mock teacher data based on userId
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock detailed teacher profiles data
      const mockDetailedTeachers: { [key: string]: DetailedTeacherProfile } = {
        "teacher-uuid-1": {
          userId: "teacher-uuid-1",
          fullName: "Mr. Perera",
          address: "123 Colombo Road, Colombo 03, Sri Lanka",
          phoneNumber: "+94 71 234 5678",
          qualifications: "M.Sc. in Mathematics, B.Sc. in Applied Mathematics",
          experienceSummary:
            "10+ years of teaching experience in secondary and higher education.",
          yearsOfExperience: 12,
          level: 3,
          educationLevel: "Master's Degree",
          bioOrTeachingPhilosophy:
            "I believe in making mathematics accessible and enjoyable for all students. My approach focuses on real-world applications and interactive problem-solving.",
          subjectsTaught: [
            "Mathematics",
            "Advanced Mathematics",
            "Statistics",
            "Calculus",
          ],
          profilePictureUrl: "/Profile.jpg",
          isVerified: true,
        },
        "teacher-uuid-2": {
          userId: "teacher-uuid-2",
          fullName: "Ms. Fernando",
          address: "456 Kandy Road, Kandy, Sri Lanka",
          phoneNumber: "+94 77 876 5432",
          qualifications: "B.Sc. in Physics, M.Ed. in Science Education",
          experienceSummary:
            "8 years of teaching physics and science with focus on laboratory work.",
          yearsOfExperience: 8,
          level: 2,
          educationLevel: "Master's Degree",
          bioOrTeachingPhilosophy:
            "Science comes alive through hands-on experiments and real-world connections. I strive to ignite curiosity and critical thinking in my students.",
          subjectsTaught: ["Physics", "General Science", "Laboratory Science"],
          profilePictureUrl: "/Profile.jpg",
          isVerified: true,
        },
        "teacher-uuid-3": {
          userId: "teacher-uuid-3",
          fullName: "Dr. Silva",
          address: "789 Galle Road, Galle, Sri Lanka",
          phoneNumber: "+94 70 123 9876",
          qualifications:
            "Ph.D. in Chemistry, M.Sc. in Organic Chemistry, B.Sc. in Chemistry",
          experienceSummary:
            "15 years of university and high school teaching with research background.",
          yearsOfExperience: 15,
          level: 3,
          educationLevel: "Doctoral Degree",
          bioOrTeachingPhilosophy:
            "Chemistry is the bridge between physics and biology. I help students understand the molecular world through structured learning and practical applications.",
          subjectsTaught: [
            "Chemistry",
            "Organic Chemistry",
            "Biochemistry",
            "Advanced Chemistry",
          ],
          profilePictureUrl: "/Profile.jpg",
          isVerified: true,
        },
        "teacher-uuid-4": {
          userId: "teacher-uuid-4",
          fullName: "Mrs. Wickramasinghe",
          address: "321 Negombo Road, Negombo, Sri Lanka",
          phoneNumber: "+94 76 543 2109",
          qualifications: "B.A. in English Literature, Diploma in TESOL",
          experienceSummary:
            "12 years of teaching English and literature with creative writing expertise.",
          yearsOfExperience: 12,
          level: 2,
          educationLevel: "Bachelor's Degree",
          bioOrTeachingPhilosophy:
            "Language is the gateway to understanding cultures and expressing creativity. I focus on building confidence in communication and literary appreciation.",
          subjectsTaught: [
            "English",
            "Literature",
            "Creative Writing",
            "Communication Skills",
          ],
          profilePictureUrl: "/Profile.jpg",
          isVerified: true,
        },
        "teacher-uuid-5": {
          userId: "teacher-uuid-5",
          fullName: "Mr. Jayasinghe",
          address: "654 Matara Road, Matara, Sri Lanka",
          phoneNumber: "+94 75 987 6543",
          qualifications:
            "B.Sc. in Computer Science, Certification in Software Development",
          experienceSummary:
            "6 years of teaching programming and IT with industry experience.",
          yearsOfExperience: 6,
          level: 1,
          educationLevel: "Bachelor's Degree",
          bioOrTeachingPhilosophy:
            "Technology shapes our future. I combine theoretical knowledge with practical coding skills to prepare students for the digital world.",
          subjectsTaught: [
            "Computer Science",
            "Programming",
            "Web Development",
            "Database Management",
          ],
          profilePictureUrl: "/Profile.jpg",
          isVerified: true,
        },
        "teacher-uuid-6": {
          userId: "teacher-uuid-6",
          fullName: "Ms. Rathnayake",
          address: "987 Kurunegala Road, Kurunegala, Sri Lanka",
          phoneNumber: "+94 72 456 7890",
          qualifications:
            "B.Ed. in Primary Education, Diploma in Child Psychology",
          experienceSummary:
            "3 years of elementary teaching experience with child development focus.",
          yearsOfExperience: 3,
          level: 0,
          educationLevel: "Bachelor's Degree",
          bioOrTeachingPhilosophy:
            "Every child is unique and capable of learning. I create nurturing environments that foster curiosity, creativity, and foundational academic skills.",
          subjectsTaught: [
            "Elementary Mathematics",
            "Elementary Science",
            "English for Kids",
            "General Studies",
          ],
          profilePictureUrl: "/Profile.jpg",
          isVerified: true,
        },
        "teacher-uuid-7": {
          userId: "teacher-uuid-7",
          fullName: "Mr. Gunasekara",
          address: "147 Anuradhapura Road, Anuradhapura, Sri Lanka",
          phoneNumber: "+94 74 321 0987",
          qualifications: "M.A. in History, B.A. in Social Sciences",
          experienceSummary:
            "7 years of secondary school teaching with focus on Sri Lankan history.",
          yearsOfExperience: 7,
          level: 1,
          educationLevel: "Master's Degree",
          bioOrTeachingPhilosophy:
            "History teaches us about human experiences and helps us understand the present. I make the past come alive through storytelling and critical analysis.",
          subjectsTaught: ["History", "Social Studies", "Civics", "Geography"],
          profilePictureUrl: "/Profile.jpg",
          isVerified: true,
        },
        "teacher-uuid-8": {
          userId: "teacher-uuid-8",
          fullName: "Dr. Mendis",
          address: "258 Jaffna Road, Jaffna, Sri Lanka",
          phoneNumber: "+94 73 654 3210",
          qualifications:
            "Ph.D. in Biology, M.Sc. in Molecular Biology, B.Sc. in Biological Sciences",
          experienceSummary:
            "20+ years of advanced biology instruction with research publications.",
          yearsOfExperience: 22,
          level: 3,
          educationLevel: "Doctoral Degree",
          bioOrTeachingPhilosophy:
            "Biology reveals the intricate beauty of life. I guide students through the complexities of living systems with scientific rigor and wonder.",
          subjectsTaught: [
            "Biology",
            "Advanced Biology",
            "Molecular Biology",
            "Genetics",
            "Ecology",
          ],
          profilePictureUrl: "/Profile.jpg",
          isVerified: true,
        },
      };

      // Find the teacher by userId
      const teacher = mockDetailedTeachers[userId];

      if (!teacher) {
        return {
          success: false,
          message: "Teacher not found",
        };
      }

      return {
        success: true,
        message: "Teacher profile fetched successfully",
        teacher: teacher,
      };
    } catch (error) {
      console.error("Get teacher error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }
}

// Export a singleton instance
export const userService = new UserService();

// Export the class for testing or multiple instances if needed
export default UserService;
