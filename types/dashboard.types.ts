/**
 * Types for the Student Dashboard 3D navigation system
 */

export interface CameraPathPoint {
  id: number;
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface MouseOffset {
  x: number;
  y: number;
}

export interface CameraNavigation {
  currentPathProgress: number;
  setCurrentPathProgress: React.Dispatch<React.SetStateAction<number>>;
  mouseOffset: MouseOffset;
  getInterpolatedPosition: (progress: number) => { position: [number, number, number] };
  getLookDirection: (progress: number) => [number, number, number];
}

export interface PathCameraControllerProps {
  currentPathProgress: number;
  setCurrentPathProgress: React.Dispatch<React.SetStateAction<number>>;
  mouseOffset: MouseOffset;
  getInterpolatedPosition: (progress: number) => { position: [number, number, number] };
  getLookDirection: (progress: number) => [number, number, number];
}

export interface DashboardUIProps {
  currentPathProgress: number;
}

export interface Scene3DProps extends PathCameraControllerProps {}
