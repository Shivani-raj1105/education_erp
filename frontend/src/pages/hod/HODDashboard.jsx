import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Award, ChevronRight } from 'lucide-react';
import { dashboardService } from '../../services/faculty.service';
import { useAuthStore } from '../../context/authStore';
import { formatRelativeTime, formatActionLabel } from '../../utils/formatters';
import Avatar from '../../components/ui/Avatar';

const ManagementCard = ({ title, description, icon: Icon, color, path, stat, statLabel }) => {
  const navigate = useNavigate();
  const colorMap = {
    indigo: { bg: 'from-indigo-500 to-indigo-600', light: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-800' },
    blue:   { bg: 'from-blue-500 to-blue-600',     light: 'bg-blue-50 dark:bg-blue-900/20',     icon: 'text-blue-600 dark:text-blue-400',     border: 'border-blue-100 dark:border-blue-800' },
    purple: { bg: 'from-purple-500 to-purple-600', light: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-800' },
  };
  const c = colorMap[color];

  return (
    <button
      onClick={() => navigate(path)}
      className={`w-full text-left p-6 bg-white dark:bg-gray-800 rounded-2xl border ${c.border} shadow-card hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${c.light}`}>
          <Icon size={24} className={c.icon} />
        </div>
        <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors mt-1" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      {stat !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat ?? '—'}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{statLabel}</span>
        </div>
      )}
    </button>
  );
};

export default function HODDashboard() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.get,
  });

  const d = data?.data;
  const stats = d?.stats || {};
  const dept  = d?.department || {};

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, <span className="text-indigo-600">{user?.name || 'Dr.'}</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {dept.name || 'Department'} — Manage your department from here
        </p>
      </div>

      {/* Three management cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ManagementCard
            title="Faculty List"
            description="View and browse all faculty members in your department"
            icon={Users}
            color="indigo"
            path="/hod/faculty"
            stat={stats.totalFaculty}
            statLabel="faculty members"
          />
          <ManagementCard
            title="Student List"
            description="View and manage all students enrolled in your department"
            icon={BookOpen}
            color="blue"
            path="/hod/students"
            stat={stats.totalStudents ?? 0}
            statLabel="students"
          />
          <ManagementCard
            title="Coordinator Management"
            description="Assign and manage coordinator roles for faculty members"
            icon={Award}
            color="purple"
            path="/hod/coordinators"
            stat={stats.coordinatorCount}
            statLabel="coordinators assigned"
          />
        </div>
      )}

      {/* Recent Activity */}
      {d?.recentActivity?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {d.recentActivity.map((log) => (
              <div key={log.id} className="flex items-start gap-3">
                <Avatar name={log.performer?.name} size="xs" className="flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
                    <span className="font-semibold">{log.performer?.name?.split(' ').slice(-1)[0]}</span>
                    {' '}{formatActionLabel(log.action).toLowerCase()}
                    {log.target && <> for <span className="font-semibold">{log.target.name?.split(' ').slice(-1)[0]}</span></>}
                    {log.details?.roleName && <> — <span className="text-indigo-500">{log.details.roleName}</span></>}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(log.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
