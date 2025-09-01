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
    <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl p-8 border border-purple-200/50 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-600/10 rounded-full -translate-y-8 translate-x-8"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-purple-600/10 rounded-full translate-y-8 -translate-x-8"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Book a Lesson</h3>
        </div>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start group">
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-3 mr-4 group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-lg mb-1">Flexible Scheduling</p>
              <p className="text-gray-600 leading-relaxed">Book lessons at your convenience with our intuitive calendar system. Choose from available time slots that fit your schedule perfectly.</p>
            </div>
          </div>
          
          <div className="flex items-start group">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-3 mr-4 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-lg mb-1">Verified Expert</p>
              <p className="text-gray-600 leading-relaxed">All our tutors undergo rigorous verification and background checks to ensure quality education and your safety.</p>
            </div>
          </div>

          <div className="flex items-start group">
            <div className="bg-gradient-to-br from-green-100 to-purple-100 rounded-xl p-3 mr-4 group-hover:from-green-200 group-hover:to-purple-200 transition-all duration-300 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-lg mb-1">Instant Confirmation</p>
              <p className="text-gray-600 leading-relaxed">Get immediate booking confirmation and calendar invites. Start learning without any delays or complications.</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleHireTeacher}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book Now
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>
      </div>
    </div>
  );
}