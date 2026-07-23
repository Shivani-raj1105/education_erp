import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { facultyService } from '../../services/faculty.service';
import Avatar from '../../components/ui/Avatar';
import { RoleBadge } from '../../components/ui/Badge';

const COORDINATOR_SLUGS = [
  'TIMETABLE_COORDINATOR',
  'EXAM_COORDINATOR',
  'CULTURAL_COORDINATOR',
  'PLACEMENT_COORDINATOR',
];

export default function CoordinatorManagement() {
  // Get all faculty
  const { data: facultyData, isLoading } = useQuery({
    queryKey: ['faculty', { page: 1, limit: 100 }],
    queryFn: () => facultyService.getAll({ page: 1, limit: 100 }),
  });

  const allFaculty = facultyData?.data || [];

  // Faculty who have at least one coordinator role
  const coordinators = allFaculty.filter((f) =>
    f.roles?.some((fr) => COORDINATOR_SLUGS.includes(fr.role?.slug || fr.slug))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Coordinator List</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          List of faculty members with assigned coordinator roles
        </p>
      </div>

      {/* Coordinators List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Coordinators</h3>
          <span className="text-sm text-gray-500">{coordinators.length} assigned</span>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : coordinators.length === 0 ? (
          <div className="p-10 text-center text-gray-400 dark:text-gray-500">
            No coordinators assigned.
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {coordinators.map((f) => {
              const coordRoles = f.roles?.filter((fr) =>
                COORDINATOR_SLUGS.includes(fr.role?.slug || fr.slug)
              ) || [];
              return (
                <div key={f.employeeId} className="px-6 py-4 flex items-center gap-4">
                  <Avatar src={f.photo} name={f.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{f.name}</p>
                    <p className="text-xs text-gray-400">{f.designation}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {coordRoles.map((fr) => {
                      const role = fr.role || fr;
                      return (
                        <RoleBadge key={role.slug} slug={role.slug} name={role.name} size="sm" />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
