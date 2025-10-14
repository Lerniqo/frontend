import React from "react";

interface ConceptProp {
  conceptName: string;
  conceptId: string;
  status: "done" | "progressing" | "waiting";
}

interface TalkBubbleProps {
  conceptProp: ConceptProp;
  onButtonClick: (action: string, conceptId?: string) => void;
  side?: "left" | "right";
}

const TalkBubble: React.FC<TalkBubbleProps> = ({
  conceptProp,
  onButtonClick,
  side = "left",
}) => {
  const isStartingStation = conceptProp.conceptName === "Start Learning Path";

  // Function to render content based on station type and status
  const renderContent = () => {
    if (isStartingStation) {
      // Starting Station Logic
      switch (conceptProp.status) {
        case "waiting":
          return (
            <div className="flex flex-col h-full">
              <p className="mb-4 flex-grow">
                Hi there! I'm here to guide you. Let's create a personalized
                learning path together so you can master this step by step.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => onButtonClick("learning-path-quiz")}
                  className="font-comic text-xl font-bold text-black bg-white border-4 border-black rounded-2xl px-6 py-3 cursor-pointer transition-all duration-200 ease-in-out shadow-[0_4px_0_0_black] hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_black] active:translate-y-0.5 active:shadow-[0_2px_0_0_black]"
                  style={{ WebkitTextStroke: "0.5px black" }}
                >
                  Let's Go !
                </button>
              </div>
            </div>
          );
        case "progressing":
          return (
            <p>
              Welcome back! Let's continue your learning path and make more
              progress together.
            </p>
          );
        case "done":
          return (
            <p>
              Awesome! You've finished all the steps. Keep up the great work!
            </p>
          );
        default:
          return null;
      }
    } else {
      // Regular Station Logic
      switch (conceptProp.status) {
        case "progressing":
          return (
            <div className="flex flex-col h-full">
              <p className="mb-4 flex-grow">
                Hi there! In this station, you'll learn about{" "}
                {conceptProp.conceptName}. Let's explore it together and master
                it step by step!
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() =>
                    onButtonClick("concept", conceptProp.conceptId)
                  }
                  className="font-comic text-xl font-bold text-black bg-white border-4 border-black rounded-2xl px-6 py-3 cursor-pointer transition-all duration-200 ease-in-out shadow-[0_4px_0_0_black] hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_black] active:translate-y-0.5 active:shadow-[0_2px_0_0_black]"
                  style={{ WebkitTextStroke: "0.5px black" }}
                >
                  Let's Go !
                </button>
              </div>
            </div>
          );
        case "done":
          return (
            <p>
              Great job! You've completed {conceptProp.conceptName}. Let's move
              on to the next concept!
            </p>
          );
        case "waiting":
          return (
            <p>
              Hold on! You need to complete all previous concepts before
              learning {conceptProp.conceptName}. Let's go step by step!
            </p>
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
