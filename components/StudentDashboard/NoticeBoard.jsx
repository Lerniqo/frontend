import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function NoticeBoard(props) {
  const [hovered, setHovered] = useState(null);

  const noticeBoardRef = useRef();
  const originalScaleOfNoticeBoardRef = useRef([1, 1, 1]);

  // Save original scale after mount
  useEffect(() => {
    if (noticeBoardRef.current) {
      originalScaleOfNoticeBoardRef.current =
        noticeBoardRef.current.scale.toArray();
    }
  }, []);

  // Assign materials
  useEffect(() => {
    const { Notice_Board } = props.nodes;
    Notice_Board.children[0].material = new THREE.MeshToonMaterial({
      color: "#214B6E",
    });
    Notice_Board.children[1].material = new THREE.MeshToonMaterial({
      color: "#FFCE71",
    });
    Notice_Board.children[2].material = new THREE.MeshToonMaterial({
      color: "black",
    });
  }, [props.nodes]);

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        gsap.to(noticeBoardRef.current.scale, {
          x: originalScaleOfNoticeBoardRef.current[0] * 1.02,
          y: originalScaleOfNoticeBoardRef.current[1] * 1.02,
          z: originalScaleOfNoticeBoardRef.current[2] * 1.02,
          duration: 0.3,
        });
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(null);
        gsap.to(noticeBoardRef.current.scale, {
          x: originalScaleOfNoticeBoardRef.current[0],
          y: originalScaleOfNoticeBoardRef.current[1],
          z: originalScaleOfNoticeBoardRef.current[2],
          duration: 0.3,
        });
      }}
    >
      <primitive ref={noticeBoardRef} object={props.nodes.Notice_Board} />
    </group>
  );
}
