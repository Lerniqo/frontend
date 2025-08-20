"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useState } from "react";

import RoomModel from "@/components/StudentDashboard/RoomModel";
import CameraController from "@/components/StudentDashboard/CameraController";
import LoadingComponent from "../../../../components/SignUpPageComponents/Loading";

import StudentDashboardNavigation from "../../../../components/StudentDashboard/StudentDashboardNavigation";

export default function StudentDashboard() {
  const [loaded, setLoaded] = useState(false);

  // Define your desired initial camera position and rotation
  const initialCameraPosition: [number, number, number] = [
    0.3037647560696746, 3.9325960850440254, 4.125209020634448,
  ];
  const initialCameraRotation: [number, number, number] = [
    -0.1428030183518052, -0.006828639355206486, -0.0009818255355319068,
  ];

  // Optional: Handle camera changes
  const handleCameraChange = () => {
    // This will be called every frame - use sparingly for performance
    // console.log("Camera moved to:", position, rotation);
  };

  return (
    <>
      {!loaded && <LoadingComponent />}

      {/* Camera Debug UI - outside of Canvas */}
      {/* <CameraDebugger showUI={true} logToConsole={true} /> */}

      <div className="w-screen h-screen bg-black">
        <Canvas
          camera={{
            position: initialCameraPosition,
            fov: 35, // Smaller FOV for less perspective distortion
            near: 0.1,
            far: 1000,
          }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          dpr={[1, 2]} // Device pixel ratio for crisp rendering
        >
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[8, 10, 5]}
            intensity={1.2}
            castShadow={false}
          />
          {/* Add fill light to reduce harsh shadows */}
          <directionalLight position={[-3, 2, -2]} intensity={0.3} />

          <RoomModel onReady={() => setLoaded(true)} />

          <Environment preset="sunset" />
          <CameraController
            cameraType="perspective"
            initialPosition={initialCameraPosition}
            initialRotation={initialCameraRotation}
            onCameraChange={handleCameraChange}
          />
        </Canvas>
      </div>

      {/* Navigation buttons */}
      <StudentDashboardNavigation />
    </>
  );
}
