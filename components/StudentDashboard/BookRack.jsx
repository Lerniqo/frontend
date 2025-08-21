import { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useThree } from "@react-three/fiber";
import { ChevronRight } from "lucide-react";

import { Html } from "@react-three/drei";

export default function BookRack(props) {
  const [hovered, setHovered] = useState(null);
  const [showLessonLibraryButton, setShowLessonLibraryButton] = useState(false);
  const router = useRouter();

  // Get canvas size from Three.js context
  const { size } = useThree();

  const bookRackRef = useRef();
  // const lamp2Ref = useRef();
  // const lamp3Ref = useRef();
  const originalScaleOfbookRackRef = useRef([1, 1, 1]);
  // const originalScaleOflamp2Ref = useRef([1, 1, 1]);
  // const originalScaleOflamp3Ref = useRef([1, 1, 1]);

  console.log("BookRack nodes:", props.nodes);

  // Calculate responsive styling based on canvas size
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

  // Save original scale after mount
  useEffect(() => {
    if (bookRackRef.current) {
      originalScaleOfbookRackRef.current = bookRackRef.current.scale.toArray();
    }
  }, []);

  // Assign materials
  useEffect(() => {
    const { Book_rack } = props.nodes;
    Book_rack.children[0].material = new THREE.MeshToonMaterial({
      color: "#00810C",
    });
    Book_rack.children[1].material = new THREE.MeshToonMaterial({
      color: "black",
    });
    Book_rack.children[2].material = new THREE.MeshToonMaterial({
      color: "#986135",
    });
    Book_rack.children[3].material = new THREE.MeshToonMaterial({
      color: "#FFCE71",
    });
    Book_rack.children[4].material = new THREE.MeshToonMaterial({
      color: "#00A00F",
    });
    Book_rack.children[5].material = new THREE.MeshToonMaterial({
      color: "#FFFFFF",
    });
    Book_rack.children[6].material = new THREE.MeshToonMaterial({
      color: "#444143",
    });
    Book_rack.children[7].material = new THREE.MeshToonMaterial({
      color: "#05005A",
    });
    Book_rack.children[8].material = new THREE.MeshToonMaterial({
      color: "#96000E",
    });
  }, [props.nodes]);

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();

        setHovered(true);
        gsap.to(bookRackRef.current.scale, {
          x: originalScaleOfbookRackRef.current[0] * 1.05,
          y: originalScaleOfbookRackRef.current[1] * 1.05,
          z: originalScaleOfbookRackRef.current[2] * 1.05,
          duration: 0.3,
        });
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        gsap.to(bookRackRef.current.scale, {
          x: originalScaleOfbookRackRef.current[0],
          y: originalScaleOfbookRackRef.current[1],
          z: originalScaleOfbookRackRef.current[2],
          duration: 0.3,
        });
      }}
      onClick={() => {
        setShowLessonLibraryButton(!showLessonLibraryButton);
      }}
    >
      <mesh
        position={[2.1, 3.95, -2.0250353813171387]} // x, y, z
        rotation={[0, 0, 0]} // rotation in radians: [xRot, yRot, zRot]
        scale={[2.2, 1, 0.5]} // xScale, yScale, zScale
      >
        <boxGeometry />
        <meshStandardMaterial color="orange" transparent opacity={0} />
      </mesh>
      <primitive ref={bookRackRef} object={props.nodes.Book_rack}>
        <Html
          position={[-5, 0, 7]} // adjust Y to appear below the radio
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
              📚 Study Materials
              <ChevronRight size={20} className="text-green-500" />
            </span>
          </button>
        </Html>
      </primitive>
    </group>
  );
}
