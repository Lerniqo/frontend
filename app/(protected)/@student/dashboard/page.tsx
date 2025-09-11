"use client";

import { Canvas } from "@react-three/fiber";
import { useCameraPathNavigation } from "@/hooks/useCameraPathNavigation";
import { CAMERA_PATH } from "@/constants/cameraPath";
import { Scene3D, DashboardUI } from "@/components/StudentDashboardComponents";
import AIChatbot from "@/components/StudentDashboardComponents/AIChatbot";

export default function StudentDashboard() {
  const {
    currentPathProgress,
    setCurrentPathProgress,
    mouseOffset,
    getInterpolatedPosition,
    getLookDirection,
  } = useCameraPathNavigation();

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

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
