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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Book a Lesson</h2>
              <p className="text-blue-100 mt-1">with {teacherName}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Select a Date and Time</h3>
              
              {/* Calendar Navigation */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={goToPreviousMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Previous month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button 
                  onClick={goToToday}
                  className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Today
                </button>
                
                <h4 className="text-lg font-medium text-gray-800 min-w-[180px] text-center">
                  {formatMonthYear(currentDate)}
                </h4>
                
                <button 
                  onClick={goToNextMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Next month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Calendar View */}
            <div className="mb-8">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day) => {
                  const isCurrentMonth = new Date(day.date).getMonth() === currentDate.getMonth();
                  const isSelected = selectedDate === day.date;
                  const hasAvailableSlots = day.timeSlots.some(slot => slot.isAvailable);
                  
                  return (
                    <button
                      key={day.date}
                      onClick={() => handleDateClick(day.date)}
                      className={`
                        h-12 rounded-lg flex flex-col items-center justify-center text-sm transition-all
                        ${isSelected 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : isCurrentMonth
                            ? hasAvailableSlots
                              ? 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
                              : 'bg-gray-50 text-gray-400 border border-gray-100'
                            : 'bg-gray-50 text-gray-300 border border-gray-100'
                        }
                      `}
                    >
                      <span className={isSelected ? 'text-white' : isCurrentMonth ? '' : 'text-gray-300'}>
                        {new Date(day.date).getDate()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Time Slots for Selected Date */}
            {selectedDate && (
              <div className="mt-8">
                <h4 className="text-md font-semibold text-gray-800 mb-4">
                  Available Times for {formatDate(selectedDate)}
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {selectedDateSlots.map((timeSlot) => (
                    <button
                      key={timeSlot.id}
                      onClick={() => handleSlotClick(selectedDate, timeSlot)}
                      disabled={!timeSlot.isAvailable}
                      className={`
                        py-3 px-2 rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all
                        ${selectedSlot?.timeSlot.id === timeSlot.id
                          ? 'bg-blue-500 text-white shadow-md'
                          : timeSlot.isAvailable
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 hover:shadow'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      <span>{timeSlot.startTime}</span>
                      <span className="text-xs mt-1">
                        {timeSlot.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-emerald-100 rounded mr-2 border border-emerald-300"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 rounded mr-2 border border-gray-300"></div>
              <span className="text-sm text-gray-600">Unavailable</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Selected</span>
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          {selectedSlot ? (
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-600">Selected slot:</p>
              <p className="font-medium">
                {formatDate(selectedSlot.date)} at {selectedSlot.timeSlot.startTime} - {selectedSlot.timeSlot.endTime}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Please select a date and time slot</p>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={!selectedSlot}
              className={`
                px-5 py-2.5 rounded-lg text-white font-medium transition-all
                ${selectedSlot 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg' 
                  : 'bg-gray-300 cursor-not-allowed'
                }
              `}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}