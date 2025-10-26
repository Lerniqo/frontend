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
  getInterpolatedPosition: (progress: number) => {
    position: [number, number, number];
  };
  getLookDirection: (progress: number) => [number, number, number];
}

export interface PathCameraControllerProps {
  currentPathProgress: number;
  setCurrentPathProgress: React.Dispatch<React.SetStateAction<number>>;
  mouseOffset: MouseOffset;
  getInterpolatedPosition: (progress: number) => {
    position: [number, number, number];
  };
  getLookDirection: (progress: number) => [number, number, number];
}

export interface DashboardUIProps {
  currentPathProgress: number;
  startingStationStatus?: "done" | "progressing" | "waiting";
  learningPathData?: Array<{
    stepNumber: number;
    title: string;
    conceptName?: string;
    conceptId?: string;
    estimatedDuration: string;
    description: string;
    prerequisites: string[];
    resources: string[];
    status?: "done" | "progressing" | "waiting";
  }>;
}

export interface CharacterModel {
  id: number;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  modelName: string;
  side: "left" | "right";
}

// Props for the 3D scene component. enableOrbitControls is optional and used for
// testing/debugging to allow manual camera control via OrbitControls.
export interface Scene3DProps extends PathCameraControllerProps {
  enableOrbitControls?: boolean;
  characters?: number[];
  learningPath?: Array<{
    stepNumber: number;
    title: string;
    conceptName?: string;
    conceptId?: string;
    estimatedDuration: string;
    description: string;
    prerequisites: string[];
    resources: string[];
    status?: "done" | "progressing" | "waiting";
  }>;
  startingStationStatus?: "done" | "progressing" | "waiting";
}
