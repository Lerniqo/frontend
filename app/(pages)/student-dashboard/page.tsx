"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import ModelRenderer from "@/components/StudentDashboardComponents/ModelRenderer";
import KeyboardCameraControls from "@/components/StudentDashboardComponents/KeyboardCameraControls";
import DashboardButtons from "@/components/StudentDashboardComponents/DashboardButtons";
import CameraDebugger from "@/components/StudentDashboardComponents/CameraDebugger";
import { cameraPosition } from "three/tsl";
import { useState } from "react";

export default function StudentDashboardPage() {
  // Camera Debugger
  const [cameraPosition, setCameraPosition] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [cameraRotation, setCameraRotation] = useState<
    [number, number, number]
  >([0, 0, 0]);

  return (
    <>
      <div className="w-screen h-screen">
        <Canvas camera={{ fov: 90, position: [0, 5, 10], near: 0.1, far: 100 }}>
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[8, 10, 5]}
            intensity={1.2}
            castShadow={false}
          />
          {/* Add fill light to reduce harsh shadows */}
          <directionalLight position={[-3, 2, -2]} intensity={0.3} />
          <ModelRenderer />
          <Environment preset="sunset" />
          {/* Controls */}
          {/* <OrbitControls
            enableDamping
            dampingFactor={0.12}
            target={[0, 1, 0]}
            maxPolarAngle={Math.PI * 0.9}
          /> */}
          <KeyboardCameraControls />
          <CameraDebugger
            setCameraPosition={setCameraPosition}
            setCameraRotation={setCameraRotation}
          />
        </Canvas>
      </div>
      <DashboardButtons />
      <div>
        <p className="fixed bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 p-2 rounded-md font-mono">
          Pos:{" "}
          {`X: ${cameraPosition[0].toFixed(2)} Y: ${cameraPosition[1].toFixed(
            2
          )} Z: ${cameraPosition[2].toFixed(2)}`}{" "}
          <br />
          Rot:{" "}
          {`X: ${cameraRotation[0].toFixed(2)} Y: ${cameraRotation[1].toFixed(
            2
          )} Z: ${cameraRotation[2].toFixed(2)}`}
        </p>
      </div>
      {/* <div>
        <button onClick={handleNext} >Next</button>
        <button onClick={handlePrevious} >Previous</button>
      </div> */}
    </>
  );
}
