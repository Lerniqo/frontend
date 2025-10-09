import { useState, useEffect } from 'react';
import { CAMERA_PATH, CAMERA_NAVIGATION } from '@/constants/cameraPath';
import type { MouseOffset, CameraNavigation } from '@/types/dashboard.types';

export function useCameraPathNavigation(): CameraNavigation {
  const [currentPathProgress, setCurrentPathProgress] = useState(0);
  const [mouseOffset, setMouseOffset] = useState<MouseOffset>({ x: 0, y: 0 });

  // Interpolate between path points
  const getInterpolatedPosition = (progress: number) => {
    const clampedProgress = Math.max(0, Math.min(progress, CAMERA_PATH.length - 1));
    const currentIndex = Math.floor(clampedProgress);
    const nextIndex = Math.min(currentIndex + 1, CAMERA_PATH.length - 1);
    const t = clampedProgress - currentIndex;

    const currentPoint = CAMERA_PATH[currentIndex];
    const nextPoint = CAMERA_PATH[nextIndex];

    // Interpolate position
    const position: [number, number, number] = [
      currentPoint.position[0] + (nextPoint.position[0] - currentPoint.position[0]) * t,
      currentPoint.position[1] + (nextPoint.position[1] - currentPoint.position[1]) * t,
      currentPoint.position[2] + (nextPoint.position[2] - currentPoint.position[2]) * t,
    ];

    return { position };
  };

  // Calculate look-ahead direction
  const getLookDirection = (progress: number): [number, number, number] => {
    const futureProgress = Math.min(
      progress + CAMERA_NAVIGATION.LOOK_AHEAD_DISTANCE, 
      CAMERA_PATH.length - 1
    );
    
    const currentPos = getInterpolatedPosition(progress);
    const futurePos = getInterpolatedPosition(futureProgress);
    
    // Calculate direction vector
    return [
      futurePos.position[0] - currentPos.position[0],
      futurePos.position[1] - currentPos.position[1],
      futurePos.position[2] - currentPos.position[2],
    ];
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { STEP_SIZE } = CAMERA_NAVIGATION;
      
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowRight':
          event.preventDefault();
          setCurrentPathProgress((prev) => 
            Math.min(prev + STEP_SIZE, CAMERA_PATH.length - 1)
          );
          break;
        case 'ArrowDown':
        case 'ArrowLeft':
          event.preventDefault();
          setCurrentPathProgress((prev) => 
            Math.max(prev - STEP_SIZE, 0)
          );
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // Mouse movement tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { MOUSE_SENSITIVITY, MAX_MOUSE_OFFSET } = CAMERA_NAVIGATION;
      
      // Calculate mouse position relative to center of screen
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const deltaX = -(event.clientX - centerX) * MOUSE_SENSITIVITY;
      const deltaY = -(event.clientY - centerY) * MOUSE_SENSITIVITY; // Invert Y to make movement natural
      
      // Clamp the offset to prevent extreme movements
      setMouseOffset({
        x: Math.max(-MAX_MOUSE_OFFSET, Math.min(MAX_MOUSE_OFFSET, deltaX)),
        y: Math.max(-MAX_MOUSE_OFFSET, Math.min(MAX_MOUSE_OFFSET, deltaY))
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return {
    currentPathProgress,
    setCurrentPathProgress,
    mouseOffset,
    getInterpolatedPosition,
    getLookDirection,
  };
}
