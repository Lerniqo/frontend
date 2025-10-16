
"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

interface ConceptFileUploadProps {
  onFileUpload: (file: File) => void;
}

const ConceptFileUpload: React.FC<ConceptFileUploadProps> = ({ onFileUpload }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Upload File</h2>
      {uploadedFile ? (
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FileIcon className="w-6 h-6 text-gray-500" />
            <span className="font-medium text-gray-700">{uploadedFile.name}</span>
          </div>
          <button onClick={removeFile} className="text-gray-500 hover:text-red-500">
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center">
            <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-lg font-semibold text-blue-600">Drop the file here ...</p>
            ) : (
              <p className="text-gray-500">Drag & drop a file here, or click to select a file</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConceptFileUpload;
