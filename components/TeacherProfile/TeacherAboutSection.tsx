import React from 'react';

interface TeacherAboutSectionProps {
  shortBio?: string;
  qualifications?: string;
}

export default function TeacherAboutSection({
  shortBio,
  qualifications,
}: TeacherAboutSectionProps) {
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">About</h2>
      
      {shortBio ? (
        <p className="text-gray-700 mb-8 leading-relaxed text-base md:text-lg">{shortBio}</p>
      ) : (
        <p className="text-gray-500 italic mb-8">No biography available.</p>
      )}
      
      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Qualifications</h3>
        {qualifications ? (
          <p className="text-gray-700 text-base md:text-lg">{qualifications}</p>
        ) : (
          <p className="text-gray-500 italic">No qualifications information provided.</p>
        )}
      </div>
    </div>
  );
}