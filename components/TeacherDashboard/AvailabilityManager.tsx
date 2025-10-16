"use client";

import React, { useState } from "react";
import {
  AvailabilitySlot,
  updateAvailability,
  TeacherSession,
} from "@/services/teacherDashboardService";
import { detectAllConflicts } from "@/utils/availabilityConflictDetector";

interface AvailabilityManagerProps {
  availability: AvailabilitySlot[];
  setAvailability: (slots: AvailabilitySlot[]) => void;
  sessions?: TeacherSession[];
}

export default function AvailabilityManager({
  availability,
  setAvailability,
  sessions = [],
}: AvailabilityManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempAvailability, setTempAvailability] =
    useState<AvailabilitySlot[]>(availability);
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [sessionDescription, setSessionDescription] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleToggleAvailability = (id: string) => {
    setTempAvailability((prev) =>
      prev.map((slot) =>
        slot.id === id ? { ...slot, isAvailable: !slot.isAvailable } : slot
      )
    );
  };

  const handleDeleteSlot = (id: string) => {
    setTempAvailability((prev) => prev.filter((slot) => slot.id !== id));
  };

  const handleAddSlot = () => {
    // Reset errors
    setFormError(null);

    // Validation
    if (!selectedDate || !startTime || !endTime) {
      setFormError("Please fill in all required fields");
      return;
    }

    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDateObj < today) {
      setFormError("Please select a future date");
      return;
    }

    if (startTime >= endTime) {
      setFormError("End time must be after start time");
      return;
    }

    // Validate price if isPaid is selected
    if (isPaid && (!price || price <= 0)) {
      setFormError("Please enter a valid price for paid sessions");
      return;
    }

    const dayName = selectedDateObj.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const newSlot: AvailabilitySlot = {
      id: Date.now().toString(),
      date: selectedDate,
      day: dayName,
      startTime,
      endTime,
      isAvailable: true,
      isPaid,
      price: isPaid ? price : null,
      sessionDescription: sessionDescription || null,
    };

    // Check for conflicts with existing availability and sessions
    const conflictCheck = detectAllConflicts(
      newSlot,
      tempAvailability,
      sessions
    );

    if (conflictCheck.conflict) {
      setFormError(conflictCheck.message);
      return;
    }

    setTempAvailability((prev) => [...prev, newSlot]);
    setSelectedDate("");
    setStartTime("");
    setEndTime("");
    setIsPaid(false);
    setPrice(null);
    setSessionDescription("");
    setShowAddForm(false);
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaveLoading(true);

    try {
      const result = await updateAvailability(tempAvailability);
      if (result.success) {
        setAvailability(tempAvailability);
        setIsEditing(false);
      } else {
        setSaveError(result.message || "Failed to save availability");
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      setSaveError("An error occurred while saving. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setTempAvailability(availability);
    setIsEditing(false);
    setShowAddForm(false);
    setSelectedDate("");
    setStartTime("");
    setEndTime("");
    setIsPaid(false);
    setPrice(null);
    setSessionDescription("");
    setFormError(null);
    setSaveError(null);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
            <svg
              className="w-8 h-8 text-purple-600"
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
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Set Your Availability
            </h3>
            <p className="text-gray-600 mt-1">Manage your teaching schedule</p>
          </div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Edit Schedule
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={saveLoading}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {saveLoading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      opacity="0.2"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={saveLoading}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Save Error Message */}
      {saveError && isEditing && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <svg
            className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-700 text-sm">{saveError}</p>
        </div>
      )}

      {isEditing && (
        <div className="mb-8">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-4 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-all duration-300 flex items-center justify-center space-x-3 group"
            >
              <svg
                className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="text-purple-700 font-medium">
                Add New Availability Slot
              </span>
            </button>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Time Slot
              </h4>

              {/* Error Message */}
              {formError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-700 text-sm">{formError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date *
                  </label>
                  <input
                    type="date"
                    min={getMinDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Session Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Description
                </label>
                <textarea
                  value={sessionDescription}
                  onChange={(e) => setSessionDescription(e.target.value)}
                  placeholder="E.g., Advanced Math tutoring, one-on-one consultation, etc."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                />
              </div>

              {/* Paid Session Section */}
              <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-gray-700 font-medium">
                    This is a paid session
                  </span>
                </label>

                {isPaid && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Session (USD) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={price || ""}
                      onChange={(e) =>
                        setPrice(
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      placeholder="Enter price"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleAddSlot}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:scale-105"
                >
                  Add Slot
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormError(null);
                  }}
                  className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 shadow-lg hover:scale-105"
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
          <div
            key={slot.id}
            className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  slot.isAvailable
                    ? "bg-green-500 shadow-lg shadow-green-500/30"
                    : "bg-red-500 shadow-lg shadow-red-500/30"
                }`}
              ></div>
              {isEditing && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleAvailability(slot.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                      slot.isAvailable
                        ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                        : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                    }`}
                  >
                    {slot.isAvailable ? "Available" : "Unavailable"}
                  </button>
                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-medium transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-purple-700 transition-colors duration-300">
                {slot.day}
              </h4>
              <p className="text-gray-600 text-sm mb-2 group-hover:text-gray-700 transition-colors duration-300">
                {formatDate(slot.date)}
              </p>
              <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors duration-300">
                {slot.startTime} - {slot.endTime}
              </p>

              {/* Session Description */}
              {slot.sessionDescription && (
                <p className="text-gray-700 text-sm mb-3 p-2 bg-blue-50 rounded border border-blue-100 italic">
                  &quot;{slot.sessionDescription}&quot;
                </p>
              )}

              {/* Pricing Info */}
              {slot.isPaid && (
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.16 2.75a.75.75 0 00-1.32 0l-.478 1.435A7.001 7.001 0 002.75 8.16l-1.435.478a.75.75 0 000 1.32l1.435.478a7.001 7.001 0 003.455 3.455l.478 1.435a.75.75 0 001.32 0l.478-1.435a7.001 7.001 0 003.455-3.455l1.435-.478a.75.75 0 000-1.32l-1.435-.478A7.001 7.001 0 008.638 2.75l-.478-1.435z" />
                    </svg>
                    <span className="text-green-700 font-semibold">
                      ${slot.price?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {(isEditing ? tempAvailability : availability).length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-200">
            <svg
              className="w-8 h-8 text-purple-600"
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Availability Set
          </h3>
          <p className="text-gray-600">
            Add your first availability slot to get started
          </p>
        </div>
      )}
    </div>
  );
}
