import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function Floor(props) {
  const [hovered, setHovered] = useState(null);

  const floorRef = useRef();
  const textureLoader = useRef(new THREE.TextureLoader());
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
    const { floor } = props.nodes;

    // Load floor texture
    const floorTexture = textureLoader.current.load(
      "/textures/tileTexture.jpg"
    );

    // Configure texture properties for tiling
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 4); // Adjust these values to control tiling

    // Create a textured floor material
    const floorMaterial = new THREE.MeshStandardMaterial({
      map: floorTexture, // Use texture instead of solid color
      roughness: 0.8, // Less shiny for realistic tile look
      metalness: 0.1, // Slight metallic reflection
    });

    floor.material = floorMaterial;
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
      <primitive ref={floorRef} object={props.nodes.floor} />
    </group>
  );
}
