'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, User, Settings, LogOut, Menu, Moon, Sun } from 'lucide-react';

interface AdminHeaderProps {
  onMobileMenuOpen: () => void;
  user?: {
    name: string;
    email: string;
    avatar_url?: string;
    role: string;
  };
}

export function AdminHeader({ onMobileMenuOpen, user }: AdminHeaderProps) {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const notifications = [
    { id: 1, title: 'New booking received', message: 'John Smith booked Cultural Highlights', time: '2 min ago', unread: true },
    { id: 2, title: 'New inquiry', message: 'Sarah asked about custom tour', time: '15 min ago', unread: true },
    { id: 3, title: 'Payment confirmed', message: 'Booking #WCT-20240624-0001 paid', time: '1 hour ago', unread: false },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setShowUserMenu(false);

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        // Redirect to login page
        router.push('/admin/login');
        router.refresh();
      } else {
        console.error('Logout failed');
        // Even if API fails, clear client-side state and redirect
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even on error, redirect to login
      router.push('/admin/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuOpen}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tours, bookings, customers..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-20">
                  <div className="p-4">
                    <h3 className="font-semibold">Notifications</h3>
                    <p className="text-sm text-gray-500">You have {notifications.filter(n => n.unread).length} unread notifications</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${notification.unread ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`h-2 w-2 mt-2 rounded-full ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`} />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-gray-50 rounded-b-xl">
                    <button className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium">
                      Mark all as read
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="font-medium text-sm">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Admin'}</p>
              </div>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-20">
                  <div className="p-4">
                    <p className="font-medium">{user?.name || 'Admin User'}</p>
                    <p className="text-sm text-gray-500">{user?.email || 'admin@wangchuktour.com'}</p>
                  </div>
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
                      <User className="h-4 w-4" />
                      <span className="text-sm">My Profile</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">Settings</span>
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-b-xl py-2">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}