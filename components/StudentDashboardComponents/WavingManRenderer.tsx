import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { Group, Vector3, AnimationClip } from "three";

type GLTFResult = {
  scene: Group;
  animations: AnimationClip[];
};

export default function WavingManRenderer() {
  // Tell TypeScript this ref is a THREE.Group
  const group = useRef<Group>(null);

  // Position state that will be bound to the primitive's position prop
  const [position, setPosition] = useState<Vector3 | [number, number, number]>([
    4, 0, 126,
  ]);

  // Load the GLTF
  const { scene, animations } = useGLTF(
    "/models/LuffyAnimation.glb"
  ) as GLTFResult;
  //   console.log("Loaded Man model:", animations);

  // Setup animations
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && actions["AnimationProgressing"]) {
      actions["AnimationProgressing"].play();
    }
  }, [actions]);

  // Movement logic
  useEffect(() => {
    const step = 2; // movement step per key press
    const rotStep = 0.1; // radians per key press for rotation
    const scaleFactor = 1.05; // scale multiplier per key press
    const minScale = 0.1; // minimum allowed uniform scale

    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key; // keep original casing for Arrow keys
      const keyLower = key.toLowerCase();

      // Movement (W/A/S/D)
      if (
        keyLower === "w" ||
        keyLower === "a" ||
        keyLower === "s" ||
        keyLower === "d"
      ) {
        setPosition((prev) => {
          // normalize prev to tuple
          const [x, y, z] = Array.isArray(prev)
            ? prev
            : [prev.x, prev.y, prev.z];

          if (keyLower === "s") {
            return [x, y, z - step];
          }
          if (keyLower === "w") {
            return [x, y, z + step];
          }
          if (keyLower === "d") {
            return [x - step, y, z];
          }
          if (keyLower === "a") {
            return [x + step, y, z];
          }

          return prev;
        });

        return;
      }

      // Rotation (ArrowLeft / ArrowRight)
      if (key === "ArrowLeft" || key === "ArrowRight") {
        e.preventDefault();
        const g = group.current;
        if (g) {
          if (key === "ArrowLeft") g.rotation.y -= rotStep;
          if (key === "ArrowRight") g.rotation.y += rotStep;
        }
        return;
      }

      // Scaling (Numpad 8 / Numpad 2) - uniform scale
      if (e.code === "Numpad8" || e.code === "Numpad2") {
        e.preventDefault();
        const g = group.current;
        if (g) {
          if (e.code === "Numpad8") {
            // Numpad 8: scale up
            g.scale.multiplyScalar(scaleFactor);
          } else {
            // Numpad 2: scale down, clamp to minScale
            const newScaleX = Math.max(g.scale.x / scaleFactor, minScale);
            const newScaleY = Math.max(g.scale.y / scaleFactor, minScale);
            const newScaleZ = Math.max(g.scale.z / scaleFactor, minScale);
            g.scale.set(newScaleX, newScaleY, newScaleZ);
          }
        }
        return;
      }

      // Log current transform on 'f'
      if (keyLower === "f") {
        const g = group.current;
        if (g) {
          const _pos = g.position;
          const _rot = g.rotation;
          const _scl = g.scale;
          // console.warn(
          //   "Current transform -> position:",
          //   pos,
          //   "rotation:",
          //   rot,
          //   "scale:",
          //   scl
          // );
        } else {
          // console.warn("Group ref not available yet.");
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <primitive
      ref={group}
      object={scene}
      // position takes either Vector3 or tuple
      position={position}
      rotation={[0, -2.5, 0]}
      scale={[3.343155108481974, 3.343155108481974, 3.343155108481974]}
    />
  );
}

// Preload the model for better performance
useGLTF.preload("/models/LuffyAnimation.glb");
