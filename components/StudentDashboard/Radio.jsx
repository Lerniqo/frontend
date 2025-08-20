import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function Radio(props) {
  const [hovered, setHovered] = useState(null);

  const radioRef = useRef();
  // const lamp2Ref = useRef();
  // const lamp3Ref = useRef();
  // const originalScaleOflamp1Ref = useRef([1, 1, 1]);
  // const originalScaleOflamp2Ref = useRef([1, 1, 1]);
  // const originalScaleOflamp3Ref = useRef([1, 1, 1]);

  // // Save original scale after mount
  // useEffect(() => {
  //   if (lamp1Ref.current) {
  //     originalScaleOflamp1Ref.current = lamp1Ref.current.scale.toArray();
  //   }
  //   if (lamp2Ref.current) {
  //     originalScaleOflamp2Ref.current = lamp2Ref.current.scale.toArray();
  //   }
  //   if (lamp3Ref.current) {
  //     originalScaleOflamp3Ref.current = lamp3Ref.current.scale.toArray();
  //   }
  // }, []);

  // Assign materials
  useEffect(() => {
    const { Radio } = props.nodes;
    Radio.children[0].material = new THREE.MeshToonMaterial({
      color: "#C88046",
    });
    Radio.children[1].material = new THREE.MeshToonMaterial({
      color: "black",
    });
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
    // onPointerOver={(e) => {
    //   e.stopPropagation();
    //   if (!hovered) {
    //     setHovered("Study Materials");
    //     gsap.to(lamp1Ref.current.scale, {
    //       x: originalScaleOflamp1Ref.current[0] * 1.1,
    //       y: originalScaleOflamp1Ref.current[1] * 1.1,
    //       z: originalScaleOflamp1Ref.current[2] * 1.1,
    //       duration: 0.3,
    //     });
    //     gsap.to(lamp2Ref.current.scale, {
    //       x: originalScaleOflamp2Ref.current[0] * 1.1,
    //       y: originalScaleOflamp2Ref.current[1] * 1.1,
    //       z: originalScaleOflamp2Ref.current[2] * 1.1,
    //       duration: 0.3,
    //     });
    //     gsap.to(lamp3Ref.current.scale, {
    //       x: originalScaleOflamp3Ref.current[0] * 1.1,
    //       y: originalScaleOflamp3Ref.current[1] * 1.1,
    //       z: originalScaleOflamp3Ref.current[2] * 1.1,
    //       duration: 0.3,
    //     });
    //   }
    // }}
    // onPointerOut={(e) => {
    //   e.stopPropagation();
    //   setHovered(null);
    //   gsap.to(lamp1Ref.current.scale, {
    //     x: originalScaleOflamp1Ref.current[0],
    //     y: originalScaleOflamp1Ref.current[1],
    //     z: originalScaleOflamp1Ref.current[2],
    //     duration: 0.3,
    //   });
    //   gsap.to(lamp2Ref.current.scale, {
    //     x: originalScaleOflamp2Ref.current[0],
    //     y: originalScaleOflamp2Ref.current[1],
    //     z: originalScaleOflamp2Ref.current[2],
    //     duration: 0.3,
    //   });
    //   gsap.to(lamp3Ref.current.scale, {
    //     x: originalScaleOflamp3Ref.current[0],
    //     y: originalScaleOflamp3Ref.current[1],
    //     z: originalScaleOflamp3Ref.current[2],
    //     duration: 0.3,
    //   });
    // }}
    >
      <primitive ref={radioRef} object={props.nodes.Radio} />
    </group>
  );
}
