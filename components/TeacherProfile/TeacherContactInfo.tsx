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
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-5">Contact Information</h3>
      
      <div className="space-y-5">
        {address && (
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-lg p-2.5 mr-3.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">Address</p>
              <p className="font-medium text-gray-800 mt-1">{address}</p>
            </div>
          </div>
        )}
        
        {phoneNumber && (
          <div className="flex items-start">
            <div className="bg-green-100 rounded-lg p-2.5 mr-3.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">Phone</p>
              <p className="font-medium text-gray-800 mt-1">{phoneNumber}</p>
              </div>
          </div>
        )}
        
        {email && (
          <div className="flex items-start">
            <div className="bg-purple-100 rounded-lg p-2.5 mr-3.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">Email</p>
              <p className="font-medium text-gray-800 mt-1 break-all">{email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}