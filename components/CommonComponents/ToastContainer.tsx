"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (type: ToastType, message: string, duration: number = 5000) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = { id, type, message, duration };

      setToasts((prev) => [...prev, newToast]);

      // Auto-remove toast after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    },
    []
  );

  const success = useCallback(
    (message: string, duration?: number) =>
      showToast("success", message, duration),
    [showToast]
  );

  const error = useCallback(
    (message: string, duration?: number) =>
      showToast("error", message, duration),
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) =>
      showToast("warning", message, duration),
    [showToast]
  );

  const info = useCallback(
    (message: string, duration?: number) =>
      showToast("info", message, duration),
    [showToast]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (toastRef.current) {
      // Entrance animation
      gsap.fromTo(
        toastRef.current,
        { opacity: 0, x: 50, scale: 0.8 },
        { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, []);

  const handleRemove = () => {
    if (toastRef.current) {
      // Exit animation
      gsap.to(toastRef.current, {
        opacity: 0,
        x: 50,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => onRemove(toast.id),
      });
    } else {
      onRemove(toast.id);
    }
  };

  const getToastConfig = () => {
    switch (toast.type) {
      case "success":
        return {
          icon: CheckCircleIcon,
          bgClass: "bg-green-50 border-green-200",
          textClass: "text-green-800",
          iconClass: "text-green-500",
        };
      case "error":
        return {
          icon: XCircleIcon,
          bgClass: "bg-red-50 border-red-200",
          textClass: "text-red-800",
          iconClass: "text-red-500",
        };
      case "warning":
        return {
          icon: ExclamationCircleIcon,
          bgClass: "bg-yellow-50 border-yellow-200",
          textClass: "text-yellow-800",
          iconClass: "text-yellow-500",
        };
      case "info":
        return {
          icon: InformationCircleIcon,
          bgClass: "bg-blue-50 border-blue-200",
          textClass: "text-blue-800",
          iconClass: "text-blue-500",
        };
      default:
        return {
          icon: InformationCircleIcon,
          bgClass: "bg-gray-50 border-gray-200",
          textClass: "text-gray-800",
          iconClass: "text-gray-500",
        };
    }
  };

  const config = getToastConfig();
  const Icon = config.icon;

  return (
    <div
      ref={toastRef}
      className={`${config.bgClass} border rounded-lg shadow-lg p-4 flex items-start space-x-3 min-w-[320px] max-w-md backdrop-blur-sm`}
    >
      <Icon className={`h-6 w-6 ${config.iconClass} flex-shrink-0 mt-0.5`} />
      <p
        className={`${config.textClass} text-sm font-medium flex-1 break-words`}
      >
        {toast.message}
      </p>
      <button
        onClick={handleRemove}
        className={`${config.textClass} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Close notification"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ToastContainer;
