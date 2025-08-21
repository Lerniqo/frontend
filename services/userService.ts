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
}

// Export a singleton instance
export const userService = new UserService();

// Export the class for testing or multiple instances if needed
export default UserService;
