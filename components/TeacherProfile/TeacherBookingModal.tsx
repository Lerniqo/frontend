"use client";

import React, { useState, useEffect } from "react";
import { DaySchedule, TimeSlot, SelectedSlot } from "@/types/auth.types";
import { TeacherAvailability, Session, getTeacherAvailability } from "@/services/schedulingService";
import PayForBookingModal from "./PayForBookingModal";

interface TeacherBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  teacherId: string;
  onSlotSelect: (slot: SelectedSlot) => void;
  availabilities: TeacherAvailability[];
  mySessions: Session[];
  loading: boolean;
}

// Convert teacher availability data to calendar format
const convertAvailabilityToSchedule = (
  availabilities: TeacherAvailability[],
  currentDate: Date,
  mySessions: Session[],
  teacherId: string
): DaySchedule[] => {
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

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());

  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

  const currentDateIter = new Date(startDate);

  // Create a map of date -> availability slots
  const availabilityMap = new Map<string, TeacherAvailability[]>();
  availabilities.forEach((avail) => {
    const dateKey = new Date(avail.start_time).toISOString().split("T")[0];
    if (!availabilityMap.has(dateKey)) {
      availabilityMap.set(dateKey, []);
    }
    availabilityMap.get(dateKey)?.push(avail);
  });

  // Create a map of date -> user's booked sessions for this teacher
  const bookedSessionsByDate = new Map<string, Session[]>();
  mySessions
    .filter(
      (session) =>
        session.teacher_id === teacherId && session.status === "SCHEDULED"
    )
    .forEach((session) => {
      const dateKey = new Date(session.start_time).toISOString().split("T")[0];
      if (!bookedSessionsByDate.has(dateKey)) {
        bookedSessionsByDate.set(dateKey, []);
      }
      bookedSessionsByDate.get(dateKey)?.push(session);
    });

  // Helper function to check if a session overlaps with an availability slot
  const hasSessionOverlap = (
    availStart: Date,
    availEnd: Date,
    dateKey: string
  ): boolean => {
    const sessionsOnDate = bookedSessionsByDate.get(dateKey) || [];

    return sessionsOnDate.some((session) => {
      const sessionStart = new Date(session.start_time);
      const sessionEnd = new Date(session.end_time);

      // Check if times overlap
      // Sessions overlap if: sessionStart < availEnd AND sessionEnd > availStart
      const overlaps = sessionStart < availEnd && sessionEnd > availStart;

      return overlaps;
    });
  };

  // Helper function to format time
  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;
  };

  while (currentDateIter <= endDate) {
    const dateKey = currentDateIter.toISOString().split("T")[0];
    const dayAvailabilities = availabilityMap.get(dateKey) || [];

    const timeSlots: TimeSlot[] = dayAvailabilities.map((avail) => {
      const startTime = new Date(avail.start_time);
      const endTime = new Date(avail.end_time);
      const isAlreadyBooked = hasSessionOverlap(startTime, endTime, dateKey);

      return {
        id: avail.availability_id,
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        isAvailable: !avail.is_booked,
        price: avail.price_per_session,
        description: avail.session_description,
        isPaid: avail.is_paid,
        isBookedByUser: isAlreadyBooked,
        availabilityId: avail.availability_id,
      };
    });

    schedule.push({
      date: dateKey,
      dayOfWeek: days[currentDateIter.getDay()],
      timeSlots,
    });

    currentDateIter.setDate(currentDateIter.getDate() + 1);
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
  teacherId,
  onSlotSelect,
  availabilities,
  mySessions,
  loading,
}: TeacherBookingModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 15)); // October 15, 2025 (month is 0-indexed)
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [_refreshingAvailability, setRefreshingAvailability] = useState(false);
  const [dayAvailabilities, setDayAvailabilities] = useState<TeacherAvailability[]>([]);

  // Generate schedule from availability data
  useEffect(() => {
    if (isOpen && availabilities.length > 0) {
      const scheduleData = convertAvailabilityToSchedule(
        availabilities,
        currentDate,
        mySessions,
        teacherId
      );
      setSchedule(scheduleData);
      setSelectedSlot(null);
      setSelectedDate(null);
    } else if (isOpen) {
      // If no availabilities, create empty schedule
      const scheduleData = convertAvailabilityToSchedule(
        [],
        currentDate,
        mySessions,
        teacherId
      );
      setSchedule(scheduleData);
    }
  }, [isOpen, currentDate, availabilities, mySessions, teacherId]);

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

  const handleDateClick = async (date: string) => {
    try {
      setError(null);
      setRefreshingAvailability(true);

      // Fetch fresh availability data from API for this teacher
      const freshAvailabilities = await getTeacherAvailability(teacherId);

      // Filter availabilities for the selected date
      const dateKey = date; // date is already in YYYY-MM-DD format
      const dayAvailabilities = freshAvailabilities.filter((avail) => {
        const availDate = new Date(avail.start_time).toISOString().split("T")[0];
        return availDate === dateKey && !avail.is_booked; // Only show non-booked slots
      });

      if (dayAvailabilities.length > 0) {
        setSelectedDate(date);
        setDayAvailabilities(dayAvailabilities);
        setSelectedSlot(null);
        setError(null);
      } else {
        setError(`No available time slots for this teacher on ${date}`);
        setSelectedDate(null);
        setDayAvailabilities([]);
      }
    } catch (err) {
      console.error("Error fetching availability:", err);
      setError("Failed to load available time slots for this date");
      setSelectedDate(null);
      setDayAvailabilities([]);
    } finally {
      setRefreshingAvailability(false);
    }
  };

  const handleConfirmAvailability = () => {
    if (selectedSlot) {
      // Open payment modal instead of directly confirming
      setShowPaymentModal(true);
    } else {
      setError("Please select a date and time slot.");
    }
  };

  const handleBookingComplete = () => {
    // Called after successful booking in PayForBookingModal
    if (selectedSlot) {
      onSlotSelect(selectedSlot);
    }
    setShowPaymentModal(false);
    onClose();
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
    setCurrentDate(new Date(2025, 9, 15)); // October 15, 2025
  };

  // Filter slots for selected date
  const getSlotsForSelectedDate = () => {
    if (!selectedDate || dayAvailabilities.length === 0) return [];

    // Format times from the API availability data
    const formatTime = (date: Date): string => {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")} ${period}`;
    };

    return dayAvailabilities.map((avail) => ({
      id: avail.availability_id,
      startTime: formatTime(new Date(avail.start_time)),
      endTime: formatTime(new Date(avail.end_time)),
      isAvailable: !avail.is_booked,
      price: avail.price_per_session,
      description: avail.session_description,
      isPaid: avail.is_paid,
      isBookedByUser: false, // These are fresh from API, not booked by user
      availabilityId: avail.availability_id,
    }));
  };

  if (!isOpen) return null;

  const calendarDays = schedule.slice(0, 42); // 6 weeks max
  const selectedDateSlots = getSlotsForSelectedDate();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-auto flex flex-col border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-blue-600 p-8 text-white relative">
          <div className="absolute inset-0 opacity-20 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-1/2 -left-8 w-24 h-24 bg-white/30 rounded-full"></div>
          </div>

          <div className="relative z-10 flex flex-wrap justify-between items-start gap-4 min-w-0">
            <div className="min-w-0 w-full sm:w-auto flex-1">
              <h2 className="text-3xl font-bold mb-2 break-words w-full">Set Availability</h2>
              <p className="text-purple-100 text-lg break-words whitespace-normal w-full">for {teacherName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-all duration-300 p-2 rounded-full hover:bg-white/20 group flex-shrink-0"
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
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent mb-4"></div>
                <p className="text-gray-600 font-medium">
                  Loading availability...
                </p>
              </div>
            </div>
          )}

          {error && !loading && (
            <p className="text-center text-red-600 mb-4 p-4 bg-red-50 rounded-lg">
              {error}
            </p>
          )}

          {!loading && (
            <>
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
                        new Date(day.date).getMonth() ===
                        currentDate.getMonth();
                      const isSelected = selectedDate === day.date;
                      const hasAvailableSlots = day.timeSlots.some(
                        (slot) => slot.isAvailable
                      );
                      const hasBookedSessions = day.timeSlots.some(
                        (slot) => slot.isBookedByUser
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
                          {/* Green dot for available slots */}
                          {hasAvailableSlots &&
                            isCurrentMonth &&
                            !isSelected &&
                            !hasBookedSessions && (
                              <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>
                            )}
                          {/* Blue checkmark badge for days with booked sessions */}
                          {hasBookedSessions &&
                            isCurrentMonth &&
                            !isSelected && (
                              <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                                <svg
                                  className="w-2.5 h-2.5 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          {/* If selected, show checkmark for booked sessions */}
                          {hasBookedSessions && isSelected && (
                            <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
                              <svg
                                className="w-2.5 h-2.5 text-blue-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
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
                          onClick={() =>
                            handleSlotClick(selectedDate, timeSlot)
                          }
                          disabled={
                            !timeSlot.isAvailable || timeSlot.isBookedByUser
                          }
                          title={timeSlot.description || ""}
                          className={`
                        py-4 px-3 rounded-xl flex flex-col items-center justify-center text-sm font-semibold transition-all duration-300 transform hover:scale-105 border-2 relative
                        ${
                          timeSlot.isBookedByUser
                            ? "bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-800 border-blue-300 cursor-default"
                            : selectedSlot?.timeSlot.id === timeSlot.id
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
                              timeSlot.isBookedByUser
                                ? "text-blue-700"
                                : selectedSlot?.timeSlot.id === timeSlot.id
                                ? "text-purple-100"
                                : timeSlot.isAvailable
                                ? "text-emerald-600"
                                : "text-gray-400"
                            }`}
                          >
                            {timeSlot.isBookedByUser
                              ? "Already Booked"
                              : timeSlot.isAvailable
                              ? "Available"
                              : "Unavailable"}
                          </span>
                          {!timeSlot.isBookedByUser &&
                            timeSlot.price !== null &&
                            timeSlot.price !== undefined && (
                              <span
                                className={`text-xs mt-1 font-bold ${
                                  selectedSlot?.timeSlot.id === timeSlot.id
                                    ? "text-purple-100"
                                    : timeSlot.isAvailable
                                    ? "text-emerald-700"
                                    : "text-gray-400"
                                }`}
                              >
                                ${timeSlot.price.toFixed(2)}
                              </span>
                            )}
                          {!timeSlot.isBookedByUser &&
                            timeSlot.price === null &&
                            timeSlot.isPaid === false && (
                              <span
                                className={`text-xs mt-1 font-bold ${
                                  selectedSlot?.timeSlot.id === timeSlot.id
                                    ? "text-purple-100"
                                    : timeSlot.isAvailable
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }`}
                              >
                                Free
                              </span>
                            )}
                          {timeSlot.isBookedByUser && (
                            <div className="absolute top-1 right-1">
                              <svg
                                className="w-5 h-5 text-blue-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                          {!timeSlot.isBookedByUser && timeSlot.description && (
                            <div className="absolute top-1 right-1">
                              <svg
                                className={`w-4 h-4 ${
                                  selectedSlot?.timeSlot.id === timeSlot.id
                                    ? "text-purple-100"
                                    : timeSlot.isAvailable
                                    ? "text-emerald-600"
                                    : "text-gray-400"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
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
                    Available Slots
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gray-100 rounded-lg mr-3 border-2 border-gray-200"></div>
                  <span className="text-sm font-medium text-gray-700">
                    No Slots
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-white rounded-lg mr-3 border-2 border-gray-200 relative">
                    <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shadow-md transform translate-x-1 -translate-y-1">
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Has Booked Session
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Selected Day
                  </span>
                </div>
              </div>
            </>
          )}
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
              {selectedSlot.timeSlot.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {selectedSlot.timeSlot.description}
                </p>
              )}
              {selectedSlot.timeSlot.price !== null &&
                selectedSlot.timeSlot.price !== undefined && (
                  <p className="text-sm font-semibold text-purple-600 mt-1">
                    Price: ${selectedSlot.timeSlot.price.toFixed(2)}
                  </p>
                )}
              {selectedSlot.timeSlot.price === null &&
                selectedSlot.timeSlot.isPaid === false && (
                  <p className="text-sm font-semibold text-green-600 mt-1">
                    Free Session
                  </p>
                )}
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

      {/* Payment Modal */}
      {selectedSlot && (
        <PayForBookingModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          slotDetails={{
            date: selectedSlot.date,
            startTime: selectedSlot.timeSlot.startTime,
            endTime: selectedSlot.timeSlot.endTime,
            price: selectedSlot.timeSlot.price ?? null,
            isPaid: selectedSlot.timeSlot.isPaid ?? false,
            description: selectedSlot.timeSlot.description ?? "",
            availabilityId:
              selectedSlot.timeSlot.availabilityId ?? selectedSlot.timeSlot.id,
          }}
          teacherDetails={{
            teacherId: teacherId,
            teacherName: teacherName,
          }}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  );
}
