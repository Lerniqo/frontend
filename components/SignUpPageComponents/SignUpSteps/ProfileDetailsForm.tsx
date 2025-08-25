import StudentProfileDetailsForm from "../StudentProfileDetailsForm";
import TeacherProfileDetailsForm from "../TeacherProfileDetailsForm";

import { userService } from "../../../services/userService";

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

export default function ProfileDetailsForm({
  setLoading,
  setCurrentStep,
  userType,
}: {
  setLoading: (loading: boolean) => void;
  setCurrentStep: (step: number) => void;
  userType: string;
}) {
  const handleSubmit = async (data: StudentProfileData | TeacherProfileData) => {
    try {
      // Handle form submission logic here
      setLoading(true);

      const response = await userService.completeProfile(data);

      if (response.success) {
        // Success - proceed to next step
        setCurrentStep(5);
      } else {
        // Handle API error response
        console.error("Profile completion failed:", response.message);
        alert(`Profile completion failed: ${response.message}`);
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error during profile completion:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (userType === "student") {
    return <StudentProfileDetailsForm onSubmit={handleSubmit} />;
  } else if (userType === "teacher") {
    return <TeacherProfileDetailsForm onSubmit={handleSubmit} />;
  }
}
