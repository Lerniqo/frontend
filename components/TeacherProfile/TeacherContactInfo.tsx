import React from 'react';

interface TeacherContactInfoProps {
  address?: string;
  phoneNumber?: string;
  email?: string;
}

export default function TeacherContactInfo({
  address,
  phoneNumber,
  email,
}: TeacherContactInfoProps) {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl p-8 border border-blue-200/50 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full -translate-y-4 translate-x-4"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Contact Information</h3>
        </div>
        
        <div className="space-y-6">
          {address && (
            <div className="flex items-start group p-4 rounded-xl hover:bg-blue-50/50 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-3 mr-4 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-600 uppercase tracking-wide font-semibold mb-1">Location</p>
                <p className="font-medium text-gray-800 text-lg leading-relaxed">{address}</p>
              </div>
            </div>
          )}
          
          {phoneNumber && (
            <div className="flex items-start group p-4 rounded-xl hover:bg-green-50/50 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl p-3 mr-4 group-hover:from-green-200 group-hover:to-blue-200 transition-all duration-300 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-green-600 uppercase tracking-wide font-semibold mb-1">Phone</p>
                <a href={`tel:${phoneNumber}`} className="font-medium text-gray-800 text-lg hover:text-green-600 transition-colors duration-300 block">
                  {phoneNumber}
                </a>
              </div>
            </div>
          )}
          
          {email && (
            <div className="flex items-start group p-4 rounded-xl hover:bg-purple-50/50 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-3 mr-4 group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-purple-600 uppercase tracking-wide font-semibold mb-1">Email</p>
                <a href={`mailto:${email}`} className="font-medium text-gray-800 text-lg hover:text-purple-600 transition-colors duration-300 break-all block">
                  {email}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100/50">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Have questions before booking? Feel free to reach out!</p>
            <div className="flex flex-col sm:flex-row gap-3">
              {phoneNumber && (
                <a 
                  href={`tel:${phoneNumber}`}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
                >
                  Call Now
                </a>
              )}
              {email && (
                <a 
                  href={`mailto:${email}`}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
                >
                  Send Email
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}