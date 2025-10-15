"use client";

import { Canvas } from "@react-three/fiber";
import { useCameraPathNavigation } from "@/hooks/useCameraPathNavigation";
import { CAMERA_PATH } from "@/constants/cameraPath";
import { Scene3D, DashboardUI } from "@/components/StudentDashboardComponents";
import { positionsOfCharacters } from "@/components/StudentDashboardComponents/Scene3D";
import AIChatbot from "@/components/StudentDashboardComponents/AIChatbot";
import {
  getLearningPath,
  LearningPathConcept,
} from "@/services/contentService";
import { useState, useEffect } from "react";
import "@/app/globals.css";

export default function StudentDashboard() {
  const {
    currentPathProgress,
    setCurrentPathProgress,
    mouseOffset,
    getInterpolatedPosition,
    getLookDirection,
  } = useCameraPathNavigation();

  const [learningPath, setLearningPath] = useState<LearningPathConcept[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch learning path data on component mount
  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        const data = await getLearningPath();
        setLearningPath(data);
      } catch (error) {
        console.error("Failed to fetch learning path:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPath();
  }, []);

  function generateEvenlySpacedList(
    n: number,
    numberOfAllPositions: number
  ): number[] {
    if (n <= 1) return [1];
    if (n === 2) return [1, numberOfAllPositions];

    const result: number[] = [];
    const gap = (numberOfAllPositions - 1) / (n - 1); // exact step

    for (let i = 0; i < n; i++) {
      const value = Math.round(1 + i * gap); // round to nearest integer
      result.push(value);
    }

    // Ensure first and last positions are correct
    result[0] = 1;
    result[result.length - 1] = numberOfAllPositions;

    // Fix duplicates caused by rounding
    for (let i = 1; i < result.length; i++) {
      if (result[i] <= result[i - 1]) {
        result[i] = result[i - 1] + 1;
      }
    }

    // Clip values exceeding maximum
    for (let i = 0; i < result.length; i++) {
      if (result[i] > numberOfAllPositions) {
        result[i] = numberOfAllPositions;
      }
    }

    return result;
  }

  // Example:
  // console.warn(generateEvenlySpacedList(5, 10));
  // Output: [1, 3, 5, 8, 10]

  // Create extended learning path with starting station
  // const extendedLearningPath = [
  //   {
  //     conceptName: "Start Learning Path",
  //     conceptId: "Starting Station",
  //     status: "progressing" as const,
  //   },
  //   ...learningPath,
  // ];

  // Generate character positions based on learning path length + 1
  const characterPositions = generateEvenlySpacedList(
    learningPath.length,
    positionsOfCharacters.length
  );

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading learning path...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Gaming Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-600/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>

      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: CAMERA_PATH[0].position as [number, number, number],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          // Prevent context loss
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={(state) => {
          // Add context loss handlers
          const gl = state.gl.getContext();
          if (gl) {
            state.gl.domElement.addEventListener(
              "webglcontextlost",
              (event) => {
                event.preventDefault();
                console.warn("WebGL context lost. Attempting to restore...");
              }
            );

            state.gl.domElement.addEventListener("webglcontextrestored", () => {
              console.log("WebGL context restored successfully");
            });
          }
        }}
      >
        <Scene3D
          currentPathProgress={currentPathProgress}
          setCurrentPathProgress={setCurrentPathProgress}
          mouseOffset={mouseOffset}
          getInterpolatedPosition={getInterpolatedPosition}
          getLookDirection={getLookDirection}
          characters={characterPositions}
          learningPath={learningPath}
        />
      </Canvas>

      {/* UI Overlay */}
      <DashboardUI currentPathProgress={currentPathProgress} />

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
