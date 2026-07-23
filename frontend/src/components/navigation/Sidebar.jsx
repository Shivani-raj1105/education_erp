import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  LayoutDashboard, Users, BookOpen, LogOut, GraduationCap, Award,
} from 'lucide-react';
import { useAuthStore } from '../../context/authStore';
import { authService } from '../../services/auth.service';
import Avatar from '../ui/Avatar';
import { getRoleShortName } from '../../utils/roleUtils';
import toast from 'react-hot-toast';

const HOD_NAV = [
  { label: 'Dashboard',              path: '/hod/dashboard',    icon: LayoutDashboard },
  { label: 'Faculty List',           path: '/hod/faculty',      icon: Users },
  { label: 'Student List',           path: '/hod/students',     icon: BookOpen },
  { label: 'Coordinator Management', path: '/hod/coordinators', icon: Award },
];

export function HODSidebar({ onClose }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      logout();
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };

  return (
    <SidebarShell user={user} onLogout={handleLogout} onClose={onClose}>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {HOD_NAV.map((item) => (
          <SidebarItem key={item.path} to={item.path} icon={item.icon} label={item.label} onClick={onClose} />
        ))}
      </nav>
    </SidebarShell>
  );
}

function SidebarShell({ user, onLogout, onClose, children }) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Dept Portal</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.departmentCode || 'ERP'}</p>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-gray-800">
          <Avatar src={user?.photo} name={user?.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.isHOD ? 'HOD' : getRoleShortName(user?.roles?.[0])}
            </p>
          </div>
        </div>
      </div>

      {children}

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

function SidebarItem({ to, icon: Icon, label, badge, onClick }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium group',
          isActive ? 'sidebar-item-active' : 'sidebar-item'
        )
      }
    >
      <Icon size={17} className="flex-shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="px-1.5 py-0.5 rounded-md text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
          {badge}
        </span>
      )}
    </NavLink>
  );
}
