import { Html } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

import RadioCard from "../StudentDashboardHoverCards/radioCard";

export default function Radio(props) {
  const [hovered, setHovered] = useState(false);
  const [hoveredToCard, setHoveredToCard] = useState(false);

  const radioRef = useRef();
  const originalScaleOfradioRef = useRef([1, 1, 1]);

  // Get canvas size from Three.js context
  const { size } = useThree();

  // Save original scale after mount
  useEffect(() => {
    if (radioRef.current) {
      originalScaleOfradioRef.current = radioRef.current.scale.toArray();
    }
  }, []);

  // Assign materials
  useEffect(() => {
    const { Radio } = props.nodes;
    Radio.children[0].material = new THREE.MeshToonMaterial({
      color: "#C88046",
    });
    Radio.children[1].material = new THREE.MeshToonMaterial({ color: "black" });
    Radio.children[2].material = new THREE.MeshToonMaterial({
      color: "#2D2D2D",
    });
    Radio.children[3].material = new THREE.MeshToonMaterial({
      color: "#2F2C2D",
    });
    Radio.children[4].material = new THREE.MeshToonMaterial({
      color: "#66655F",
    });
  }, [props.nodes]);

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        gsap.to(radioRef.current.scale, {
          x: originalScaleOfradioRef.current[0] * 1.05,
          y: originalScaleOfradioRef.current[1] * 1.05,
          z: originalScaleOfradioRef.current[2] * 1.05,
          duration: 0.3,
        });
      }}
      onPointerOut={(e) => {
        e.stopPropagation();

        setHovered(false);

        gsap.to(radioRef.current.scale, {
          x: originalScaleOfradioRef.current[0],
          y: originalScaleOfradioRef.current[1],
          z: originalScaleOfradioRef.current[2],
          duration: 0.3,
        });
      }}
      onClick={() => {
        setHoveredToCard(!hoveredToCard);
      }}
    >
      <mesh
        position={[2.8, 2.4, -1]} // x, y, z
        rotation={[0, 0.6, 0]} // rotation in radians: [xRot, yRot, zRot]
        scale={[0.7, 0.6, 1]} // xScale, yScale, zScale
      >
        <boxGeometry />
        <meshStandardMaterial color="orange" transparent opacity={0} />
      </mesh>
      <primitive ref={radioRef} object={props.nodes.Radio}>
        {/* Banner using HTML */}
        {(hovered || hoveredToCard) && (
          <Html
            position={[0, -3, 0]} // adjust Y to appear below the radio
            center
            style={{
              background: "rgba(0,0,0,0)",
              padding: "4px 8px",
              borderRadius: "4px",
              color: "white",
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            <RadioCard
              onClose={() => setHoveredToCard(false)}
              canvasSize={size}
            />
          </Html>
        )}
      </primitive>
    </group>
  );
}
