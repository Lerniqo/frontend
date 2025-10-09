"use client";

import { Suspense } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import ModelRenderer from "@/components/StudentDashboardComponents/ModelRenderer";
import PathCameraController from "@/components/StudentDashboardComponents/PathCameraController";
import type { Scene3DProps } from "@/types/dashboard.types";

export default function Scene3D({
  currentPathProgress,
  setCurrentPathProgress,
  mouseOffset,
  getInterpolatedPosition,
  getLookDirection,
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
        <ModelRenderer />
      </Suspense>

      {/* Camera Controls - disabled since we're handling camera manually */}
      <OrbitControls enabled={false} />
    </>
  );
}
