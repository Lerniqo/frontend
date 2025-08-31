import React from 'react';

interface TeacherBookingCardProps {
  teacherId: string;
  onHireTeacher?: (teacherId: string) => void;
}

export default function TeacherBookingCard({
  teacherId,
  onHireTeacher,
}: TeacherBookingCardProps) {
  const handleHireTeacher = () => {
    if (onHireTeacher) {
      onHireTeacher(teacherId);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-5">Book a Lesson</h3>
      
      <div className="space-y-5 mb-7">
        <div className="flex items-start">
          <div className="bg-blue-100 rounded-lg p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Flexible Scheduling</p>
            <p className="text-gray-600 text-sm mt-1">Book lessons at your convenience with our easy-to-use calendar system</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-indigo-100 rounded-lg p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Verified Tutor</p>
            <p className="text-gray-600 text-sm mt-1">All our tutors go through a rigorous verification process</p>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleHireTeacher}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        Book Now
      </button>
    </div>
  );
}