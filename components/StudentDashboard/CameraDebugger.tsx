"use client";

import { useEffect, useState } from "react";

interface CameraDebuggerProps {
  showUI?: boolean;
  logToConsole?: boolean;
}

export default function CameraDebugger({
  showUI = false,
  logToConsole = true,
}: CameraDebuggerProps) {
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "c" && event.ctrlKey) {
        // Ctrl+C to log camera position
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).getCameraPosition) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cameraData = (window as any).getCameraPosition();
          setPosition(cameraData.position);
          setRotation(cameraData.rotation);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    if (logToConsole) {
      console.log("=== CAMERA DEBUGGER LOADED ===");
      console.log("Available global functions (after scene loads):");
      console.log(
        "- getCameraPosition() - Get current camera position and rotation"
      );
      console.log("- setCameraPosition(x, y, z) - Set camera position");
      console.log("- setCameraRotation(x, y, z) - Set camera rotation");
      console.log("- Press Ctrl+C to log current camera state");
      console.log("================================");
    }
  }, [logToConsole]);

  if (!showUI) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: 10,
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontFamily: "monospace",
        fontSize: "12px",
        zIndex: 1000,
        pointerEvents: "none",
      }}
    >
      <div>
        Position: [{position[0]}, {position[1]}, {position[2]}]
      </div>
      <div>
        Rotation: [{rotation[0]}, {rotation[1]}, {rotation[2]}]
      </div>
      <div style={{ marginTop: "5px", fontSize: "10px", opacity: 0.7 }}>
        Press Ctrl+C to update display
      </div>
    </div>
  );
}
