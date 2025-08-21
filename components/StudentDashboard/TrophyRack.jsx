import { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { ChevronRight } from "lucide-react";

import RadioCard from "../StudentDashboardHoverCards/radioCard";

export default function TrophyRack(props) {
  const { size } = useThree();

  const [hovered, setHovered] = useState(null);

  const trophyRackRef = useRef();
  const originalScaleOfTrophyRackRef = useRef([1, 1, 1]);

  // // Save original scale after mount
  useEffect(() => {
    if (trophyRackRef.current) {
      originalScaleOfTrophyRackRef.current =
        trophyRackRef.current.scale.toArray();
    }
  }, []);

  // Assign materials
  useEffect(() => {
    const { Trophy_Rack } = props.nodes;
    Trophy_Rack.children[0].material = new THREE.MeshToonMaterial({
      color: "#FFCE71",
    });
    Trophy_Rack.children[1].material = new THREE.MeshToonMaterial({
      color: "black",
    });

    // Create gold shining material with mixed colors
    Trophy_Rack.children[2].material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#FFD700"), // Base gold color
      metalness: 0.9, // High metalness for shiny effect
      roughness: 0.1, // Low roughness for reflective surface
      emissive: new THREE.Color("#FFA500").multiplyScalar(0.1), // Slight orange glow
      emissiveIntensity: 0.2,
    });
    Trophy_Rack.children[3].material = new THREE.MeshToonMaterial({
      color: "#434343",
    });
  }, [props.nodes]);

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

  return (
    <group
      onPointerOver={(e) => {
        setHovered(true);
        e.stopPropagation();
        gsap.to(trophyRackRef.current.scale, {
          x: originalScaleOfTrophyRackRef.current[0] * 1.05,
          y: originalScaleOfTrophyRackRef.current[1] * 1.05,
          z: originalScaleOfTrophyRackRef.current[2] * 1.05,
          duration: 0.3,
        });
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        gsap.to(trophyRackRef.current.scale, {
          x: originalScaleOfTrophyRackRef.current[0],
          y: originalScaleOfTrophyRackRef.current[1],
          z: originalScaleOfTrophyRackRef.current[2],
          duration: 0.3,
        });
      }}
    >
      <mesh
        position={[-3.2, 3.95, -2]} // x, y, z
        rotation={[0, 0, 0]} // rotation in radians: [xRot, yRot, zRot]
        scale={[1, 1, 1]} // xScale, yScale, zScale
      >
        <boxGeometry />
        <meshStandardMaterial color="orange" transparent opacity={0} />
      </mesh>
      <primitive ref={trophyRackRef} object={props.nodes.Trophy_Rack}>
        {/* Banner using HTML */}

        <Html
          position={[0, 8, 1]} // adjust Y to appear below the radio
          style={{
            background: "rgba(0,0,0,0)",
            padding: "2px 8px",
            borderRadius: "4px",
            color: "white",
            fontSize: "12px",
            whiteSpace: "nowrap",
          }}
        >
          <button
            onClick={() => router.push("/LessonLibrary")}
            className="bg-white hover:bg-gray-50 text-xl rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-green-400 hover:border-blue-400 backdrop-blur-sm"
            style={responsiveButtonStyles}
          >
            <span className="font-semibold bg-gradient-to-r from-green-600 via-blue-500 to-green-500 bg-clip-text text-transparent flex items-center gap-2">
              See Achivements
              <ChevronRight size={20} className="text-green-500" />
            </span>
          </button>
        </Html>
      </primitive>
    </group>
  );
}
