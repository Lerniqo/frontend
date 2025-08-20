"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

import RoomModel from "@/components/StudentDashboard/RoomModel";

export default function StudentDashboard() {
  return (
    <>
      {/* <div>
        <h1>This is the Student Dashboard</h1>
      </div> */}
      <div className="w-screen h-screen">
        <Canvas>
          {/* 3D content goes here */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />

          <RoomModel />

          <Environment preset="sunset" />
          <OrbitControls />
        </Canvas>
      </div>
    </>
  );
}
