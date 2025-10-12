import type { CameraPathPoint } from "@/types/dashboard.types";

/**
 * Camera path positions for the student dashboard 3D navigation
 */

export const CAMERA_PATH: CameraPathPoint[] = [
  {
    id: 0,
    position: [0.41, 5.17, 104.85],
    rotation: [
      (174.7 * Math.PI) / 180,
      (-0.91 * Math.PI) / 180,
      (179.92 * Math.PI) / 180,
    ],
  },
  {
    id: 1,
    position: [-0.03, 5.29, 130.77],
    rotation: [
      (174.98 * Math.PI) / 180,
      (0.62 * Math.PI) / 180,
      (-179.95 * Math.PI) / 180,
    ],
  },
  {
    id: 2,
    position: [-0.02, 4.72, 191.28],
    rotation: [
      (-176.26 * Math.PI) / 180,
      (5.91 * Math.PI) / 180,
      (179.61 * Math.PI) / 180,
    ],
  },
  {
    id: 3,
    position: [0.7, 3.53, 239.54],
    rotation: [
      (178.28 * Math.PI) / 180,
      (0.23 * Math.PI) / 180,
      (-179.99 * Math.PI) / 180,
    ],
  },
  {
    id: 4,
    position: [0.13, 6.61, 262.15],
    rotation: [
      (175.98 * Math.PI) / 180,
      (-1.05 * Math.PI) / 180,
      (179.93 * Math.PI) / 180,
    ],
  },
  {
    id: 5,
    position: [0.77, 7.98, 303.63],
    rotation: [
      (178.42 * Math.PI) / 180,
      (4.53 * Math.PI) / 180,
      (-179.87 * Math.PI) / 180,
    ],
  },
  {
    id: 6,
    position: [1.19, 7.98, 350.82],
    rotation: [
      (178.28 * Math.PI) / 180,
      (2.81 * Math.PI) / 180,
      (-179.92 * Math.PI) / 180,
    ],
  },
  {
    id: 7,
    position: [0.32, 6.44, 388.67],
    rotation: [
      (156.35 * Math.PI) / 180,
      (2.05 * Math.PI) / 180,
      (-179.1 * Math.PI) / 180,
    ],
  },
  {
    id: 8,
    position: [0.42, 4.71, 418.98],
    rotation: [
      (-179.72 * Math.PI) / 180,
      (3.96 * Math.PI) / 180,
      (179.98 * Math.PI) / 180,
    ],
  },
  {
    id: 9,
    position: [-0.22, 4.71, 428.69],
    rotation: [
      (-178.28 * Math.PI) / 180,
      (1.24 * Math.PI) / 180,
      (179.96 * Math.PI) / 180,
    ],
  },
  {
    id: 10,
    position: [-0.22, 5.69, 434.56],
    rotation: [
      (-175.42 * Math.PI) / 180,
      (2.66 * Math.PI) / 180,
      (179.79 * Math.PI) / 180,
    ],
  },
  {
    id: 11,
    position: [-2.45, 2.67, 448.98],
    rotation: [
      (-178.62 * Math.PI) / 180,
      (34.17 * Math.PI) / 180,
      (179.22 * Math.PI) / 180,
    ],
  },
  {
    id: 12,
    position: [-19.68, 3.32, 453.48],
    rotation: [
      (129.46 * Math.PI) / 180,
      (86.47 * Math.PI) / 180,
      (-129.52 * Math.PI) / 180,
    ],
  },
  {
    id: 13,
    position: [-40.35, 2.67, 454.28],
    rotation: [
      (76.37 * Math.PI) / 180,
      (86.16 * Math.PI) / 180,
      (-76.34 * Math.PI) / 180,
    ],
  },
];

// Camera navigation constants
export const CAMERA_NAVIGATION = {
  STEP_SIZE: 0.1,
  MOUSE_SENSITIVITY: 0.01,
  MAX_MOUSE_OFFSET: 30,
  INTERPOLATION_SPEED: 0.1,
  LOOK_AHEAD_DISTANCE: 0.5,
} as const;
