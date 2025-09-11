import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
// import * as THREE from "three";

export default function CameraController({
  cameraPosition,
  cameraRotation,
}: {
  cameraPosition: [number, number, number];
  cameraRotation: [number, number, number];
}) {
  const { camera } = useThree();
  //   const targetPosition = new THREE.Vector3(...cameraPosition);
  //   const targetRotation = new THREE.Euler(...cameraRotation);
  //   useEffect(() => {
  //     camera.position.set(-0.01, 5.29, 80.65);
  //     camera.rotation.set(
  //       (173.26 * Math.PI) / 180, // Convert degrees to radians
  //       (1.94 * Math.PI) / 180,
  //       (179.78 * Math.PI) / 180
  //     );
  //   }, []); // Set initial position and rotation on mount

  useEffect(() => {
    camera.position.set(...cameraPosition);
    camera.rotation.set(...cameraRotation);
  }, [cameraPosition, cameraRotation]);

  return null;
}
