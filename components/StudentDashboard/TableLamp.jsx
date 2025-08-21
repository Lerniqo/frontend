import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function TableLamp(props) {
  const [hovered, setHovered] = useState(null);

  const lampRef = useRef();
  const originalScaleOfLampRef = useRef([1, 1, 1]);

  // Save original scale after mount
  useEffect(() => {
    if (lampRef.current) {
      originalScaleOfLampRef.current = lampRef.current.scale.toArray();
    }
  }, []);

  // Assign materials
  useEffect(() => {
    const { Lamp } = props.nodes;
    Lamp.children[0].material = new THREE.MeshToonMaterial({
      color: "#0d9488", // teal-600 to match navigation
    });
    Lamp.children[1].material = new THREE.MeshToonMaterial({ color: "black" }); // outline
    Lamp.children[2].material = new THREE.MeshToonMaterial({
      color: "#06b6d4", // cyan-500 for lamp shade, complementing teal
    }); // outline
  }, [props.nodes]);

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        gsap.to(lampRef.current.scale, {
          x: originalScaleOfLampRef.current[0] * 1.04,
          y: originalScaleOfLampRef.current[1] * 1.04,
          z: originalScaleOfLampRef.current[2] * 1.04,
          duration: 0.3,
        });
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(null);
        gsap.to(lampRef.current.scale, {
          x: originalScaleOfLampRef.current[0],
          y: originalScaleOfLampRef.current[1],
          z: originalScaleOfLampRef.current[2],
          duration: 0.3,
        });
      }}
    >
      <mesh
        position={[1.6, 2.7, -1.5]} // x, y, z
        rotation={[0, 0, 0]} // rotation in radians: [xRot, yRot, zRot]
        scale={[0.8, 1.35, 0.5]} // xScale, yScale, zScale
      >
        <boxGeometry />
        <meshStandardMaterial color="orange" transparent opacity={0} />
      </mesh>
      <primitive ref={lampRef} object={props.nodes.Lamp} />
    </group>
  );
}
