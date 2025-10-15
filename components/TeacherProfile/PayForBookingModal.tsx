"use client";

import React, { useState } from "react";
import { BookOneOnOneSession } from "@/services/schedulingService";

interface PayForBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  slotDetails: {
    date: string;
    startTime: string;
    endTime: string;
    price: number | null;
    isPaid: boolean;
    description: string;
    availabilityId: string;
  };
  teacherDetails: {
    teacherId: string;
    teacherName: string;
  };
  onBookingComplete: () => void;
}

const PayForBookingModal: React.FC<PayForBookingModalProps> = ({
  isOpen,
  onClose,
  slotDetails,
  teacherDetails,
  onBookingComplete,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFreeSession =
    !slotDetails.isPaid ||
    slotDetails.price === null ||
    slotDetails.price === 0;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // Validate credit card details if it's a paid session
      if (!isFreeSession) {
        if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
          setError("Please fill in all payment details");
          setIsProcessing(false);
          return;
        }

        // Basic validation
        if (cardNumber.replace(/\s/g, "").length !== 16) {
          setError("Please enter a valid 16-digit card number");
          setIsProcessing(false);
          return;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
          setError("Please enter expiry date in MM/YY format");
          setIsProcessing(false);
          return;
        }

        if (cvv.length !== 3 && cvv.length !== 4) {
          setError("Please enter a valid CVV");
          setIsProcessing(false);
          return;
        }
      }

      // Call the booking function
      await BookOneOnOneSession({
        teacherId: teacherDetails.teacherId,
        availabilityId: slotDetails.availabilityId,
        startTime: `${slotDetails.date}T${slotDetails.startTime}`,
        endTime: `${slotDetails.date}T${slotDetails.endTime}`,
        price: slotDetails.price,
        isPaid: slotDetails.isPaid,
        paymentDetails: isFreeSession
          ? null
          : {
              cardNumber,
              expiryDate,
              cvv,
              cardholderName,
            },
      });

      // Success
      onBookingComplete();
      onClose();

      // Reload the page to fetch updated data
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book session");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(" ");
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (/^\d*$/.test(value) && value.length <= 16) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setExpiryDate(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setCvv(value);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #9333ea 0%, #2563eb 100%);
            border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #7e22ce 0%, #1d4ed8 100%);
          }

          /* For Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #9333ea transparent;
          }
        `}</style>
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {isFreeSession ? "Confirm Booking" : "Complete Payment"}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-300"
              disabled={isProcessing}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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

        <div className="p-6 space-y-6">
          {/* Session Details */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Session Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Teacher:</span>
                <span className="text-gray-900 font-semibold">
                  {teacherDetails.teacherName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Date:</span>
                <span className="text-gray-900 font-semibold">
                  {formatDate(slotDetails.date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Time:</span>
                <span className="text-gray-900 font-semibold">
                  {formatTime(slotDetails.startTime)} -{" "}
                  {formatTime(slotDetails.endTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Description:</span>
                <span className="text-gray-900 font-semibold text-right">
                  {slotDetails.description || "One-on-one tutoring session"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-purple-200">
                <span className="text-gray-700 font-bold text-lg">Total:</span>
                <span
                  className={`font-bold text-xl ${
                    isFreeSession ? "text-green-600" : "text-purple-600"
                  }`}
                >
                  {isFreeSession ? "FREE" : `$${slotDetails.price?.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start">
              <svg
                className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Payment Form - Only show if it's a paid session */}
          {!isFreeSession && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Payment Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none"
                      disabled={isProcessing}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none font-mono"
                      disabled={isProcessing}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none font-mono"
                        disabled={isProcessing}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none font-mono"
                        disabled={isProcessing}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Free Session Message */}
          {isFreeSession && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-green-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h4 className="font-bold text-green-800 text-lg">
                    This is a Free Session!
                  </h4>
                  <p className="text-green-700 text-sm mt-1">
                    No payment required. Click confirm to book your session.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isProcessing}
              className={`
                flex-1 px-6 py-3 rounded-xl text-white font-bold transition-all duration-300 transform hover:scale-105
                ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg hover:shadow-2xl"
                }
              `}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : isFreeSession ? (
                "Confirm Booking"
              ) : (
                `Pay $${slotDetails.price?.toFixed(2)} & Book`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayForBookingModal;
