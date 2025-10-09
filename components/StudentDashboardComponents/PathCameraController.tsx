"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { CAMERA_NAVIGATION } from "@/constants/cameraPath";
import type { PathCameraControllerProps } from "@/types/dashboard.types";

export default function PathCameraController({
  currentPathProgress,
  mouseOffset,
  getInterpolatedPosition,
  getLookDirection,
}: PathCameraControllerProps) {
  const { camera } = useThree();

  useFrame(() => {
    const interpolated = getInterpolatedPosition(currentPathProgress);
    const lookDirection = getLookDirection(currentPathProgress);
    
    // Smoothly move camera to interpolated position
    camera.position.lerp({
      x: interpolated.position[0],
      y: interpolated.position[1],
      z: interpolated.position[2]
    }, CAMERA_NAVIGATION.INTERPOLATION_SPEED);

    // Calculate target look point with mouse offset
    const lookTarget = [
      interpolated.position[0] + lookDirection[0] * 10 + mouseOffset.x * 2,
      interpolated.position[1] + lookDirection[1] * 10 + mouseOffset.y * 2,
      interpolated.position[2] + lookDirection[2] * 10
    ];

    // Make camera look at the target point
    camera.lookAt(lookTarget[0], lookTarget[1], lookTarget[2]);
  });

  return null;
}
