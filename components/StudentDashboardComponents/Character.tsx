import { useAnimations, useGLTF, Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Vector3, AnimationClip } from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js"; // important!
import { useRouter } from "next/navigation";
import TalkBubble from "./TalkBubble";

type GLTFResult = {
  scene: Group;
  animations: AnimationClip[];
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
  conceptProp?: ConceptProp | null;
  side?: "left" | "right";
}

export default function Character({
  modelName,
  position,
  rotation,
  scale,
  conceptProp,
  side = "left",
}: CharacterProps) {
  const group = useRef<Group>(null);
  const { camera } = useThree();
  const [isVisible, setIsVisible] = useState(true);
  const [isVisibleHTML, setIsVisibleHTML] = useState(true);
  const router = useRouter();

  // Preload for performance (optional)
  useEffect(() => {
    // useGLTF.preload(`/models/${modelName}`);
    useGLTF.preload(`/models/${modelName}`);
  }, [modelName]);

  // Load model once
  const { scene, animations } = useGLTF(`/models/${modelName}`) as GLTFResult;

  // Clone the scene so each character gets its own skeleton & materials
  const clonedScene = useMemo(() => clone(scene), [scene]);

  // Setup animations
  const { actions } = useAnimations(animations, group);

  // Determine animation based on conceptProp status
  const animation = useMemo(() => {
    if (!conceptProp) return "ProgressingAnimation"; // Default animation

    // Special handling for the "Starting Station"
    if (conceptProp.conceptId === "Starting Station") {
      // For Starting Station, show progressing animation for waiting or progressing
      if (
        conceptProp.status === "waiting" ||
        conceptProp.status === "progressing"
      ) {
        return "ProgressingAnimation";
      }
      // If done, show done animation
      if (conceptProp.status === "done") {
        return "DoneAnimation";
      }
      // Fallback
      return "ProgressingAnimation";
    }

    // Default behavior for other concepts
    switch (conceptProp.status) {
      case "done":
        return "DoneAnimation";
      case "progressing":
        return "ProgressingAnimation";
      case "waiting":
        return "WaitingAnimation";
      default:
        return "ProgressingAnimation";
    }
  }, [conceptProp]);

  useEffect(() => {
    if (actions && actions[animation]) {
      actions[animation].play();
      // console.warn("Playing animation:", animation);
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
      setIsVisibleHTML(distance <= 15);
    }
  });

  // Function to get status color
  const _getStatusColor = (status: string) => {
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
  const _getStatusBackground = (status: string) => {
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
          position={
            side === "left"
              ? [position[0] - 4, position[1] + 4, position[2]]
              : [position[0] + 4, position[1] + 4, position[2]]
          }
          center
          distanceFactor={15}
          occlude
        >
          <TalkBubble
            conceptProp={conceptProp}
            onButtonClick={handleButtonClick}
            side={side}
          />
        </Html>
      )}
    </group>
  );
}
