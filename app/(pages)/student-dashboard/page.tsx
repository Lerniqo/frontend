"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, Sky } from "@react-three/drei";
import ModelRenderer from "@/components/StudentDashboardComponents/ModelRenderer";
// import KeyboardCameraControls from "@/components/StudentDashboardComponents/KeyboardCameraControls";
import DashboardButtons from "@/components/StudentDashboardComponents/DashboardButtons";
import CameraDebugger from "@/components/StudentDashboardComponents/CameraDebugger";
import { useState, useRef, useEffect } from "react";
import CameraController from "@/components/StudentDashboardComponents/CameraController";
import { gsap } from "gsap";

export default function StudentDashboardPage() {
  const stations: {
    id: number;
    position: [number, number, number];
    rotation: [number, number, number];
    fromTo: number;
  }[] = [
    {
      id: 0,
      position: [-0.01, 5.29, 80.65],
      rotation: [
        (173.26 * Math.PI) / 180,
        (-1.94 * Math.PI) / 180,
        (179.77 * Math.PI) / 180,
      ],
      fromTo: 0,
    },
    {
      id: 1,
      position: [0.59, 5.81, 114.55],
      rotation: [
        (167.53 * Math.PI) / 180,
        (0.37 * Math.PI) / 180,
        (-179.92 * Math.PI) / 180,
      ],
      fromTo: 0,
    },
    {
      id: 2,
      position: [-4.58, 3.29, 136.52],
      rotation: [
        (172.25 * Math.PI) / 180,
        (15.85 * Math.PI) / 180,
        (177.87 * Math.PI) / 180,
      ],
      fromTo: 1,
    },
    {
      id: 3,
      position: [-5.19, 4.72, 194.41],
      rotation: [
        (161.62 * Math.PI) / 180,
        (59.64 * Math.PI) / 180,
        (-164.0 * Math.PI) / 180,
      ],
      fromTo: 2,
    },
    {
      id: 4,
      position: [-5.19, 4.85, 240.83],
      rotation: [
        (172.76 * Math.PI) / 180,
        (41.11 * Math.PI) / 180,
        (-175.23 * Math.PI) / 180,
      ],
      fromTo: 3,
    },
    {
      id: 5,
      position: [8.62, 7.88, 260.42],
      rotation: [
        (177.89 * Math.PI) / 180,
        (-35.13 * Math.PI) / 180,
        (178.79 * Math.PI) / 180,
      ],
      fromTo: 4,
    },
    {
      id: 6,
      position: [7.82, 7.98, 303.73],
      rotation: [
        (169.62 * Math.PI) / 180,
        (-20.08 * Math.PI) / 180,
        (176.4 * Math.PI) / 180,
      ],
      fromTo: 5,
    },
    {
      id: 7,
      position: [-7.7, 6.44, 351.64],
      rotation: [
        (174.2 * Math.PI) / 180,
        (27.04 * Math.PI) / 180,
        (-177.36 * Math.PI) / 180,
      ],
      fromTo: 6,
    },
    {
      id: 8,
      position: [-11.09, 6.44, 391.43],
      rotation: [
        (-176.47 * Math.PI) / 180,
        (21.25 * Math.PI) / 180,
        (178.72 * Math.PI) / 180,
      ],
      fromTo: 7,
    },
    {
      id: 9,
      position: [1.93, 4.71, 418.98],
      rotation: [
        (176.66 * Math.PI) / 180,
        (-19.22 * Math.PI) / 180,
        (178.9 * Math.PI) / 180,
      ],
      fromTo: 8,
    },
    {
      id: 10,
      position: [-3.86, 3.02, 427.15],
      rotation: [
        (-178.67 * Math.PI) / 180,
        (31.17 * Math.PI) / 180,
        (179.31 * Math.PI) / 180,
      ],
      fromTo: 9,
    },
    {
      id: 11,
      position: [2.64, 5.69, 434.89],
      rotation: [
        (178.19 * Math.PI) / 180,
        (-17.38 * Math.PI) / 180,
        (179.46 * Math.PI) / 180,
      ],
      fromTo: 10,
    },
    {
      id: 12,
      position: [0.54, 7.81, 449.86],
      rotation: [
        (160.28 * Math.PI) / 180,
        (16.19 * Math.PI) / 180,
        (-174.29 * Math.PI) / 180,
      ],
      fromTo: 11,
    },
    {
      id: 13,
      position: [-20.5, 3.88, 455.43],
      rotation: [
        (174.66 * Math.PI) / 180,
        (20.06 * Math.PI) / 180,
        (-178.16 * Math.PI) / 180,
      ],
      fromTo: 12,
    },
    {
      id: 14,
      position: [-46.36, 2.67, 453.93],
      rotation: [
        (26.12 * Math.PI) / 180,
        (6.69 * Math.PI) / 180,
        (-3.27 * Math.PI) / 180,
      ],
      fromTo: 13,
    },
  ];

  const path: {
    id: number;
    position: [number, number, number];
    rotation: [number, number, number];
  }[] = [
    {
      id: 0,
      position: [0.41, 5.17, 104.85],
      rotation: [
        (174.7 * Math.PI) / 180,
        (-0.91 * Math.PI) / 180,
        (179.92 * Math.PI) / 180,
      ],
    },
    {
      id: 1,
      position: [-0.03, 5.29, 130.77],
      rotation: [
        (174.98 * Math.PI) / 180,
        (0.62 * Math.PI) / 180,
        (-179.95 * Math.PI) / 180,
      ],
    },
    {
      id: 2,
      position: [-0.02, 4.72, 191.28],
      rotation: [
        (-176.26 * Math.PI) / 180,
        (5.91 * Math.PI) / 180,
        (179.61 * Math.PI) / 180,
      ],
    },
    {
      id: 3,
      position: [0.7, 3.53, 239.54],
      rotation: [
        (178.28 * Math.PI) / 180,
        (0.23 * Math.PI) / 180,
        (-179.99 * Math.PI) / 180,
      ],
    },
    {
      id: 4,
      position: [0.13, 6.61, 262.15],
      rotation: [
        (175.98 * Math.PI) / 180,
        (-1.05 * Math.PI) / 180,
        (179.93 * Math.PI) / 180,
      ],
    },
    {
      id: 5,
      position: [0.77, 7.98, 303.63],
      rotation: [
        (178.42 * Math.PI) / 180,
        (4.53 * Math.PI) / 180,
        (-179.87 * Math.PI) / 180,
      ],
    },
    {
      id: 6,
      position: [1.19, 7.98, 350.82],
      rotation: [
        (178.28 * Math.PI) / 180,
        (2.81 * Math.PI) / 180,
        (-179.92 * Math.PI) / 180,
      ],
    },
    {
      id: 7,
      position: [0.32, 6.44, 388.67],
      rotation: [
        (156.35 * Math.PI) / 180,
        (2.05 * Math.PI) / 180,
        (-179.1 * Math.PI) / 180,
      ],
    },
    {
      id: 8,
      position: [0.42, 4.71, 418.98],
      rotation: [
        (-179.72 * Math.PI) / 180,
        (3.96 * Math.PI) / 180,
        (179.98 * Math.PI) / 180,
      ],
    },
    {
      id: 9,
      position: [-0.22, 4.71, 428.69],
      rotation: [
        (-178.28 * Math.PI) / 180,
        (1.24 * Math.PI) / 180,
        (179.96 * Math.PI) / 180,
      ],
    },
    {
      id: 10,
      position: [-0.22, 5.69, 434.56],
      rotation: [
        (-175.42 * Math.PI) / 180,
        (2.66 * Math.PI) / 180,
        (179.79 * Math.PI) / 180,
      ],
    },
    {
      id: 11,
      position: [-2.45, 2.67, 448.98],
      rotation: [
        (-178.62 * Math.PI) / 180,
        (34.17 * Math.PI) / 180,
        (179.22 * Math.PI) / 180,
      ],
    },
    {
      id: 12,
      position: [-19.68, 3.32, 453.48],
      rotation: [
        (129.46 * Math.PI) / 180,
        (86.47 * Math.PI) / 180,
        (-129.52 * Math.PI) / 180,
      ],
    },
    {
      id: 13,
      position: [-40.35, 2.67, 454.28],
      rotation: [
        (76.37 * Math.PI) / 180,
        (86.16 * Math.PI) / 180,
        (-76.34 * Math.PI) / 180,
      ],
    },
  ];

  const [currentStationIndex, setCurrentStationIndex] = useState<number>(0);
  const [nextStationIndex, setNextStationIndex] = useState<number>(0);
  const [currentPathIndex, setCurrentPathIndex] = useState<number>(0);

  // Camera Debugger
  const [cameraPositionDebug, setCameraPositionDebug] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [cameraRotationDebug, setCameraRotationDebug] = useState<
    [number, number, number]
  >([0, 0, 0]);

  const [cameraPosition, setCameraPosition] = useState<
    [number, number, number]
  >([-0.01, 5.29, 80.65]);
  const [cameraRotation, setCameraRotation] = useState<
    [number, number, number]
  >([
    (173.26 * Math.PI) / 180, // Convert degrees to radians
    (-1.94 * Math.PI) / 180, // Fixed: should be negative
    (179.77 * Math.PI) / 180, // Updated to match comment
  ]);

  // Create refs for GSAP animation
  const cameraPositionRef = useRef({ x: -0.01, y: 5.29, z: 80.65 });
  const cameraRotationRef = useRef({
    x: (173.26 * Math.PI) / 180,
    y: (-1.94 * Math.PI) / 180,
    z: (179.77 * Math.PI) / 180,
  });

  useEffect(() => {
    if (
      nextStationIndex !== currentStationIndex &&
      nextStationIndex >= 0 &&
      nextStationIndex < stations.length
    ) {
      // Create a timeline for sequential animations
      const tl = gsap.timeline();

      // Normalize rotation differences to prevent 360° spins
      const normalizeRotationDiff = (current: number, target: number) => {
        let diff = target - current;
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        return current + diff;
      };

      // Helper function to add animation step
      const addAnimationStep = (
        targetPos: [number, number, number],
        targetRot: [number, number, number],
        duration: number = 1.5
      ) => {
        const currentRot = cameraRotationRef.current;
        const normalizedRot = {
          x: normalizeRotationDiff(currentRot.x, targetRot[0]),
          y: normalizeRotationDiff(currentRot.y, targetRot[1]),
          z: normalizeRotationDiff(currentRot.z, targetRot[2]),
        };

        tl.to(cameraPositionRef.current, {
          duration: duration,
          x: targetPos[0],
          y: targetPos[1],
          z: targetPos[2],
          ease: "power2.inOut",
          onUpdate: () => {
            setCameraPosition([
              cameraPositionRef.current.x,
              cameraPositionRef.current.y,
              cameraPositionRef.current.z,
            ]);
          },
        }).to(
          cameraRotationRef.current,
          {
            duration: duration,
            x: normalizedRot.x,
            y: normalizedRot.y,
            z: normalizedRot.z,
            ease: "power2.inOut",
            onUpdate: () => {
              setCameraRotation([
                cameraRotationRef.current.x,
                cameraRotationRef.current.y,
                cameraRotationRef.current.z,
              ]);
            },
          },
          "<"
        );
      };

      // Step 1: Go to current station's fromTo path point
      const currentStationFromTo = stations[currentStationIndex].fromTo;
      addAnimationStep(
        path[currentStationFromTo].position,
        path[currentStationFromTo].rotation,
        1.2
      );

      // Step 2: If we need to traverse multiple path points between current and target
      const targetStationFromTo = stations[nextStationIndex].fromTo;

      if (nextStationIndex > currentStationIndex) {
        // Moving forward: traverse path points from current to target
        for (
          let pathIndex = currentStationFromTo + 1;
          pathIndex <= targetStationFromTo;
          pathIndex++
        ) {
          if (pathIndex < path.length) {
            addAnimationStep(
              path[pathIndex].position,
              path[pathIndex].rotation,
              1.0
            );
          }
        }
      } else {
        // Moving backward: traverse path points from current to target
        for (
          let pathIndex = currentStationFromTo - 1;
          pathIndex >= targetStationFromTo;
          pathIndex--
        ) {
          if (pathIndex >= 0) {
            addAnimationStep(
              path[pathIndex].position,
              path[pathIndex].rotation,
              1.0
            );
          }
        }
      }

      // Step 3: Go to target station's fromTo path point (if not already there)
      if (targetStationFromTo !== currentStationFromTo) {
        addAnimationStep(
          path[targetStationFromTo].position,
          path[targetStationFromTo].rotation,
          1.0
        );
      }

      // Step 4: Finally, go to the target station
      tl.to(cameraPositionRef.current, {
        duration: 1.5,
        x: stations[nextStationIndex].position[0],
        y: stations[nextStationIndex].position[1],
        z: stations[nextStationIndex].position[2],
        ease: "power2.inOut",
        onUpdate: () => {
          setCameraPosition([
            cameraPositionRef.current.x,
            cameraPositionRef.current.y,
            cameraPositionRef.current.z,
          ]);
        },
      }).to(
        cameraRotationRef.current,
        {
          duration: 1.5,
          x: normalizeRotationDiff(
            cameraRotationRef.current.x,
            stations[nextStationIndex].rotation[0]
          ),
          y: normalizeRotationDiff(
            cameraRotationRef.current.y,
            stations[nextStationIndex].rotation[1]
          ),
          z: normalizeRotationDiff(
            cameraRotationRef.current.z,
            stations[nextStationIndex].rotation[2]
          ),
          ease: "power2.inOut",
          onUpdate: () => {
            setCameraRotation([
              cameraRotationRef.current.x,
              cameraRotationRef.current.y,
              cameraRotationRef.current.z,
            ]);
          },
          onComplete: () => {
            setCurrentStationIndex(nextStationIndex);
            setCurrentPathIndex(stations[nextStationIndex].fromTo);
          },
        },
        "<"
      );
    }
  }, [nextStationIndex]);

  const [inputStationIndex, setInputStationIndex] = useState<number>(0);

  const handleNext = () => {
    if (nextStationIndex < stations.length - 1) {
      setNextStationIndex(nextStationIndex + 1);
    }
  };

  const handlePrev = () => {
    if (nextStationIndex > 0) {
      setNextStationIndex(nextStationIndex - 1);
    }
  };

  const handleSubmitStation = () => {
    if (
      inputStationIndex >= 0 &&
      inputStationIndex < stations.length &&
      inputStationIndex !== nextStationIndex
    ) {
      setNextStationIndex(inputStationIndex);
    }
  };

  // Pos: X: -0.01 Y: 5.29 Z: 80.65
  // Rot: X: 173.26 Y: -1.94 Z: 179.77

  return (
    <>
      <div className="w-screen h-screen">
        <Canvas
          camera={{
            fov: 80,
            near: 0.1,
            far: 1000,
          }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[8, 10, 5]}
            intensity={1.2}
            castShadow={false}
          />
          {/* Add fill light to reduce harsh shadows */}
          <directionalLight position={[-3, 2, -2]} intensity={0.3} />

          {/* Sky component for realistic sky */}
          <Sky
            distance={450000} // Camera distance (default: 450000)
            sunPosition={[100, 20, 100]} // Sun position in 3D space
            inclination={0} // Sun elevation (0 = horizon, 0.5 = top)
            azimuth={0.25} // Sun rotation around the Y axis (0-1)
          />

          <ModelRenderer />
          <Environment preset="sunset" />
          {/* Controls */}
          {/* <OrbitControls
            enableDamping
            dampingFactor={0.12}
            target={[0, 1, 0]}
            maxPolarAngle={Math.PI * 0.9}
          /> */}
          {/* <KeyboardCameraControls /> */}
          <CameraController
            cameraPosition={cameraPosition}
            cameraRotation={cameraRotation}
          />
          <CameraDebugger
            setCameraPosition={setCameraPositionDebug}
            setCameraRotation={setCameraRotationDebug}
          />
        </Canvas>
      </div>
      <DashboardButtons />
      <div>
        {/* <p className="fixed bottom-50 left-2 text-white text-sm bg-black bg-opacity-50 p-2 rounded-md font-mono">
          Pos:{" "}
          {`X: ${cameraPositionDebug[0].toFixed(
            2
          )} Y: ${cameraPositionDebug[1].toFixed(
            2
          )} Z: ${cameraPositionDebug[2].toFixed(2)}`}{" "}
          <br />
          Rot:{" "}
          {`X: ${cameraRotationDebug[0].toFixed(
            2
          )} Y: ${cameraRotationDebug[1].toFixed(
            2
          )} Z: ${cameraRotationDebug[2].toFixed(2)}`}
        </p> */}
      </div>

      <div className="absolute bottom-2 w-full flex justify-center items-center space-x-2">
        <div className="flex items-center space-x-2 bg-black bg-opacity-50 p-3 rounded-lg">
          <label className="text-white text-sm">Go to Station:</label>
          <select
            value={inputStationIndex}
            onChange={(e) => setInputStationIndex(Number(e.target.value))}
            className="bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            {stations.map((station, index) => (
              <option key={station.id} value={index}>
                Station {index}
              </option>
            ))}
          </select>
          <button
            onClick={handleSubmitStation}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded transition-colors"
            disabled={inputStationIndex === nextStationIndex}
          >
            Go
          </button>
        </div>
        <div className="bg-black bg-opacity-50 p-2 rounded text-white text-sm">
          Current: Station {nextStationIndex}
        </div>
      </div>
    </>
  );
}
