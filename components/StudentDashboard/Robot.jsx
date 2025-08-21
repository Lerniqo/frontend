import { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useThree } from "@react-three/fiber";
import { ChevronRight } from "lucide-react";

import { Html } from "@react-three/drei";

export default function Robot(props) {
  const [hovered, setHovered] = useState(null);
  const router = useRouter();

  // Get canvas size from Three.js context
  const { size } = useThree();

  const robotRef = useRef();
  const originalScaleOfrobotRef = useRef([1, 1, 1]);

  // console.log("Robot nodes:", props.nodes.Robot);

  //   Calculate responsive styling based on canvas size
  const responsiveButtonStyles = useMemo(() => {
    if (!size) return {};

    const { width, height } = size;
    const baseWidth = 1920; // Base design width
    const baseHeight = 1080; // Base design height

    // Calculate scale factors
    const widthScale = width / baseWidth;
    const heightScale = height / baseHeight;
    const scale = Math.min(widthScale, heightScale, 1.2); // Cap maximum scale

    // Ensure minimum scale for readability
    const finalScale = Math.max(scale, 0.7);

    // Calculate responsive sizing based on canvas size
    let buttonPadding = "1.5rem 1.5rem"; // default px-6 py-3
    let fontSize = "1.375rem"; // default text-xl (increased from 1.125rem)

    if (width < 768) {
      buttonPadding = "1rem 1.25rem"; // smaller padding for mobile
      fontSize = "1.25rem"; // mobile font size (increased from 1rem)
    } else if (width < 1024) {
      buttonPadding = "1.25rem 1.5rem"; // medium padding for tablet
      fontSize = "1.313rem"; // tablet font size (increased from 1.063rem)
    } else if (width >= 1920) {
      buttonPadding = "1.75rem 2rem"; // larger padding for large screens
      fontSize = "1.5rem"; // large screen font size (increased from 1.25rem)
    }

    return {
      transform: `scale(${finalScale})`,
      transformOrigin: "center center",
      padding: buttonPadding,
      fontSize: fontSize,
    };
  }, [size]);

  //   Save original scale after mount
  useEffect(() => {
    if (robotRef.current) {
      originalScaleOfrobotRef.current = robotRef.current.scale.toArray();
    }
  }, []);

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();

        setHovered(true);
        gsap.to(robotRef.current.scale, {
          x: originalScaleOfrobotRef.current[0] * 1.05,
          y: originalScaleOfrobotRef.current[1] * 1.05,
          z: originalScaleOfrobotRef.current[2] * 1.05,
          duration: 0.3,
        });
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        gsap.to(robotRef.current.scale, {
          x: originalScaleOfrobotRef.current[0],
          y: originalScaleOfrobotRef.current[1],
          z: originalScaleOfrobotRef.current[2],
          duration: 0.3,
        });
      }}
      onClick={() => {
        // setShowLessonLibraryButton(!showLessonLibraryButton);
      }}
    >
      {/* <mesh
        position={[2.1, 3.95, -2.0250353813171387]} // x, y, z
        rotation={[0, 0, 0]} // rotation in radians: [xRot, yRot, zRot]
        scale={[2.2, 1, 0.5]} // xScale, yScale, zScale
      >
        <boxGeometry />
        <meshStandardMaterial color="orange" transparent opacity={0} />
      </mesh> */}
      <primitive ref={robotRef} object={props.nodes.Robot}>
        <Html
          position={[-2.5, 0, 0]} // adjust Y to appear below the radio
          style={{
            background: "rgba(0,0,0,0)",
            padding: "0",
            borderRadius: "0",
            color: "white",
            fontSize: "12px",
            whiteSpace: "nowrap",
          }}
        >
          <div className="relative">
            {/* Speech bubble tail pointing to the robot */}
            {/* <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-b-[10px] border-r-[12px] border-t-transparent border-b-transparent border-r-white"></div> */}

            <button
              onClick={() => router.push("/LessonLibrary")}
              className="relative bg-white hover:bg-gray-50 text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-green-400 hover:border-blue-400 backdrop-blur-sm overflow-hidden"
              style={{
                ...responsiveButtonStyles,
                borderRadius: "20px",
              }}
            >
              <span className="font-semibold bg-gradient-to-r from-green-600 via-blue-500 to-green-500 bg-clip-text text-transparent flex flex-col items-center gap-1 relative z-10">
                <p className="text-2xl">Hii 👋</p>
                <div className="flex items-center gap-2">
                  <p>Ask me anything.</p>
                  {/* <ChevronRight size={20} className="text-green-500" /> */}
                </div>
              </span>

              {/* Subtle bubble pattern background */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-2 right-3 w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="absolute bottom-3 left-4 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-green-500 rounded-full"></div>
              </div>
            </button>
          </div>
        </Html>
      </primitive>
    </group>
  );
}
