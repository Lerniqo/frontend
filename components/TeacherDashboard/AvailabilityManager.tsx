'use client';

import React, { useState } from 'react';
import { AvailabilitySlot, updateAvailability } from '@/services/teacherDashboardService';

interface AvailabilityManagerProps {
  availability: AvailabilitySlot[];
  setAvailability: (slots: AvailabilitySlot[]) => void;
}

export default function AvailabilityManager({ availability, setAvailability }: AvailabilityManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempAvailability, setTempAvailability] = useState<AvailabilitySlot[]>(availability);

  const handleToggleAvailability = (id: string) => {
    setTempAvailability(prev =>
      prev.map(slot =>
        slot.id === id ? { ...slot, isAvailable: !slot.isAvailable } : slot
      )
    );
  };

  const handleSave = async () => {
    try {
      const result = await updateAvailability(tempAvailability);
      if (result.success) {
        setAvailability(tempAvailability);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleCancel = () => {
    setTempAvailability(availability);
    setIsEditing(false);
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500/20 backdrop-blur-xl rounded-xl border border-blue-400/30">
            <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Set Your Availability</h3>
            <p className="text-slate-400 mt-1">Manage your teaching schedule</p>
          </div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Edit Schedule
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:scale-105"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-300 shadow-lg hover:scale-105"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(isEditing ? tempAvailability : availability).map((slot) => (
          <div key={slot.id} className="group p-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                slot.isAvailable ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'
              }`}></div>
              {isEditing && (
                <button
                  onClick={() => handleToggleAvailability(slot.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    slot.isAvailable
                      ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-400/30'
                      : 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-400/30'
                  }`}
                >
                  {slot.isAvailable ? 'Available' : 'Unavailable'}
                </button>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-white text-lg mb-2 group-hover:text-blue-200 transition-colors duration-300">{slot.day}</h4>
              <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">{slot.startTime} - {slot.endTime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
