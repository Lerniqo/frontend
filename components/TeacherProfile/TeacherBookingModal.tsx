"use client";

import React, { useState, useEffect } from 'react';
import { DaySchedule, TimeSlot, SelectedSlot } from '@/types/auth.types';

interface TeacherBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  teacherId: string;
  onSlotSelect: (slot: SelectedSlot) => void;
}

// Mock data generator for teacher availability
const generateMockAvailability = (date: Date): DaySchedule[] => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const schedule: DaySchedule[] = [];
  
  // Generate schedule for the entire month
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // Get first day of month and last day of month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Start from the first Sunday of the week that includes the first day of the month
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());
  
  // End on the last Saturday of the week that includes the last day of the month
  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
  
  // Generate dates for the entire calendar view
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const timeSlots: TimeSlot[] = [];
    
    // Generate time slots from 8:00 to 18:00
    for (let hour = 8; hour < 18; hour++) {
      // Create two slots per hour (e.g., 08:00-09:00 and 08:30-09:30)
      timeSlots.push({
        id: `${currentDate.toISOString().split('T')[0]}-${hour}:00`,
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
        isAvailable: Math.random() > 0.3 // 70% chance of being available
      });
      
      if (hour < 17) {
        timeSlots.push({
          id: `${currentDate.toISOString().split('T')[0]}-${hour}:30`,
          startTime: `${hour.toString().padStart(2, '0')}:30`,
          endTime: `${(hour + 1).toString().padStart(2, '0')}:30`,
          isAvailable: Math.random() > 0.4 // 60% chance of being available
        });
      }
    }
    
    schedule.push({
      date: currentDate.toISOString().split('T')[0],
      dayOfWeek: days[currentDate.getDay()],
      timeSlots
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return schedule;
};

// Function to format date as "Month Year"
const formatMonthYear = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export default function TeacherBookingModal({
  isOpen,
  onClose,
  teacherName,
  teacherId: _teacherId,
  onSlotSelect
}: TeacherBookingModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Generate mock data when component mounts or when month changes
  useEffect(() => {
    if (isOpen) {
      const mockSchedule = generateMockAvailability(currentDate);
      setSchedule(mockSchedule);
      setSelectedSlot(null); // Reset selection when modal opens or month changes
      setSelectedDate(null); // Reset date selection
    }
  }, [isOpen, currentDate]);
  
  // Handle clicking outside the modal to close it
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  const handleSlotClick = (date: string, timeSlot: TimeSlot) => {
    if (timeSlot.isAvailable) {
      setSelectedSlot({ date, timeSlot });
    }
  };
  
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };
  
  const handleConfirmBooking = () => {
    if (selectedSlot) {
      onSlotSelect(selectedSlot);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };
  
  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Filter schedule for the selected date
  const getSlotsForSelectedDate = () => {
    if (!selectedDate) return [];
    const daySchedule = schedule.find(day => day.date === selectedDate);
    return daySchedule ? daySchedule.timeSlots : [];
  };
  
  if (!isOpen) return null;
  
  // Get the days to display in the calendar grid
  const getCalendarDays = () => {
    return schedule.slice(0, 42); // 6 weeks max
  };
  
  const calendarDays = getCalendarDays();
  const selectedDateSlots = getSlotsForSelectedDate();
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-blue-600 p-8 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-1/2 -left-8 w-24 h-24 bg-white/30 rounded-full"></div>
          </div>
          
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">Book a Lesson</h2>
              <p className="text-purple-100 text-lg">with {teacherName}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-all duration-300 p-2 rounded-full hover:bg-white/20 group"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transform group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Select a Date and Time</h3>
              
              {/* Calendar Navigation */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={goToPreviousMonth}
                  className="p-3 rounded-xl hover:bg-purple-50 transition-all duration-300 group border border-purple-100"
                  aria-label="Previous month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button 
                  onClick={goToToday}
                  className="px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 border border-purple-200"
                >
                  Today
                </button>
                
                <h4 className="text-xl font-bold text-gray-800 min-w-[200px] text-center">
                  {formatMonthYear(currentDate)}
                </h4>
                
                <button 
                  onClick={goToNextMonth}
                  className="p-3 rounded-xl hover:bg-purple-50 transition-all duration-300 group border border-purple-100"
                  aria-label="Next month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Calendar View */}
            <div className="mb-10">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-bold text-purple-600 py-3 bg-purple-50 rounded-lg">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => {
                  const isCurrentMonth = new Date(day.date).getMonth() === currentDate.getMonth();
                  const isSelected = selectedDate === day.date;
                  const hasAvailableSlots = day.timeSlots.some(slot => slot.isAvailable);
                  
                  return (
                    <button
                      key={day.date}
                      onClick={() => handleDateClick(day.date)}
                      className={`
                        h-14 rounded-xl flex flex-col items-center justify-center text-sm font-semibold transition-all duration-300 transform hover:scale-105 relative
                        ${isSelected 
                          ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg' 
                          : isCurrentMonth
                            ? hasAvailableSlots
                              ? 'bg-white text-gray-800 hover:bg-purple-50 border-2 border-purple-200 shadow-md hover:shadow-lg'
                              : 'bg-gray-50 text-gray-400 border-2 border-gray-200'
                            : 'bg-gray-50 text-gray-300 border-2 border-gray-100'
                        }
                      `}
                    >
                      <span className={isSelected ? 'text-white' : isCurrentMonth ? '' : 'text-gray-300'}>
                        {new Date(day.date).getDate()}
                      </span>
                      {hasAvailableSlots && isCurrentMonth && !isSelected && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Time Slots for Selected Date */}
            {selectedDate && (
              <div className="mt-10">
                <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Available Times for {formatDate(selectedDate)}
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {selectedDateSlots.map((timeSlot) => (
                    <button
                      key={timeSlot.id}
                      onClick={() => handleSlotClick(selectedDate, timeSlot)}
                      disabled={!timeSlot.isAvailable}
                      className={`
                        py-4 px-3 rounded-xl flex flex-col items-center justify-center text-sm font-semibold transition-all duration-300 transform hover:scale-105 border-2
                        ${selectedSlot?.timeSlot.id === timeSlot.id
                          ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg border-purple-600'
                          : timeSlot.isAvailable
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 text-emerald-800 hover:from-green-100 hover:to-emerald-100 hover:shadow-lg border-emerald-200'
                            : 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
                        }
                      `}
                    >
                      <span className="text-base font-bold">{timeSlot.startTime}</span>
                      <span className={`text-xs mt-1 ${selectedSlot?.timeSlot.id === timeSlot.id ? 'text-purple-100' : timeSlot.isAvailable ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {timeSlot.isAvailable ? 'Available' : 'Booked'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-6 mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg mr-3 border-2 border-emerald-200 relative">
                <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full transform translate-x-1 -translate-y-1"></div>
              </div>
              <span className="text-sm font-medium text-gray-700">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-gray-100 rounded-lg mr-3 border-2 border-gray-200"></div>
              <span className="text-sm font-medium text-gray-700">Unavailable</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg mr-3"></div>
              <span className="text-sm font-medium text-gray-700">Selected</span>
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-purple-50/30 px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-purple-100">
          {selectedSlot ? (
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-purple-600 mb-1">Selected slot:</p>
              <p className="font-bold text-lg text-gray-800">
                {formatDate(selectedSlot.date)} at {selectedSlot.timeSlot.startTime} - {selectedSlot.timeSlot.endTime}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">Please select a date and time slot to continue</p>
          )}
          
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={!selectedSlot}
              className={`
                px-8 py-3 rounded-xl text-white font-bold transition-all duration-300 transform hover:scale-105 relative overflow-hidden
                ${selectedSlot 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg hover:shadow-2xl' 
                  : 'bg-gray-300 cursor-not-allowed'
                }
              `}
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirm Booking
              </span>
              {selectedSlot && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}