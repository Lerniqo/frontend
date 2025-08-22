import StudentProfileDetailsForm from "../StudentProfileDetailsForm";
import TeacherProfileDetailsForm from "../TeacherProfileDetailsForm";

import { userService } from "../../../services/userService";

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

      let response;

      if (userType === "student") {
        response = await userService.updateStudentProfileData(data as StudentProfileData);
      } else if (userType === "teacher") {
        response = await userService.updateTeacherProfileData(data as TeacherProfileData);
      } else {
        throw new Error("Invalid user type");
      }

      if (response.success) {
        // Success - proceed to next step
        setCurrentStep(5);
      } else {
        // Handle API error response
        console.error("Profile update failed:", response.message);
        alert(`Profile update failed: ${response.message}`);
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error during profile update:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  //   return (
  //     <div>
  //       <StudentProfileDetailsForm onSubmit={handleSubmit} />
  //     </div>
  //   );
  if (userType === "student") {
    return <StudentProfileDetailsForm onSubmit={handleSubmit} />;
  } else if (userType === "teacher") {
    return <TeacherProfileDetailsForm onSubmit={handleSubmit} />;
  }
}
