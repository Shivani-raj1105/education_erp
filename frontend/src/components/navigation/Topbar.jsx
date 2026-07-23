import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Sun, Moon, ChevronDown, User, LogOut, Check } from 'lucide-react';
import { useAuthStore } from '../../context/authStore';
import { authService } from '../../services/auth.service';
import Avatar from '../ui/Avatar';
import { RoleBadge } from '../ui/Badge';
import { useClickOutside } from '../../hooks/useClickOutside';
import toast from 'react-hot-toast';
import clsx from 'clsx';

// Sample notifications — replace with real API when notification module is ready
const SAMPLE_NOTIFICATIONS = [
  { id: 1, text: 'Sathyaseelan was assigned Timetable Coordinator', time: '2 min ago', read: false },
  { id: 2, text: 'New faculty Divya K joined the department',        time: '1 hr ago',  read: false },
  { id: 3, text: 'Exam schedule updated for Semester 5',            time: '3 hrs ago', read: true  },
  { id: 4, text: 'Karthikeyan R was assigned Placement Coordinator', time: 'Yesterday', read: true  },
];

export default function Topbar({ onMenuClick, title, darkMode, onToggleDark }) {
  const [profileOpen,      setProfileOpen]      = useState(false);
  const [notifOpen,        setNotifOpen]        = useState(false);
  const [notifications,    setNotifications]    = useState(SAMPLE_NOTIFICATIONS);

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  useClickOutside(profileRef, () => setProfileOpen(false));
  useClickOutside(notifRef,   () => setNotifOpen(false));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id) =>
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const handleLogout = async () => {
    try { await authService.logout(); } finally {
      logout();
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 lg:hidden transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-semibold text-gray-900 dark:text-white leading-tight">{title}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            {user?.department?.name || user?.departmentCode}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Dark mode */}
        <button
          onClick={onToggleDark}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl z-50 animate-scale-in overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1"
                  >
                    <Check size={12} /> Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={clsx(
                        'w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700/50 last:border-0',
                        !n.read && 'bg-indigo-50/50 dark:bg-indigo-900/10'
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
                        )}
                        <div className={!n.read ? '' : 'pl-4'}>
                          <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">{n.text}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative ml-1" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Avatar src={user?.photo} name={user?.name} size="xs" />
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
              {user?.name?.split(' ')[0]}
            </span>
            <ChevronDown size={14} className={clsx('text-gray-400 transition-transform duration-150', profileOpen && 'rotate-180')} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl z-50 animate-scale-in overflow-hidden">
              {/* User info */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Avatar src={user?.photo} name={user?.name} size="md" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.username}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {user?.roles?.slice(0, 2).map((slug) => (
                        <RoleBadge key={slug} slug={slug} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="p-2">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate(`/hod/faculty/${user?.id}`);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                >
                  <User size={15} /> View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-500 transition-colors"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
