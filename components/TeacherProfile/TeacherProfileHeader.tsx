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
    <div className="bg-gradient-to-r from-blue-700 to-purple-700 p-8 text-white rounded-t-2xl">
      <div className="flex flex-col md:flex-row items-center">
        <div className="mb-6 md:mb-0 md:mr-8">
          {profilePictureUrl ? (
            <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-xl">
              <Image 
                src={profilePictureUrl} 
                alt={name} 
                fill
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white flex items-center justify-center text-blue-700 font-bold text-3xl">
              {getInitials(name)}
            </div>
          )}
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl font-bold mb-3">{name}</h1>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            {yearsOfExperience !== undefined && (
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5">
                <span className="font-semibold">{yearsOfExperience}+ years</span> experience
              </div>
            )}
            
            {highestEducationLevel && (
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5">
                <span className="font-semibold">{highestEducationLevel}</span>
              </div>
            )}
            
            {qualifications && (
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5">
                <span className="font-semibold">{qualifications}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}