"use client";

import { Canvas } from "@react-three/fiber";
import { useCameraPathNavigation } from "@/hooks/useCameraPathNavigation";
import { CAMERA_PATH } from "@/constants/cameraPath";
import { Scene3D, DashboardUI } from "@/components/StudentDashboardComponents";

export default function StudentDashboard() {
  const {
    currentPathProgress,
    setCurrentPathProgress,
    mouseOffset,
    getInterpolatedPosition,
    getLookDirection,
  } = useCameraPathNavigation();

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white">
      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: CAMERA_PATH[0].position as [number, number, number],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
      >
        <Scene3D
          currentPathProgress={currentPathProgress}
          setCurrentPathProgress={setCurrentPathProgress}
          mouseOffset={mouseOffset}
          getInterpolatedPosition={getInterpolatedPosition}
          getLookDirection={getLookDirection}
        />
      </Canvas>

      {/* UI Overlay */}
      <DashboardUI currentPathProgress={currentPathProgress} />
    </div>
  );
}
