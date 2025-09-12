"use client";

import React from "react";
import { useParams } from "next/navigation";
import WebinarRoom from "@/components/WebinarComponents/WebinarRoom";

export default function WebinarPage() {
  const params = useParams();
  const webinarId = params.id as string;

  return <WebinarRoom webinarId={webinarId} />;
}
