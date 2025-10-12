import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { Group } from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js"; // important!

type GLTFResult = {
  scene: Group;
  animations: any[];
};

interface CharacterProps {
  modelName: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  animation?: string;
}

export default function Character({
  modelName,
  position,
  rotation,
  scale,
  animation = "AnimationProgressing",
}: CharacterProps) {
  const group = useRef<Group>(null);

  // Preload for performance (optional)
  useEffect(() => {
    useGLTF.preload(`/models/${modelName}`);
  }, [modelName]);

  // Load model once
  const { scene, animations } = useGLTF(`/models/${modelName}`) as GLTFResult;

  // Clone the scene so each character gets its own skeleton & materials
  const clonedScene = useMemo(() => clone(scene), [scene]);

  // Setup animations
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && actions[animation]) {
      actions[animation].play();
    }
  }, [actions, animation]);

  return (
    <primitive
      ref={group}
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}
