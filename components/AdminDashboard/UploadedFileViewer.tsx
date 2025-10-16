"use client";

import React from "react";
import Image from "next/image";

interface UploadedFileViewerProps {
  file: File;
}

const UploadedFileViewer: React.FC<UploadedFileViewerProps> = ({ file }) => {
  const fileURL = URL.createObjectURL(file);

  const renderFile = () => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="relative w-full h-auto">
          <Image
            src={fileURL}
            alt={file.name}
            width={800}
            height={600}
            className="max-w-full h-auto rounded-lg"
            style={{ objectFit: "contain" }}
          />
        </div>
      );
    }

    if (file.type === "application/pdf") {
      return (
        <iframe
          src={fileURL}
          className="w-full h-screen"
          title={file.name}
        ></iframe>
      );
    }

    return <p>Unsupported file type.</p>;
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Uploaded File Preview
      </h3>
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        {renderFile()}
      </div>
    </div>
  );
};

export default UploadedFileViewer;
