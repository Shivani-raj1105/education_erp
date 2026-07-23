import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Mail, Phone, Calendar, Award, Briefcase, BookOpen, Pencil } from 'lucide-react';
import { facultyService } from '../../services/faculty.service';
import Avatar from '../../components/ui/Avatar';
import { RoleBadge, StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate, formatExperience } from '../../utils/formatters';

export default function FacultyProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['faculty', id],
    queryFn: () => facultyService.getById(id),
    retry: 1,
  });

  const f = data?.data;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !f) {
    return (
      <div className="text-center py-16 max-w-4xl mx-auto">
        <p className="text-gray-400 mb-4">Could not load faculty profile. The profile may not exist or you may need to log in again.</p>
        <Button variant="ghost" onClick={() => navigate('/hod/faculty')}>
          <ArrowLeft size={16} /> Back to Faculty List
        </Button>
      </div>
    );
  }

  const infoItems = [
    { icon: Mail,     label: 'Email',        value: f.email },
    { icon: Phone,    label: 'Phone',         value: f.phone || '—' },
    { icon: Briefcase,label: 'Designation',   value: f.designation },
    { icon: BookOpen, label: 'Qualification', value: f.qualification },
    { icon: Award,    label: 'Specialization',value: f.specialization || '—' },
    { icon: Calendar, label: 'Experience',    value: formatExperience(f.experience) },
    { icon: Calendar, label: 'Joining Date',  value: formatDate(f.joiningDate) },
    { icon: Briefcase,label: 'Employee ID',   value: f.employeeId },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/hod/faculty')}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back to Faculty Management
      </button>

      {/* Profile header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card overflow-hidden">
        {/* Cover gradient */}
        <div className="h-28 bg-gradient-to-r from-indigo-500 to-purple-600" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <Avatar src={f.photo} name={f.name} size="2xl" className="ring-4 ring-white dark:ring-gray-800 shadow-xl" />
            <div className="flex-1 pb-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{f.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{f.designation} · {f.department?.name}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {f.roles?.map((fr) => {
                  const role = fr.role || fr;
                  return <RoleBadge key={role.id || role.slug} slug={role.slug} name={role.name} />;
                })}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={f.status} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/hod/faculty/edit/${f.employeeId}`)}
              >
                <Pencil size={14} /> Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Personal Information</h3>
          <dl className="space-y-3">
            {infoItems.slice(0, 4).map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <item.icon size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <dt className="text-xs text-gray-400">{item.label}</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Academic Details</h3>
          <dl className="space-y-3">
            {infoItems.slice(4).map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <item.icon size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <dt className="text-xs text-gray-400">{item.label}</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Coordinator Roles */}
      {f.roles?.filter((fr) => !['HOD', 'FACULTY'].includes((fr.role || fr).slug)).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Coordinator Roles</h3>
          <div className="flex flex-wrap gap-2">
            {f.roles.filter((fr) => !['HOD', 'FACULTY'].includes((fr.role || fr).slug)).map((fr) => {
              const role = fr.role || fr;
              return (
                <div key={role.id || role.slug} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <RoleBadge slug={role.slug} name={role.name} />
                  {fr.assignedAt && (
                    <span className="text-xs text-gray-400">since {formatDate(fr.assignedAt)}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
