'use client'

import { useRouter, usePathname } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import { 
  LayoutDashboard,
  Users, 
  BookOpen, 
  BarChart3, 
  Bell,
  User,
  Menu,
  X,
  Settings,
  LogOut
} from 'lucide-react'
import AdminFooter from '@/components/AdminDashboard/AdminFooter'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationPopup(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'user-management', label: 'User Management', icon: Users, path: '/user-management' },
    { id: 'content', label: 'Content Management', icon: BookOpen, path: '/content' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' }
  ]

  const isActiveRoute = (path: string) => {
    return pathname.includes(path)
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsSidebarOpen(false)
  }

  // Sample notification data
  const notifications = [
    {
      id: 1,
      type: 'user',
      title: 'New user registration',
      message: 'John Doe has registered as a student',
      time: '2 minutes ago',
      unread: true,
      color: 'blue'
    },
    {
      id: 2,
      type: 'content',
      title: 'Content approved',
      message: 'Mathematics lesson has been approved',
      time: '1 hour ago',
      unread: true,
      color: 'green'
    },
    {
      id: 3,
      type: 'system',
      title: 'System update',
      message: 'Platform maintenance scheduled for tonight',
      time: '3 hours ago',
      unread: true,
      color: 'yellow'
    },
    {
      id: 4,
      type: 'analytics',
      title: 'Weekly report ready',
      message: 'Your weekly analytics report is ready for review',
      time: '1 day ago',
      unread: false,
      color: 'purple'
    }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  const handleProfileAction = (action: string) => {
    setShowProfileDropdown(false)
    switch (action) {
      case 'profile':
        router.push('/profile')
        break
      case 'dashboard':
        router.push('/dashboard')
        break
      case 'settings':
        router.push('/settings')
        break
      case 'logout':
        // Handle logout logic here
        console.warn('Logging out...')
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex flex-col">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.2),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_70%)]"></div>

      {/* Animated gradient mesh */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Navigation Header */}
      <nav className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6 lg:space-x-8">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wider font-sans bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg hover:from-blue-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-300 hover:drop-shadow-xl">
                  Lerniqo Admin
                </div>
              </div>
            </div>

            {/* Desktop Navigation Menu */}
            <div className="hidden lg:flex space-x-3 xl:space-x-4">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`group relative flex items-center space-x-3 px-5 py-3 lg:px-6 lg:py-3 rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 overflow-hidden ${
                      isActiveRoute(item.path)
                        ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white shadow-2xl shadow-purple-500/30 scale-105 ring-2 ring-white/20'
                        : 'text-slate-200 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:shadow-lg'
                    }`}
                  >
                    <div className={`text-lg lg:text-xl transition-transform duration-300 ${
                      isActiveRoute(item.path) ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="relative z-10 font-medium">{item.label}</span>
                    {isActiveRoute(item.path) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-xl"></div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Notification Icon */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => {
                    setShowNotificationPopup(!showNotificationPopup);
                    setShowProfileDropdown(false);
                  }}
                  className="relative p-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 group hover:shadow-lg"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse shadow-lg ring-2 ring-white/30">
                      {unreadCount}
                    </div>
                  )}
                </button>

                {/* Notification Popup */}
                {showNotificationPopup && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in-0 duration-200">
                    <div className="p-4 border-b border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-1">Notifications</h3>
                      <p className="text-sm text-slate-300">
                        You have {unreadCount} {unreadCount === 1 ? 'new notification' : 'new notifications'}
                      </p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {/* Notification Items */}
                      {notifications.map((notification, index) => (
                        <div 
                          key={notification.id}
                          className={`p-3 hover:bg-white/5 transition-all duration-200 border-b border-white/5 ${
                            notification.unread ? 'bg-white/5' : ''
                          } animate-in slide-in-from-right-4 fade-in-0`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              notification.color === 'blue' ? 'bg-blue-500' :
                              notification.color === 'green' ? 'bg-green-500' :
                              notification.color === 'yellow' ? 'bg-yellow-500' :
                              'bg-purple-500'
                            } ${notification.unread ? 'animate-pulse' : ''}`}></div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                notification.unread ? 'text-white' : 'text-slate-200'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-slate-300 mt-1">{notification.message}</p>
                              <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                            </div>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2 animate-pulse"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-white/10 flex space-x-2">
                      <button className="flex-1 text-center text-sm text-blue-400 hover:text-blue-300 transition-all duration-200 font-medium py-2 px-3 rounded-lg hover:bg-blue-500/10 hover:scale-105">
                        Mark all as read
                      </button>
                      <button className="flex-1 text-center text-sm text-slate-300 hover:text-white transition-all duration-200 font-medium py-2 px-3 rounded-lg hover:bg-white/5 hover:scale-105">
                        View all
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Icon */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setShowProfileDropdown(!showProfileDropdown);
                    setShowNotificationPopup(false);
                  }}
                  className="relative p-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 group hover:shadow-lg"
                >
                  <User className="w-6 h-6" />
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-64 backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in-0 duration-200">
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Admin User</p>
                          <p className="text-xs text-slate-300">admin@lerniqo.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <button 
                        onClick={() => handleProfileAction('profile')}
                        className="w-full px-4 py-3 text-left text-sm text-slate-200 hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center space-x-3 hover:scale-105 hover:pl-5"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </button>
                      <button 
                        onClick={() => handleProfileAction('dashboard')}
                        className="w-full px-4 py-3 text-left text-sm text-slate-200 hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center space-x-3 hover:scale-105 hover:pl-5"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </button>
                      <button 
                        onClick={() => handleProfileAction('settings')}
                        className="w-full px-4 py-3 text-left text-sm text-slate-200 hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center space-x-3 hover:scale-105 hover:pl-5"
                      >
                        <Settings className="w-4 h-4" />
                        <span>System Settings</span>
                      </button>
                      <hr className="border-white/10 my-2" />
                      <button 
                        onClick={() => handleProfileAction('logout')}
                        className="w-full px-4 py-3 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 flex items-center space-x-3 hover:scale-105 hover:pl-5"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isSidebarOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-300 ${
                      isActiveRoute(item.path)
                        ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white shadow-lg'
                        : 'text-slate-200 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 min-h-0">
        {children}
      </div>

      {/* Admin Footer */}
      <AdminFooter />

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default AdminLayout
