"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, Sky } from "@react-three/drei";
import ModelRenderer from "@/components/StudentDashboardComponents/ModelRenderer";
import CameraController from "@/components/StudentDashboardComponents/CameraController";
import CameraDebugger from "@/components/StudentDashboardComponents/CameraDebugger";
import StudentNavigation from "@/components/StudentDashboardComponents/StudentNavigation";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
  const [_currentPathIndex, setCurrentPathIndex] = useState<number>(0);

  // Camera Debugger
  const [_cameraPositionDebug, setCameraPositionDebug] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [_cameraRotationDebug, setCameraRotationDebug] = useState<
    [number, number, number]
  >([0, 0, 0]);

  const [cameraPosition, setCameraPosition] = useState<
    [number, number, number]
  >([-0.01, 5.29, 80.65]);
  const [cameraRotation, setCameraRotation] = useState<
    [number, number, number]
  >([
    (173.26 * Math.PI) / 180,
    (-1.94 * Math.PI) / 180,
    (179.77 * Math.PI) / 180,
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

      // Helper function to add smooth animation step
      const addSmoothAnimationStep = (
        targetPos: [number, number, number],
        targetRot: [number, number, number],
        duration: number = 0.8,
        ease: string = "power1.inOut"
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
          ease: ease,
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
            ease: ease,
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

      const currentStationFromTo = stations[currentStationIndex].fromTo;
      const targetStationFromTo = stations[nextStationIndex].fromTo;

      // Calculate total distance to determine if this is a long jump
      const stationDistance = Math.abs(nextStationIndex - currentStationIndex);
      const isLongJump = stationDistance > 1;

      // Step 1: Go to current station's fromTo path point (slower start)
      addSmoothAnimationStep(
        path[currentStationFromTo].position,
        path[currentStationFromTo].rotation,
        isLongJump ? 1.0 : 1.2,
        "power2.out"
      );

      // Step 2: Smooth traversal through intermediate path points
      if (nextStationIndex > currentStationIndex) {
        // Moving forward: traverse path points from current to target
        for (
          let pathIndex = currentStationFromTo + 1;
          pathIndex <= targetStationFromTo;
          pathIndex++
        ) {
          if (pathIndex < path.length) {
            // Use faster, smoother transitions for intermediate points
            const isLastPoint = pathIndex === targetStationFromTo;
            addSmoothAnimationStep(
              path[pathIndex].position,
              path[pathIndex].rotation,
              isLongJump ? (isLastPoint ? 0.8 : 0.5) : 0.8,
              isLongJump ? "none" : "power1.inOut"
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
            // Use faster, smoother transitions for intermediate points
            const isLastPoint = pathIndex === targetStationFromTo;
            addSmoothAnimationStep(
              path[pathIndex].position,
              path[pathIndex].rotation,
              isLongJump ? (isLastPoint ? 0.8 : 0.5) : 0.8,
              isLongJump ? "none" : "power1.inOut"
            );
          }
        }
      }

      // Step 3: Go to target station's fromTo path point (if not already there)
      if (targetStationFromTo !== currentStationFromTo) {
        addSmoothAnimationStep(
          path[targetStationFromTo].position,
          path[targetStationFromTo].rotation,
          isLongJump ? 0.6 : 0.8,
          "power1.inOut"
        );
      }

      // Step 4: Finally, go to the target station (slower end)
      tl.to(cameraPositionRef.current, {
        duration: isLongJump ? 1.2 : 1.5,
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
          duration: isLongJump ? 1.2 : 1.5,
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
  }, [nextStationIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const [inputStationIndex, _setInputStationIndex] = useState<number>(0);

  const _handleNext = () => {
    if (nextStationIndex < stations.length - 1) {
      setNextStationIndex(nextStationIndex + 1);
    }
  };

  const _handlePrev = () => {
    if (nextStationIndex > 0) {
      setNextStationIndex(nextStationIndex - 1);
    }
  };

  const _handleSubmitStation = () => {
    if (
      inputStationIndex >= 0 &&
      inputStationIndex < stations.length &&
      inputStationIndex !== nextStationIndex
    ) {
      setNextStationIndex(inputStationIndex);
    }
  };

  return (
    <>
      {/* 3D Canvas Background */}
      <div className="fixed inset-0 w-screen h-screen">
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
          <directionalLight position={[-3, 2, -2]} intensity={0.3} />

          <Sky
            distance={450000}
            sunPosition={[100, 20, 100]}
            inclination={0}
            azimuth={0.25}
          />

          <ModelRenderer />
          <Environment preset="sunset" />

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

      <div className="absolute top-0 left-0 flex h-screen w-screen">
        {/* Sidebar - fixed height, full screen */}
        <div className="flex-1 h-screen left-0 top-0 p-6">
          <StudentNavigation />
        </div>

        {/* Main content area - pushes itself to the right */}
        <div className="flex-4 h-screen overflow-x-auto p-6">{children}</div>
      </div>

      {/* Page Content */}

      {/* AI Tutor Button */}
      {/* <div className="fixed bottom-6 right-6 z-50">
        <button className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group border-2 border-purple-400/30 backdrop-blur-sm">
          <div className="relative">
            <svg
              className="w-8 h-8 text-white group-hover:text-purple-200 transition-colors duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </button>
      </div> */}

      {/* Station Control (for debugging) */}
      {/* <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50">
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
        <div className="bg-black bg-opacity-50 p-2 rounded text-white text-sm text-center mt-2">
          Current: Station {nextStationIndex}
        </div>
      </div> */}
    </>
  );
}
