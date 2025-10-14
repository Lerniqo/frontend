"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Loading } from "@/components/CommonComponents/Loading";

const Protected = ({
  teacher,
  student,
  admin,
}: {
  teacher: React.ReactNode;
  student: React.ReactNode;
  admin: React.ReactNode;
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isAuthenticated)) {
      router.push("/login");
    }
  }, [user, isAuthenticated, isLoading, router]);
  // return student;
  if (isLoading) return <Loading />;

  if (!user || !isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  if (user.role === "Teacher") return teacher;

  if (user.role === "Student") return student;

  if (user.role === "Admin") return admin;

  throw new Error("Unknown user role");
};

export default Protected;
