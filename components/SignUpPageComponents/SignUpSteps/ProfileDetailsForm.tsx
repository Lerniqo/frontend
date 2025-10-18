import StudentProfileDetailsForm from "../StudentProfileDetailsForm";
import TeacherProfileDetailsForm from "../TeacherProfileDetailsForm";
import { userService } from "../../../services/userService";
import { StudentProfileData, TeacherProfileData } from "@/types/auth.types";
import useTracker from "@/hooks/useTracker";
import { TrackingEventType, SignupEventData } from "@/types/tracking.types";
import { useToast } from "@/components/CommonComponents/ToastContainer";

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
  const trackEvent = useTracker();
  const toast = useToast();

  const handleSubmit = async (
    data: StudentProfileData | TeacherProfileData
  ) => {
    try {
      // Handle form submission logic here
      setLoading(true);

      let response;

      if (userType === "Student" || userType.toLowerCase() === "student") {
        response = await userService.completeProfile(
          data as StudentProfileData,
          userId
        );
      } else if (
        userType === "Teacher" ||
        userType.toLowerCase() === "teacher"
      ) {
        response = await userService.completeProfile(
          data as TeacherProfileData,
          userId
        );
      } else {
        throw new Error("Invalid user type");
      }

      if (response.success) {
        // Track successful profile completion
        await trackEvent<SignupEventData>({
          type: TrackingEventType.SIGNUP,
          data: {
            userRole: (userType.charAt(0).toUpperCase() +
              userType.slice(1).toLowerCase()) as "Student" | "Teacher",
            isSuccessful: true,
            completedProfile: true,
          },
          userId: userId,
        });

        toast.success("Profile completed successfully!");

        // Success - proceed to next step
        setCurrentStep(5);
      } else {
        // Handle API error response
        console.error("Profile completion failed:", response.message);
        toast.error(response.message || "Profile completion failed");
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error during profile completion:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  if (userType === "Student" || userType.toLowerCase() === "student") {
    return <StudentProfileDetailsForm onSubmit={handleSubmit} />;
  } else if (userType === "Teacher" || userType.toLowerCase() === "teacher") {
    return <TeacherProfileDetailsForm onSubmit={handleSubmit} />;
  }

  return null;
}
