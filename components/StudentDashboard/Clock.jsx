import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function Clock(props) {
  const [hovered, setHovered] = useState(null);

  const clockRef = useRef();
  const originalScaleOfClockRef = useRef([1, 1, 1]);

  // Save original scale after mount
  useEffect(() => {
    if (clockRef.current) {
      originalScaleOfClockRef.current = clockRef.current.scale.toArray();
    }
  }, []);

  // Assign materials
  useEffect(() => {
    const { Clock } = props.nodes;
    Clock.children[0].material = new THREE.MeshToonMaterial({
      color: "#00FF7B",
    });
    Clock.children[1].material = new THREE.MeshToonMaterial({
      color: "black",
    });
  }, [props.nodes]);

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        gsap.to(clockRef.current.scale, {
          x: originalScaleOfClockRef.current[0] * 1.04,
          y: originalScaleOfClockRef.current[1] * 1.04,
          z: originalScaleOfClockRef.current[2] * 1.04,
          duration: 0.3,
        });
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(null);
        gsap.to(clockRef.current.scale, {
          x: originalScaleOfClockRef.current[0],
          y: originalScaleOfClockRef.current[1],
          z: originalScaleOfClockRef.current[2],
          duration: 0.3,
        });
      }}
    >
      <primitive ref={clockRef} object={props.nodes.Clock} />
    </group>
  );
}
