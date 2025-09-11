"use client";

import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";

interface CameraDebuggerProps {
  showUI?: boolean;
  logToConsole?: boolean;
  setCameraPosition: (pos: [number, number, number]) => void;
  setCameraRotation: (rot: [number, number, number]) => void;
}

function CameraDebuggerInner({
  showUI = true,
  logToConsole = true,
  setCameraPosition,
  setCameraRotation,
}: CameraDebuggerProps) {
  const { camera } = useThree();
  const [_position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [_rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    const updateCameraData = () => {
      // Get position
      const pos = camera.position;
      setPosition([pos.x, pos.y, pos.z]);
      setCameraPosition([pos.x, pos.y, pos.z]);

      // Get rotation (in radians, convert to degrees for display)
      const rot = camera.rotation;
      setRotation([
        (rot.x * 180) / Math.PI,
        (rot.y * 180) / Math.PI,
        (rot.z * 180) / Math.PI,
      ]);
      setCameraRotation([
        (rot.x * 180) / Math.PI,
        (rot.y * 180) / Math.PI,
        (rot.z * 180) / Math.PI,
      ]);
    };

    // const handleKeyPress = (event: KeyboardEvent) => {
    //   if (event.key.toLowerCase() === "j") {
    //     // J key to log camera position
    //     event.preventDefault(); // Prevent other handlers
    //     updateCameraData();
    //     if (logToConsole) {
    //       console.log("=== CAMERA DEBUG LOG ===");
    //       console.log("Position:", {
    //         x: camera.position.x,
    //         y: camera.position.y,
    //         z: camera.position.z,
    //       });
    //       console.log("Rotation (degrees):", {
    //         x: (camera.rotation.x * 180) / Math.PI,
    //         y: (camera.rotation.y * 180) / Math.PI,
    //         z: (camera.rotation.z * 180) / Math.PI,
    //       });
    //       console.log("Rotation (radians):", {
    //         x: camera.rotation.x,
    //         y: camera.rotation.y,
    //         z: camera.rotation.z,
    //       });
    //       console.log("========================");
    //     }
    //   }
    // };

    // Auto-update camera data every 100ms when showUI is enabled
    let _interval: NodeJS.Timeout | null = null;
    if (showUI) {
      updateCameraData(); // Initial update
      _interval = setInterval(updateCameraData, 100);
    }

    // // Use keyup instead of keydown to avoid conflicts
    // window.addEventListener("keyup", handleKeyPress);

    // return () => {
    //   window.removeEventListener("keyup", handleKeyPress);
    //   if (interval) clearInterval(interval);
    // };
  }, [camera, logToConsole, showUI, setCameraPosition, setCameraRotation]);

  useEffect(() => {
    if (logToConsole) {
      console.warn("=== CAMERA DEBUGGER LOADED ===");
      console.warn("Camera object available via useThree hook");
      console.warn("- Press 'J' key to log current camera state");
      console.warn("================================");
    }
  }, [logToConsole]);

  if (!showUI) return null;

  const _formatNumber = (num: number): string => {
    return num.toFixed(3);
  };

  return (
    <Html position={[0, 0, 0]} style={{ pointerEvents: "none" }}>
      <div className="fixed top-4 left-4 bg-black/90 text-white p-4 rounded-lg font-mono text-sm z-50 border border-gray-700 shadow-lg">
        {/* <div className="mb-2">
          <h3 className="text-green-400 font-bold mb-1">Camera Debugger</h3>
          <div className="text-xs text-green-500">Status: Connected</div>
        </div>

        <div className="space-y-2">
          <div>
            <div className="text-blue-400 font-semibold">Position:</div>
            <div className="ml-2 grid grid-cols-3 gap-2 text-xs">
              <div>
                X:{" "}
                <span className="text-yellow-300">
                  {formatNumber(position[0])}
                </span>
              </div>
              <div>
                Y:{" "}
                <span className="text-yellow-300">
                  {formatNumber(position[1])}
                </span>
              </div>
              <div>
                Z:{" "}
                <span className="text-yellow-300">
                  {formatNumber(position[2])}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-purple-400 font-semibold">Rotation (°):</div>
            <div className="ml-2 grid grid-cols-3 gap-2 text-xs">
              <div>
                X:{" "}
                <span className="text-yellow-300">
                  {formatNumber(rotation[0])}
                </span>
              </div>
              <div>
                Y:{" "}
                <span className="text-yellow-300">
                  {formatNumber(rotation[1])}
                </span>
              </div>
              <div>
                Z:{" "}
                <span className="text-yellow-300">
                  {formatNumber(rotation[2])}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-600 text-xs text-gray-400">
          <div>Press 'J' key to log to console</div>
          <div>Auto-updating every 100ms</div>
        </div> */}
      </div>
    </Html>
  );
}

export default function CameraDebugger({
  setCameraPosition,
  setCameraRotation,
}: {
  setCameraPosition: (pos: [number, number, number]) => void;
  setCameraRotation: (rot: [number, number, number]) => void;
}) {
  // This wrapper allows the component to be used both inside and outside Canvas
  return (
    <CameraDebuggerInner
      setCameraPosition={setCameraPosition}
      setCameraRotation={setCameraRotation}
    />
  );
}
