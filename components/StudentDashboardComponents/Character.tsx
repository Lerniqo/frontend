import { useAnimations, useGLTF, Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js"; // important!
import { useRouter } from "next/navigation";

type GLTFResult = {
  scene: Group;
  animations: any[];
};

interface ConceptProp {
  conceptName: string;
  conceptId: string;
  status: "done" | "progressing" | "waiting";
}

interface CharacterProps {
  modelName: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  animation?: string;
  conceptProp?: ConceptProp | null;
}

export default function Character({
  modelName,
  position,
  rotation,
  scale,
  animation = "AnimationProgressing",
  conceptProp,
}: CharacterProps) {
  const group = useRef<Group>(null);
  const { camera } = useThree();
  const [isVisible, setIsVisible] = useState(true);
  const [isVisibleHTML, setIsVisibleHTML] = useState(true);
  const router = useRouter();

  // Preload for performance (optional)
  useEffect(() => {
    useGLTF.preload(`/models/${modelName}`);
  }, [modelName]);

  // Load model once
  const { scene, animations } = useGLTF(`/models/${modelName}`) as GLTFResult;

  // Clone the scene so each character gets its own skeleton & materials
  const clonedScene = useMemo(() => clone(scene), [scene]);

  // Setup animations
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && actions[animation]) {
      actions[animation].play();
    }
  }, [actions, animation]);

  // Check distance between camera and character on each frame
  useFrame(() => {
    if (camera) {
      const cameraPosition = camera.position;
      const characterPosition = new Vector3(
        position[0],
        position[1],
        position[2]
      );
      const distance = cameraPosition.distanceTo(characterPosition);

      // Set visibility based on distance (hide if less than 50 units)
      setIsVisible(distance <= 50);
      setIsVisibleHTML(distance <= 25);
    }
  });

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "#10b981"; // green
      case "progressing":
        return "#f59e0b"; // amber
      case "waiting":
        return "#6b7280"; // gray
      default:
        return "#6b7280";
    }
  };

  // Function to get status background
  const getStatusBackground = (status: string) => {
    switch (status) {
      case "done":
        return "#064e3b"; // dark green
      case "progressing":
        return "#451a03"; // dark amber
      case "waiting":
        return "#374151"; // dark gray
      default:
        return "#374151";
    }
  };

  // Function to handle button clicks
  const handleButtonClick = (action: string, conceptId?: string) => {
    if (action === "learning-path-quiz") {
      router.push("/learning-path-quiz");
    } else if (action === "concept" && conceptId) {
      router.push(`/concept?conceptId=${conceptId}`);
    }
  };

  // Function to render HTML content based on station type and status
  const renderStationContent = () => {
    if (!conceptProp) return null;

    const isStartingStation = conceptProp.conceptName === "Start Learning Path";

    if (isStartingStation) {
      // Starting Station Logic
      switch (conceptProp.status) {
        case "waiting":
          return (
            <div className="px-4 py-3 rounded-lg shadow-lg bg-slate-800 border-2 border-blue-500 min-w-[300px] text-center">
              <div className="text-white text-sm mb-3">
                Hi there! I'm here to guide you. Let's create a personalized
                learning path together so you can master this step by step.
              </div>
              <button
                onClick={() => handleButtonClick("learning-path-quiz")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Let's Go!
              </button>
            </div>
          );
        case "progressing":
          return (
            <div className="px-4 py-3 rounded-lg shadow-lg bg-amber-900 border-2 border-amber-500 min-w-[300px] text-center">
              <div className="text-white text-sm">
                Welcome back! Let's continue your learning path and make more
                progress together.
              </div>
            </div>
          );
        case "done":
          return (
            <div className="px-4 py-3 rounded-lg shadow-lg bg-green-900 border-2 border-green-500 min-w-[300px] text-center">
              <div className="text-white text-sm">
                Awesome! You've finished all the steps. Keep up the great work!
              </div>
            </div>
          );
        default:
          return null;
      }
    } else {
      // Regular Station Logic
      switch (conceptProp.status) {
        case "progressing":
          return (
            <div className="px-4 py-3 rounded-lg shadow-lg bg-amber-900 border-2 border-amber-500 min-w-[300px] text-center">
              <div className="text-white text-sm mb-3">
                Hi there! In this station, you'll learn about{" "}
                {conceptProp.conceptName}. Let's explore it together and master
                it step by step!
              </div>
              <button
                onClick={() =>
                  handleButtonClick("concept", conceptProp.conceptId)
                }
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Go
              </button>
            </div>
          );
        case "done":
          return (
            <div className="px-4 py-3 rounded-lg shadow-lg bg-green-900 border-2 border-green-500 min-w-[300px] text-center">
              <div className="text-white text-sm">
                Great job! You've completed {conceptProp.conceptName}. Let's
                move on to the next concept!
              </div>
            </div>
          );
        case "waiting":
          return (
            <div className="px-4 py-3 rounded-lg shadow-lg bg-gray-700 border-2 border-gray-500 min-w-[300px] text-center">
              <div className="text-white text-sm">
                Hold on! You need to complete all previous concepts before
                learning {conceptProp.conceptName}. Let's go step by step!
              </div>
            </div>
          );
        default:
          return null;
      }
    }
  };

  return (
    <group ref={group} visible={isVisible}>
      <primitive
        object={clonedScene}
        position={position}
        rotation={rotation}
        scale={scale}
      />

      {/* Display concept information using Html */}
      {conceptProp && isVisibleHTML && (
        <Html
          position={[position[0]+2, position[1] + 5, position[2]]}
          center
          distanceFactor={15}
          occlude
        >
          {renderStationContent()}
        </Html>
      )}
    </group>
  );
}
