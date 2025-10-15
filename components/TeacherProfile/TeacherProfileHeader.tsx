import React from 'react';
import Image from 'next/image';

interface TeacherProfileHeaderProps {
  name: string;
  profilePictureUrl?: string;
  yearsOfExperience?: number;
  highestEducationLevel?: string;
  qualifications?: string;
}

export default function TeacherProfileHeader({
  name,
  profilePictureUrl,
  yearsOfExperience,
  highestEducationLevel,
  qualifications,
}: TeacherProfileHeaderProps) {
  // Generate initials from name if no profile picture
  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="relative bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 p-12 text-white overflow-hidden rounded-3xl shadow-2xl border border-white/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute top-1/2 -left-8 w-24 h-24 bg-white/30 rounded-full"></div>
        <div className="absolute bottom-4 right-1/3 w-16 h-16 bg-white/20 rounded-full"></div>
      </div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center">
        <div className="mb-8 lg:mb-0 lg:mr-12">
          {profilePictureUrl ? (
            <div className="relative w-40 h-40 rounded-full border-4 border-white/30 shadow-2xl bg-white/10 backdrop-blur-sm">
              <Image 
                src={profilePictureUrl} 
                alt={name} 
                fill
                className="rounded-full object-cover"
              />
              <div className="absolute inset-0 rounded-full ring-4 ring-white/20"></div>
            </div>
          ) : (
            <div className="w-40 h-40 rounded-full border-4 border-white/30 shadow-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-4xl relative">
              {getInitials(name)}
              <div className="absolute inset-0 rounded-full ring-4 ring-white/20"></div>
            </div>
          )}
        </div>
        
        <div className="text-center lg:text-left flex-1">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">{name}</h1>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-6">
            {yearsOfExperience !== undefined && (
              <div className="group bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30 hover:bg-white/30 transition-all duration-300">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-semibold text-white">{yearsOfExperience}+ years</span>
                </div>
                <span className="text-white/80 text-sm block mt-1">Experience</span>
              </div>
            )}
            
            {highestEducationLevel && (
              <div className="group bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30 hover:bg-white/30 transition-all duration-300">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  <span className="font-semibold text-white">{highestEducationLevel}</span>
                </div>
                <span className="text-white/80 text-sm block mt-1">Education</span>
              </div>
            )}
            
            {qualifications && (
              <div className="group bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30 hover:bg-white/30 transition-all duration-300">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span className="font-semibold text-white truncate max-w-32">{qualifications}</span>
                </div>
                <span className="text-white/80 text-sm block mt-1">Certified</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}