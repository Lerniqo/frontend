'use client';

import React from 'react';
import { Notification, markNotificationAsRead } from '@/services/teacherDashboardService';

interface NotificationsPanelProps {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
}

export default function NotificationsPanel({ notifications, setNotifications }: NotificationsPanelProps) {
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-yellow-500/20 backdrop-blur-xl rounded-xl border border-yellow-400/30">
            <svg className="w-8 h-8 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12-1.21 12-2.683m-12 2.683a17.925 17.925 0 01-7.132-8.317M12 21c4.411 0 8-4.03 8-9s-3.589-9-8-9-8 4.03-8 9a9.06 9.06 0 001.832 5.683L4 21l4.868-8.317z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Notifications</h3>
            <p className="text-slate-400 mt-1">Stay updated with latest activities</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
            {unreadCount} unread
          </div>
        )}
      </div>

      <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12-1.21 12-2.683m-12 2.683a17.925 17.925 0 01-7.132-8.317M12 21c4.411 0 8-4.03 8-9s-3.589-9-8-9-8 4.03-8 9a9.06 9.06 0 001.832 5.683L4 21l4.868-8.317z" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`group p-6 rounded-xl border-l-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                notification.read
                  ? 'bg-white/5 backdrop-blur-xl border-slate-500 hover:bg-white/10'
                  : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border-blue-400 hover:from-blue-500/20 hover:to-purple-500/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-xl border ${
                      notification.type === 'success' ? 'bg-green-500/20 text-green-300 border-green-400/30' :
                      notification.type === 'warning' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' :
                      notification.type === 'error' ? 'bg-red-500/20 text-red-300 border-red-400/30' : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                    }`}>
                      {notification.type === 'success' ? '✓' :
                       notification.type === 'warning' ? '⚠' :
                       notification.type === 'error' ? '✕' : 'ℹ'}
                    </span>
                    <h4 className="font-semibold text-white text-lg group-hover:text-blue-200 transition-colors duration-300">{notification.title}</h4>
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed mb-3 group-hover:text-white transition-colors duration-300">{notification.message}</p>
                  <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
                    {new Date(notification.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="ml-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
