import React from "react";

interface ConceptProp {
  stepNumber: number;
  title: string;
  conceptName?: string;
  conceptId?: string;
  estimatedDuration: string;
  description: string;
  prerequisites: string[];
  resources: string[];
  status?: "done" | "progressing" | "waiting";
}

interface TalkBubbleProps {
  conceptProp: ConceptProp;
  onButtonClick: (
    action: string,
    conceptId?: string,
    stepNumber?: number,
    stepTitle?: string
  ) => void;
  side?: "left" | "right";
}

const TalkBubble: React.FC<TalkBubbleProps> = ({
  conceptProp,
  onButtonClick,
  side = "left",
}) => {
  const isStartingStation =
    conceptProp.conceptName === "Start Learning Path" ||
    conceptProp.stepNumber === 0;

  // Function to render content based on station type and status
  const renderContent = () => {
    const displayStatus = conceptProp.status || "progressing";

    if (isStartingStation) {
      // Starting Station Logic
      switch (displayStatus) {
        case "waiting":
          return (
            <div className="flex flex-col h-full">
              <p className="mb-4 flex-grow">
                Hi there! I&apos;m here to guide you. Let&apos;s create a
                personalized learning path together so you can master this step
                by step.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => onButtonClick("learning-path-quiz")}
                  className="font-comic text-xl font-bold text-black bg-white border-4 border-black rounded-2xl px-6 py-3 cursor-pointer transition-all duration-200 ease-in-out shadow-[0_4px_0_0_black] hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_black] active:translate-y-0.5 active:shadow-[0_2px_0_0_black]"
                  style={{ WebkitTextStroke: "0.5px black" }}
                >
                  Let&apos;s Go !
                </button>
              </div>
            </div>
          );
        case "progressing":
          return (
            <p>
              Welcome back! Let&apos;s continue your learning path and make more
              progress together.
            </p>
          );
        case "done":
          return (
            <p>
              Awesome! You&apos;ve finished all the steps. Keep up the great
              work!
            </p>
          );
        default:
          return null;
      }
    } else {
      // Regular Station Logic - Display step information
      switch (displayStatus) {
        case "progressing":
          return (
            <div className="flex flex-col h-full">
              <div className="mb-3 flex-grow">
                <h3 className="text-base font-bold mb-2">
                  Step {conceptProp.stepNumber}: {conceptProp.title}
                </h3>
                <p className="text-sm mb-2">{conceptProp.description}</p>
                <p className="text-xs text-gray-600 mb-1">
                  <strong>Duration:</strong> {conceptProp.estimatedDuration}
                </p>
                {conceptProp.resources && conceptProp.resources.length > 0 && (
                  <div className="text-xs text-gray-600">
                    <strong>Resources:</strong>
                    <ul className="ml-2 mt-1">
                      {conceptProp.resources
                        .slice(0, 2)
                        .map((resource, idx) => (
                          <li key={idx}>• {resource}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() =>
                    onButtonClick(
                      "step-quiz",
                      conceptProp.conceptId,
                      conceptProp.stepNumber,
                      conceptProp.title
                    )
                  }
                  className="font-comic text-xl font-bold text-black bg-white border-4 border-black rounded-2xl px-6 py-3 cursor-pointer transition-all duration-200 ease-in-out shadow-[0_4px_0_0_black] hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_black] active:translate-y-0.5 active:shadow-[0_2px_0_0_black]"
                  style={{ WebkitTextStroke: "0.5px black" }}
                >
                  Complete
                </button>
              </div>
            </div>
          );
        case "done":
          return (
            <div className="flex flex-col h-full">
              <div className="mb-4 flex-grow">
                <h3 className="text-base font-bold mb-2">
                  Step {conceptProp.stepNumber}: {conceptProp.title}
                </h3>
                <p className="text-sm">
                  Great job! You&apos;ve completed {conceptProp.title}.
                  Let&apos;s move on to the next concept!
                </p>
              </div>
            </div>
          );
        case "waiting":
          return (
            <div className="flex flex-col h-full">
              <div className="mb-4 flex-grow">
                <h3 className="text-base font-bold mb-2">
                  Step {conceptProp.stepNumber}: {conceptProp.title}
                </h3>
                <p className="text-sm mb-2">
                  Hold on! You need to complete all previous concepts before
                  learning {conceptProp.title}. Let&apos;s go step by step!
                </p>
                {conceptProp.prerequisites &&
                  conceptProp.prerequisites.length > 0 && (
                    <p className="text-xs text-gray-600">
                      <strong>Prerequisites:</strong>{" "}
                      {conceptProp.prerequisites.join(", ")}
                    </p>
                  )}
              </div>
            </div>
          );
        default:
          return null;
      }
    }
  };

  return (
    <div
      className={`relative bg-white text-black border-4 border-black rounded-[20px] px-8 py-4 max-w-[800px] min-w-[500px] w-[98%] font-comic font-bold text-lg ${
        side === "left"
          ? "before:content-[''] before:absolute before:left-[30px] before:top-[-24px] before:border-l-0 before:border-r-[24px] before:border-t-0 before:border-b-[24px] before:border-solid before:border-transparent before:border-b-black after:content-[''] after:absolute after:left-[32px] after:top-[-20px] after:border-l-0 after:border-r-[20px] after:border-t-0 after:border-b-[20px] after:border-solid after:border-transparent after:border-b-white"
          : "before:content-[''] before:absolute before:right-[30px] before:top-[-24px] before:border-r-0 before:border-l-[24px] before:border-t-0 before:border-b-[24px] before:border-solid before:border-transparent before:border-b-black after:content-[''] after:absolute after:right-[32px] after:top-[-20px] after:border-r-0 after:border-l-[20px] after:border-t-0 after:border-b-[20px] after:border-solid after:border-transparent after:border-b-white"
      }`}
      style={{ WebkitTextStroke: "0.5px black" }}
    >
      {renderContent()}
    </div>
  );
};

export default TalkBubble;
