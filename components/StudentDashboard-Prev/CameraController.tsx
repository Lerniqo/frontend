"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";

interface CameraControllerProps {
  cameraType?: "perspective" | "orthographic";
  initialPosition?: [number, number, number];
  initialRotation?: [number, number, number];
  initialTarget?: [number, number, number];
  onCameraChange?: (position: THREE.Vector3, rotation: THREE.Euler) => void;
}

export default function CameraController({
  cameraType = "perspective",
  initialPosition = [0, 5, 10],
  initialRotation = [0, 0, 0],
  initialTarget = [0, 0, 0],
  onCameraChange,
}: CameraControllerProps) {
  const { camera, gl, size } = useThree();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  // Calculate target point based on camera position and rotation
  const getTargetFromRotation = (
    position: [number, number, number],
    rotation: [number, number, number]
  ) => {
    const tempCamera = new THREE.PerspectiveCamera();
    tempCamera.position.set(...position);
    tempCamera.rotation.set(...rotation);

    // Get the direction the camera is looking at
    const direction = new THREE.Vector3();
    tempCamera.getWorldDirection(direction);

    // Calculate a target point in front of the camera
    const distance = 5; // Distance to the target point
    const target = new THREE.Vector3()
      .copy(tempCamera.position)
      .add(direction.multiplyScalar(distance));

    return [target.x, target.y, target.z] as [number, number, number];
  };

  // Log camera position and rotation for debugging
  useFrame(() => {
    if (onCameraChange && camera) {
      onCameraChange(camera.position, camera.rotation);
    }
  });

  // Function to get current camera state (you can call this from browser console)
  useEffect(() => {
    // Make camera position accessible globally for debugging
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).getCameraPosition = () => {
      console.warn("Camera Position:", camera.position);
      console.warn("Camera Rotation:", camera.rotation);
      console.warn("Camera Position Array:", [
        camera.position.x,
        camera.position.y,
        camera.position.z,
      ]);
      console.warn("Camera Rotation Array:", [
        camera.rotation.x,
        camera.rotation.y,
        camera.rotation.z,
      ]);
      return {
        position: [camera.position.x, camera.position.y, camera.position.z],
        rotation: [camera.rotation.x, camera.rotation.y, camera.rotation.z],
      };
    };
  }, [camera]);

  useEffect(() => {
    // Calculate the target based on initial rotation if no explicit target provided
    const calculatedTarget =
      initialTarget[0] === 0 && initialTarget[1] === 0 && initialTarget[2] === 0
        ? getTargetFromRotation(initialPosition, initialRotation)
        : initialTarget;

    if (cameraType === "orthographic") {
      // Create orthographic camera with proper aspect ratio
      const aspect = size.width / size.height;
      const frustumSize = 10;

      const orthoCam = new THREE.OrthographicCamera(
        (-frustumSize * aspect) / 2,
        (frustumSize * aspect) / 2,
        frustumSize / 2,
        -frustumSize / 2,
        0.1,
        1000
      );

      // Set position from props or default
      orthoCam.position.set(...initialPosition);
      orthoCam.lookAt(...calculatedTarget);

      // Replace the current camera
      gl.render = () => {};
    } else {
      // Ensure perspective camera has proper settings
      if ('fov' in camera) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (camera as any).fov = 45;
        camera.position.set(...initialPosition);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (camera as any).near = 0.1;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (camera as any).far = 1000;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (camera as any).updateProjectionMatrix();
        camera.lookAt(...calculatedTarget);
      }
    }

    // Update OrbitControls target
    if (controlsRef.current) {
      controlsRef.current.target.set(...calculatedTarget);
      controlsRef.current.update();
    }
  }, [
    cameraType,
    camera,
    gl,
    size,
    initialPosition,
    initialRotation,
    initialTarget,
  ]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={false}
      enableRotate={false}
      // Constrain vertical rotation to reduce extreme angles
      maxPolarAngle={Math.PI / 2.2} // About 82 degrees
      minPolarAngle={Math.PI / 6} // About 30 degrees
      // Constrain zoom distance
      minDistance={cameraType === "orthographic" ? 3 : 5}
      maxDistance={cameraType === "orthographic" ? 15 : 20}
      // Smooth camera movement
      enableDamping={true}
      dampingFactor={0.05}
      // Target will be set dynamically based on camera rotation
      // Reduce rotation speed for more controlled movement
      rotateSpeed={0.5}
      zoomSpeed={0.5}
      panSpeed={0.5}
    />
  );
}
