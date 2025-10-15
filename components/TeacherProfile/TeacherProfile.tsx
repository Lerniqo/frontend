"use client";

import React from "react";
import dynamic from "next/dynamic";
import GeneralLoadingComponent from "../CommonComponents/GeneralLoadingComponent";
import { TeacherProfile as TeacherProfileType } from "@/types/auth.types";

// Define the props for the dynamically imported component
interface TeacherProfileContainerProps {
  teacher?: TeacherProfileType;
  teacherId?: string;
  onGoBack?: () => void;
  onHireTeacher?: (teacherId: string) => void;
}

// Dynamically import the TeacherProfileContainer to avoid SSR issues
const TeacherProfileContainer = dynamic<TeacherProfileContainerProps>(
  () =>
    import("@/components/TeacherProfile").then(
      (mod) => mod.TeacherProfileContainer
    ),
  {
    ssr: false,
    loading: () => (
      <GeneralLoadingComponent text="Loading Teacher Profile..." />
    ),
  }
);

interface TeacherProfileProps {
  teacher?: TeacherProfileType;
  teacherId?: string;
  onGoBack?: () => void;
  onHireTeacher?: (teacherId: string) => void;
}

const TeacherProfile: React.FC<TeacherProfileProps> = ({
  teacher,
  teacherId,
  onGoBack,
  onHireTeacher,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 py-12 px-4">
      <TeacherProfileContainer
        teacher={teacher}
        teacherId={teacherId}
        onGoBack={onGoBack}
        onHireTeacher={onHireTeacher}
      />
    </div>
  );
};

export default TeacherProfile;
