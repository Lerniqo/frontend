import StudentProfileDetailsForm from "../StudentProfileDetailsForm";
import TeacherProfileDetailsForm from "../TeacherProfileDetailsForm";

import { userService } from "../../../services/userService";

export default function ProfileDetailsForm({
  setLoading,
  setCurrentStep,
  userType,
}: {
  setLoading: (loading: boolean) => void;
  setCurrentStep: (step: number) => void;
  userType: string;
}) {
  const handleSubmit = async (data: any) => {
    try {
      // Handle form submission logic here
      setLoading(true);

      let response;

      if (userType === "student") {
        response = await userService.updateStudentProfileData(data);
      } else if (userType === "teacher") {
        response = await userService.updateTeacherProfileData(data);
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
