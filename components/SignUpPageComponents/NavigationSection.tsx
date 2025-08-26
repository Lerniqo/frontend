import { userService } from "@/services/userService";

export default function NavigationSection({
  ref,
  currentStep,
  setCurrentStep,
  totalSteps,
  animateStepTransition,
  isStep2Valid = true,
  setLoading,
  step2Data,
  userType,
}: {
  ref: React.Ref<HTMLDivElement>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  animateStepTransition: (direction: "forward" | "backward") => void;
  isStep2Valid?: boolean;
  setLoading: (loading: boolean) => void;
  step2Data: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  userType: string;
}) {
  const handlePrevStep = () => {
    if (currentStep > 0) {
      animateStepTransition("backward");
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
      }, 300);
    }
  };

  const handleNextStep = async () => {
    // For step 2 (Register Email), check if form is valid and register user
    if (currentStep === 2) {
      if (!isStep2Valid) {
        return;
      }
      setLoading(true);
      
      return userService
        .basicRegister({
          email: step2Data.email,
          password: step2Data.password,
          role: (userType.charAt(0).toUpperCase() + userType.slice(1)) as
            | "Student"
            | "Teacher",
        })
        .then((response) => {
          if (response.success) {
            // Registration successful, proceed to next step
            animateStepTransition("forward");
            setTimeout(() => {
              setCurrentStep(currentStep + 1);
            }, 300);
          } else {
            // Handle registration error
            alert(`Registration failed: ${response.message}`);
          }
        })
        .catch((error) => {
          alert(
            `Registration error: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }

    if (currentStep < totalSteps) {
      animateStepTransition("forward");
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    }
  };

  return (
    <div
      ref={ref}
      className="bg-gray-50 px-10 py-6 flex justify-between items-center"
    >
      <button
        onClick={handlePrevStep}
        disabled={currentStep === 0}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          currentStep === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-white transform hover:scale-105"
        }`}
      >
        Back
      </button>

      <div className="flex space-x-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i + 1 === currentStep
                ? "bg-blue-500 w-8"
                : i + 1 < currentStep
                ? "bg-green-500"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      <button
        onClick={handleNextStep}
        disabled={
          currentStep === totalSteps ||
          (currentStep === 2 && !isStep2Valid) ||
          currentStep === 3 ||
          currentStep === 4
        }
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          currentStep === totalSteps ||
          (currentStep === 2 && !isStep2Valid) ||
          currentStep === 3 ||
          currentStep === 4
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600 transform hover:scale-105 shadow-lg"
        }`}
      >
        {currentStep === totalSteps
          ? "Complete"
          : currentStep === 2 && !isStep2Valid
          ? "Please complete all fields"
          : "Next"}
      </button>
    </div>
  );
}
