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
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggleAvailability = (id: string) => {
    setTempAvailability(prev =>
      prev.map(slot =>
        slot.id === id ? { ...slot, isAvailable: !slot.isAvailable } : slot
      )
    );
  };

  const handleDeleteSlot = (id: string) => {
    setTempAvailability(prev => prev.filter(slot => slot.id !== id));
  };

  const handleAddSlot = () => {
    if (!selectedDate || !startTime || !endTime) {
      alert('Please fill in all fields');
      return;
    }

    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDateObj < today) {
      alert('Please select a future date');
      return;
    }

    if (startTime >= endTime) {
      alert('End time must be after start time');
      return;
    }

    const dayName = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const newSlot: AvailabilitySlot = {
      id: Date.now().toString(),
      date: selectedDate,
      day: dayName,
      startTime,
      endTime,
      isAvailable: true,
    };

    setTempAvailability(prev => [...prev, newSlot]);
    setSelectedDate('');
    setStartTime('');
    setEndTime('');
    setShowAddForm(false);
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
    setShowAddForm(false);
    setSelectedDate('');
    setStartTime('');
    setEndTime('');
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

      {isEditing && (
        <div className="mb-8">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-3 group"
            >
              <svg className="w-6 h-6 text-indigo-300 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-white font-medium">Add New Availability Slot</span>
            </button>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/20 p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Add New Time Slot</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Select Date</label>
                  <input
                    type="date"
                    min={getMinDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddSlot}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:scale-105"
                >
                  Add Slot
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-300 shadow-lg hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(isEditing ? tempAvailability : availability).map((slot) => (
          <div key={slot.id} className="group p-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                slot.isAvailable ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'
              }`}></div>
              {isEditing && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleAvailability(slot.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                      slot.isAvailable
                        ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-400/30'
                        : 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-400/30'
                    }`}
                  >
                    {slot.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="px-3 py-1 bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-xs font-medium transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-white text-lg mb-1 group-hover:text-blue-200 transition-colors duration-300">{slot.day}</h4>
              <p className="text-slate-400 text-sm mb-2 group-hover:text-slate-300 transition-colors duration-300">{formatDate(slot.date)}</p>
              <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">{slot.startTime} - {slot.endTime}</p>
            </div>
          </div>
        ))}
      </div>

      {(isEditing ? tempAvailability : availability).length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Availability Set</h3>
          <p className="text-slate-400">Add your first availability slot to get started</p>
        </div>
      )}
    </div>
  );
}
