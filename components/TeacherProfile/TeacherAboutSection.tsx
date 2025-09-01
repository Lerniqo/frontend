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
    <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl p-8 md:p-10 border border-purple-100/50 shadow-lg backdrop-blur-sm">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">About Me</h2>
      </div>
      
      {shortBio ? (
        <div className="prose prose-lg max-w-none mb-10">
          <p className="text-gray-700 leading-relaxed text-lg font-light">{shortBio}</p>
        </div>
      ) : (
        <div className="bg-purple-50/50 rounded-xl p-6 mb-10 border border-purple-100/30">
          <p className="text-purple-400/70 italic text-center">No biography available at the moment.</p>
        </div>
      )}
      
      <div className="border-t border-gradient-to-r from-purple-100 to-blue-100 pt-8">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Qualifications & Expertise</h3>
        </div>
        {qualifications ? (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100/50">
            <p className="text-gray-700 text-lg leading-relaxed">{qualifications}</p>
          </div>
        ) : (
          <div className="bg-gray-50/70 rounded-xl p-6 border border-gray-100/50">
            <p className="text-gray-400 italic text-center">No qualifications information provided.</p>
          </div>
        )}
      </div>
    </div>
  );
}