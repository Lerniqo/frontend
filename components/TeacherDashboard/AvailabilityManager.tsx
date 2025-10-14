"use client";

import React, { useState } from "react";
import {
  AvailabilitySlot,
  updateAvailability,
} from "@/services/teacherDashboardService";

interface AvailabilityManagerProps {
  availability: AvailabilitySlot[];
  setAvailability: (slots: AvailabilitySlot[]) => void;
}

export default function AvailabilityManager({
  availability,
  setAvailability,
}: AvailabilityManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempAvailability, setTempAvailability] =
    useState<AvailabilitySlot[]>(availability);
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

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
    if (!selectedDate || !startTime || !endTime) {
      alert("Please fill in all fields");
      return;
    }

    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDateObj < today) {
      alert("Please select a future date");
      return;
    }

    if (startTime >= endTime) {
      alert("End time must be after start time");
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
    };

    setTempAvailability((prev) => [...prev, newSlot]);
    setSelectedDate("");
    setStartTime("");
    setEndTime("");
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
      console.error("Error updating availability:", error);
    }
  };

  const handleCancel = () => {
    setTempAvailability(availability);
    setIsEditing(false);
    setShowAddForm(false);
    setSelectedDate("");
    setStartTime("");
    setEndTime("");
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
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:scale-105"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 shadow-lg hover:scale-105"
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
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
                    Start Time
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
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddSlot}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:scale-105"
                >
                  Add Slot
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
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
              <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">
                {slot.startTime} - {slot.endTime}
              </p>
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
