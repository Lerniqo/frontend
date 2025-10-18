"use client";

import React, { useState } from "react";
import {
  createNewGroupSession,
  CreateGroupSessionRequest,
} from "@/services/teacherDashboardService";

interface CreateGroupSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionCreated: () => void;
}

export default function CreateGroupSessionModal({
  isOpen,
  onClose,
  onSessionCreated,
}: CreateGroupSessionModalProps) {
  const [formData, setFormData] = useState<CreateGroupSessionRequest>({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    isPaid: false,
    price: 0,
    maxAttendees: 10,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const { name, value, type } = target;

    if (type === "checkbox") {
      const checked = (target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "maxAttendees" ? parseInt(value) : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }
      if (!formData.startTime) {
        throw new Error("Start time is required");
      }
      if (!formData.endTime) {
        throw new Error("End time is required");
      }
      if (new Date(formData.startTime) >= new Date(formData.endTime)) {
        throw new Error("End time must be after start time");
      }
      if (formData.maxAttendees < 1) {
        throw new Error("Max attendees must be at least 1");
      }
      if (formData.isPaid && formData.price <= 0) {
        throw new Error("Price must be greater than 0 for paid sessions");
      }

      // Convert datetime-local format to ISO string with Z timezone
      const convertToISO = (datetimeLocal: string) => {
        const date = new Date(datetimeLocal);
        return date.toISOString();
      };

      // For free sessions, set price to 0.01 as backend requires positive number
      const finalPrice = formData.isPaid ? formData.price : 0.01;

      const requestData = {
        ...formData,
        price: finalPrice,
        startTime: convertToISO(formData.startTime),
        endTime: convertToISO(formData.endTime),
      };

      // Create the session
      const response = await createNewGroupSession(requestData);

      if (!response.success) {
        throw new Error(response.message || "Failed to create group session");
      }

      setSuccess(true);
      // Reset form
      setFormData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        isPaid: false,
        price: 0,
        maxAttendees: 10,
      });

      // Notify parent component and close modal after a short delay
      setTimeout(() => {
        onSessionCreated();
        onClose();
      }, 1000);
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      setError(errMessage || "An error occurred while creating the session");
      console.error("Error creating group session:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        ></div>

        {/* Modal */}
        <div className="relative z-50 w-full max-w-2xl mx-auto transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-4 sm:px-8">
            <h3 className="text-xl font-bold text-white">
              Create New Group Session
            </h3>
            <p className="mt-1 text-sm text-purple-100">
              Set up a new group session for your students
            </p>
          </div>

          {/* Form Content */}
          <form
            onSubmit={handleSubmit}
            className="px-6 py-8 sm:px-8 max-h-[70vh] overflow-y-auto"
          >
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                <p className="text-sm text-green-800">
                  Group session created successfully!
                </p>
              </div>
            )}

            {/* Title */}
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-900"
              >
                Session Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Advanced JavaScript Workshop"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-900"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what your students will learn..."
                rows={4}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                disabled={loading}
              />
            </div>

            {/* Start and End Time */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  disabled={loading}
                />
              </div>
              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-semibold text-gray-900"
                >
                  End Time
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Max Attendees */}
            <div className="mb-6">
              <label
                htmlFor="maxAttendees"
                className="block text-sm font-semibold text-gray-900"
              >
                Maximum Attendees
              </label>
              <input
                type="number"
                id="maxAttendees"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleInputChange}
                min="1"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                disabled={loading}
              />
            </div>

            {/* Is Paid Checkbox */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPaid"
                  checked={formData.isPaid}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  disabled={loading}
                />
                <span className="ml-3 text-sm font-semibold text-gray-900">
                  This is a paid session
                </span>
              </label>
            </div>

            {/* Price (shown only if isPaid is true) */}
            {formData.isPaid && (
              <div className="mb-6">
                <label
                  htmlFor="price"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Price (USD)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  placeholder="49.99"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  disabled={loading}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white hover:from-purple-700 hover:to-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Session"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
