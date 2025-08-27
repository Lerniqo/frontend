import StudentProfileDetailsForm from "../StudentProfileDetailsForm";
import TeacherProfileDetailsForm from "../TeacherProfileDetailsForm";
import { userService } from "../../../services/userService";
import { StudentProfileData, TeacherProfileData } from "@/types/auth.types";

export default function ProfileDetailsForm({
  setLoading,
  setCurrentStep,
  userType,
  userId,
}: {
  setLoading: (loading: boolean) => void;
  setCurrentStep: (step: number) => void;
  userType: string;
  userId: string;
}) {
  const handleSubmit = async (data: StudentProfileData | TeacherProfileData) => {
    try {
      // Handle form submission logic here
      setLoading(true);

      let response;

      if (userType === "Student") {
        response = await userService.completeProfile(data as StudentProfileData, userId);
      } else if (userType === "Teacher") {
        response = await userService.completeProfile(data as TeacherProfileData, userId);
      } else {
        throw new Error("Invalid user type");
      }

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
  if (userType === "Student") {
    return <StudentProfileDetailsForm onSubmit={handleSubmit} />;
  } else if (userType === "Teacher") {
    return <TeacherProfileDetailsForm onSubmit={handleSubmit} />;
  }
}
