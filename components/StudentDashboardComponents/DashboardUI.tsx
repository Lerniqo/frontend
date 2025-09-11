"use client";

import { CAMERA_PATH } from "@/constants/cameraPath";
import type { DashboardUIProps } from "@/types/dashboard.types";

export default function DashboardUI({ currentPathProgress }: DashboardUIProps) {
  const progressPercentage = (currentPathProgress / (CAMERA_PATH.length - 1) * 100).toFixed(1);
  const currentPosition = currentPathProgress.toFixed(2);
  const maxPosition = CAMERA_PATH.length - 1;

  return (
    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Student Dashboard
      </h1>
      <p className="text-gray-600 mb-2">
        Camera Path Navigation: Use arrow keys to move along the path
      </p>
      <div className="text-sm text-gray-500">
        <p>← ↓ Move backward | ↑ → Move forward</p>
        <p>Mouse: Move cursor to slightly adjust view</p>
        <p>Progress: {progressPercentage}%</p>
        <p>Position: {currentPosition} of {maxPosition}</p>
      </div>
    </div>
  );
}
