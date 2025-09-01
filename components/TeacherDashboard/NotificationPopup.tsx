'use client';

import React from 'react';
import { Notification, markNotificationAsRead } from '@/services/teacherDashboardService';

interface NotificationPopupProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  isVisible: boolean;
  onClose: () => void;
}

export default function NotificationPopup({
  notifications,
  setNotifications,
  isVisible,
  onClose
}: NotificationPopupProps) {
  const handleMarkAsRead = async (id: string) => {
    try {
      const result = await markNotificationAsRead(id);
      if (result.success) {
        setNotifications(
          notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Notification Popup */}
      <div className="absolute top-20 right-4 w-96 max-h-96 bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 z-50 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:via-white/20 before:to-transparent before:rounded-3xl">
        <div className="relative z-10 p-6 border-b border-white/30 bg-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white drop-shadow-lg">Notifications</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:shadow-lg"
            >
              <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative z-10 max-h-80 overflow-y-auto bg-white/5 backdrop-blur-sm">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border border-white/30">
                <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12-1.21 12-2.683m-12 2.683a17.925 17.925 0 01-7.132-8.317M12 21c4.411 0 8-4.03 8-9s-3.589-9-8-9-8 4.03-8 9a9.06 9.06 0 001.832 5.683L4 21l4.868-8.317z" />
                </svg>
              </div>
              <p className="text-white/70 text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/20">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm ${
                    !notification.read ? 'bg-blue-500/20 border-l-2 border-blue-400' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'success' ? 'bg-green-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' :
                      notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white drop-shadow-sm truncate">
                        {notification.title}
                      </p>
                      <p className="text-sm text-white/80 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-white/60 mt-2">
                        {new Date(notification.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="flex-shrink-0 ml-2 px-3 py-1 bg-blue-600/80 backdrop-blur-sm text-white text-xs rounded-lg hover:bg-blue-700/90 transition-all duration-300 border border-blue-400/30 hover:border-blue-300/50 shadow-lg"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 5 && (
          <div className="relative z-10 p-4 border-t border-white/30 bg-white/10 backdrop-blur-sm">
            <button className="w-full text-center text-sm text-blue-300 hover:text-blue-200 font-medium transition-colors duration-300 drop-shadow-sm">
              View All Notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
}
