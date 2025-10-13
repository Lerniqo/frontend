"use client";

import { Suspense } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import ModelRenderer from "@/components/StudentDashboardComponents/ModelRenderer";
import Character from "./Character";
import PathCameraController from "@/components/StudentDashboardComponents/PathCameraController";
import type { Scene3DProps, CharacterModel } from "@/types/dashboard.types";

interface ConceptProp {
  conceptName: string;
  conceptId: string;
  status: "done" | "progressing" | "waiting";
}

const startingPoint: CharacterModel = {
  id: 0,
  position: [4, 0, 126],
  rotation: [0, -2.5, 0],
  scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
  modelName: "LuffyAnimation.glb",
};

const startingConceptProp: ConceptProp = {
  conceptName: "Start Learning Path",
  conceptId: "Starting Station",
  status: "waiting",
};

export const positionsOfCharacters: CharacterModel[] = [
  {
    id: 1,
    position: [-4, 0, 138],
    rotation: [0, -3.6, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 2,
    position: [-8, 0, 144],
    rotation: [0, -3.9, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 3,
    position: [-10, 0, 152],
    rotation: [0, -3.9, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 4,
    position: [-8, 0, 162],
    rotation: [0, -4.0, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 5,
    position: [6, 0, 174],
    rotation: [0, -2.2, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 6,
    position: [6, 0, 186],
    rotation: [0, -2.2, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 7,
    position: [6, 0, 194],
    rotation: [0, -2.2, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 8,
    position: [-6, 0, 208],
    rotation: [0, -3.7, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 9,
    position: [4, 0, 222],
    rotation: [0, -2.5, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 10,
    position: [-4, 0, 236],
    rotation: [0, -3.6, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 11,
    position: [-8, 0, 244],
    rotation: [0, -3.8, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 12,
    position: [-8, 0, 254],
    rotation: [0, -3.8, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 13,
    position: [8, 0, 266],
    rotation: [0, -2.3, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 14,
    position: [8, 0, 280],
    rotation: [0, -2.3, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 15,
    position: [-6, 0, 296],
    rotation: [0, -3.7, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 16,
    position: [6, 0, 308],
    rotation: [0, -2.3, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 17,
    position: [6, 0, 318],
    rotation: [0, -2.3, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 18,
    position: [6, 0, 328],
    rotation: [0, -2.6, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 19,
    position: [6, 0, 340],
    rotation: [0, -2.6, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 20,
    position: [-10, 0, 352],
    rotation: [0, -3.7, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 21,
    position: [8, 0, 364],
    rotation: [0, -2.4, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 22,
    position: [8, 0, 374],
    rotation: [0, -2.2, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 23,
    position: [8, 0, 384],
    rotation: [0, -2.2, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 24,
    position: [-8, 0, 392],
    rotation: [0, -3.8, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 25,
    position: [-8, 0, 408],
    rotation: [0, -4.0, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 26,
    position: [8, 0, 418],
    rotation: [0, -2.3, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 27,
    position: [2, 0, 428],
    rotation: [0, -2.8, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 28,
    position: [4, 0, 440],
    rotation: [0, -2.6, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 29,
    position: [2, 0, 448],
    rotation: [0, -2.6, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 30,
    position: [-4, 0, 456],
    rotation: [0, -3.1, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
  {
    id: 31,
    position: [-46, 0, 454],
    rotation: [0, -4.6, 0],
    scale: [3.343155108481974, 3.343155108481974, 3.343155108481974],
    modelName: "LuffyAnimation.glb",
  },
];

export default function Scene3D({
  currentPathProgress,
  setCurrentPathProgress,
  mouseOffset,
  getInterpolatedPosition,
  getLookDirection,
  enableOrbitControls = true,
  characters = [],
  learningPath = [],
}: Scene3DProps) {
  return (
    <>
      {/* Camera Controller */}
      <PathCameraController
        currentPathProgress={currentPathProgress}
        setCurrentPathProgress={setCurrentPathProgress}
        mouseOffset={mouseOffset}
        getInterpolatedPosition={getInterpolatedPosition}
        getLookDirection={getLookDirection}
      />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />

      {/* Environment for reflections and ambient lighting */}
      <Environment preset="apartment" />

      {/* 3D Model */}
      <Suspense fallback={null}>
        <Character
          key={startingPoint.id}
          modelName={startingPoint.modelName}
          position={startingPoint.position}
          rotation={startingPoint.rotation}
          scale={startingPoint.scale}
          animation="AnimationProgressing"
          conceptProp={startingConceptProp}
        />

        {/* Render characters based on the characters prop - only if starting station is not waiting */}
        {startingConceptProp.status !== "waiting" &&
          characters.map((characterId, index) => {
            const characterData = positionsOfCharacters.find(
              (char) => char.id === characterId
            );
            if (!characterData) return null;

            // Get the corresponding concept for this character
            const conceptProp = learningPath[index] || null;

            console.log(characterData.id);
            return (
              <Character
                key={characterData.id}
                modelName={characterData.modelName}
                position={characterData.position}
                rotation={characterData.rotation}
                scale={characterData.scale}
                animation="AnimationProgressing"
                conceptProp={conceptProp}
              />
            );
          })}
        <ModelRenderer />
      </Suspense>

      {/* Camera Controls - enable for testing by toggling prop */}
      {/* <OrbitControls enabled={enableOrbitControls} /> */}
    </>
  );
}
