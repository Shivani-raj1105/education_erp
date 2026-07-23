import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HODSidebar } from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';

const titles = {
  '/hod/dashboard':    'Dashboard',
  '/hod/faculty':      'Faculty Management',
  '/hod/students':     'Student Management',
  '/hod/coordinators': 'Coordinator Management',
};

export default function HODLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const title = Object.entries(titles).find(([path]) => location.pathname.startsWith(path))?.[1] || 'HOD Portal';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col">
        <HODSidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden flex flex-col">
            <HODSidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(!darkMode)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
