"use client";

import React, { useState, useEffect } from "react";
import { DaySchedule, TimeSlot, SelectedSlot } from "@/types/auth.types";

interface TeacherBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  teacherId: string;
  onSlotSelect: (slot: SelectedSlot) => void;
}

// Mock data generator for one-hour time slots
const generateMockAvailability = (date: Date): DaySchedule[] => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const schedule: DaySchedule[] = [];

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());

  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const timeSlots: TimeSlot[] = [];

    // Generate one-hour time slots from 8:00 AM to 6:00 PM
    for (let hour = 8; hour < 18; hour++) {
      const startHour = hour % 12 === 0 ? 12 : hour % 12;
      const period = hour < 12 ? "AM" : "PM";
      const startTime = `${startHour.toString().padStart(2, "0")}:00 ${period}`;
      const endHour = (hour + 1) % 12 === 0 ? 12 : (hour + 1) % 12;
      const endPeriod = hour + 1 < 12 ? "AM" : "PM";
      const endTime = `${endHour.toString().padStart(2, "0")}:00 ${endPeriod}`;

      timeSlots.push({
        id: `${currentDate.toISOString().split("T")[0]}-${hour}:00`,
        startTime,
        endTime,
        isAvailable: Math.random() > 0.3, // 70% chance of being available
      });
    }

    schedule.push({
      date: currentDate.toISOString().split("T")[0],
      dayOfWeek: days[currentDate.getDay()],
      timeSlots,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedule;
};

// Format date as "Month Year"
const formatMonthYear = (date: Date) => {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

export default function TeacherBookingModal({
  isOpen,
  onClose,
  teacherName,
  teacherId: _teacherId,
  onSlotSelect,
}: TeacherBookingModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 9)); // September 09, 2025
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate mock data
  useEffect(() => {
    if (isOpen) {
      const mockSchedule = generateMockAvailability(currentDate);
      setSchedule(mockSchedule);
      setSelectedSlot(null);
      setSelectedDate(null);
      setError(null);
    }
  }, [isOpen, currentDate]);

  // Handle modal close and scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSlotClick = (date: string, timeSlot: TimeSlot) => {
    if (timeSlot.isAvailable) {
      setSelectedSlot({ date, timeSlot });
      setError(null);
    } else {
      setError("This time slot is not available.");
    }
  };

  const handleDateClick = (date: string) => {
    const day = schedule.find((d) => d.date === date);
    if (day && day.timeSlots.some((slot) => slot.isAvailable)) {
      setSelectedDate(date);
      setSelectedSlot(null);
      setError(null);
    } else {
      setError("This day has no available time slots.");
    }
  };

  const handleConfirmAvailability = () => {
    if (selectedSlot) {
      onSlotSelect(selectedSlot);
      onClose();
    } else {
      setError("Please select a date and time slot.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date(2025, 8, 9));
  };

  // Filter slots for selected date
  const getSlotsForSelectedDate = () => {
    if (!selectedDate) return [];
    const daySchedule = schedule.find((day) => day.date === selectedDate);
    return daySchedule ? daySchedule.timeSlots : [];
  };

  if (!isOpen) return null;

  const calendarDays = schedule.slice(0, 42); // 6 weeks max
  const selectedDateSlots = getSlotsForSelectedDate();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-blue-600 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-1/2 -left-8 w-24 h-24 bg-white/30 rounded-full"></div>
          </div>

          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">Set Availability</h2>
              <p className="text-purple-100 text-lg">for {teacherName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-all duration-300 p-2 rounded-full hover:bg-white/20 group"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 transform group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-auto p-8">
          {error && <p className="text-center text-red-600 mb-4">{error}</p>}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Select Date and Time Slot
              </h3>

              <div className="flex items-center gap-3">
                <button
                  onClick={goToPreviousMonth}
                  className="p-3 rounded-xl hover:bg-purple-50 transition-all duration-300 group border border-purple-100"
                  aria-label="Previous month"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-600 group-hover:-translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-600 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Calendar View */}
            <div className="mb-10">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-bold text-purple-600 py-3 bg-purple-50 rounded-lg"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => {
                  const isCurrentMonth =
                    new Date(day.date).getMonth() === currentDate.getMonth();
                  const isSelected = selectedDate === day.date;
                  const hasAvailableSlots = day.timeSlots.some(
                    (slot) => slot.isAvailable
                  );

                  return (
                    <button
                      key={day.date}
                      onClick={() => handleDateClick(day.date)}
                      className={`
                        h-14 rounded-xl flex flex-col items-center justify-center text-sm font-semibold transition-all duration-300 transform hover:scale-105 relative
                        ${
                          isSelected
                            ? "bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg"
                            : isCurrentMonth
                            ? hasAvailableSlots
                              ? "bg-white text-gray-800 hover:bg-purple-50 border-2 border-purple-200 shadow-md hover:shadow-lg"
                              : "bg-gray-50 text-gray-400 border-2 border-gray-200 cursor-not-allowed"
                            : "bg-gray-50 text-gray-300 border-2 border-gray-100 cursor-not-allowed"
                        }
                      `}
                      disabled={!hasAvailableSlots}
                    >
                      <span
                        className={
                          isSelected
                            ? "text-white"
                            : isCurrentMonth
                            ? ""
                            : "text-gray-300"
                        }
                      >
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
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  Available Time Slots for {formatDate(selectedDate)}
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {selectedDateSlots.map((timeSlot) => (
                    <button
                      key={timeSlot.id}
                      onClick={() => handleSlotClick(selectedDate, timeSlot)}
                      disabled={!timeSlot.isAvailable}
                      className={`
                        py-4 px-3 rounded-xl flex flex-col items-center justify-center text-sm font-semibold transition-all duration-300 transform hover:scale-105 border-2
                        ${
                          selectedSlot?.timeSlot.id === timeSlot.id
                            ? "bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg border-purple-600"
                            : timeSlot.isAvailable
                            ? "bg-gradient-to-br from-green-50 to-emerald-50 text-emerald-800 hover:from-green-100 hover:to-emerald-100 hover:shadow-lg border-emerald-200"
                            : "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200"
                        }
                      `}
                    >
                      <span className="text-base font-bold">
                        {timeSlot.startTime} - {timeSlot.endTime}
                      </span>
                      <span
                        className={`text-xs mt-1 ${
                          selectedSlot?.timeSlot.id === timeSlot.id
                            ? "text-purple-100"
                            : timeSlot.isAvailable
                            ? "text-emerald-600"
                            : "text-gray-400"
                        }`}
                      >
                        {timeSlot.isAvailable ? "Available" : "Unavailable"}
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
              <span className="text-sm font-medium text-gray-700">
                Available
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-gray-100 rounded-lg mr-3 border-2 border-gray-200"></div>
              <span className="text-sm font-medium text-gray-700">
                Unavailable
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg mr-3"></div>
              <span className="text-sm font-medium text-gray-700">
                Selected
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-purple-50/30 px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-purple-100">
          {selectedSlot ? (
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-purple-600 mb-1">
                Selected slot:
              </p>
              <p className="font-bold text-lg text-gray-800">
                {formatDate(selectedSlot.date)} at{" "}
                {selectedSlot.timeSlot.startTime} -{" "}
                {selectedSlot.timeSlot.endTime}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">
              Please select a date and time slot to continue
            </p>
          )}

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAvailability}
              disabled={!selectedSlot}
              className={`
                px-8 py-3 rounded-xl text-white font-bold transition-all duration-300 transform hover:scale-105 relative overflow-hidden
                ${
                  selectedSlot
                    ? "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg hover:shadow-2xl"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
            >
              <span className="relative z-10 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Confirm Availability
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
