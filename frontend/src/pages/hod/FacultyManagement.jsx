import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, RefreshCw, MoreVertical } from 'lucide-react';
import { facultyService } from '../../services/faculty.service';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import Avatar from '../../components/ui/Avatar';
import { RoleBadge } from '../../components/ui/Badge';
import ContextMenu from '../../components/faculty/ContextMenu';
import clsx from 'clsx';

export default function FacultyManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search,    setSearch]    = useState('');
  const [sortBy,    setSortBy]    = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page,      setPage]      = useState(1);
  const [limit]                   = useState(10);
  const [contextMenu, setContextMenu] = useState(null);

  const queryParams = {
    page, limit,
    search: search || undefined,
    sortBy, sortOrder,
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['faculty', queryParams],
    queryFn: () => facultyService.getAll(queryParams),
    placeholderData: (prev) => prev,
  });

  const faculty    = data?.data || [];
  const pagination = data?.pagination || {};

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
    setPage(1);
  };

  const handleSearch = (val) => { setSearch(val); setPage(1); };

  // Right-click on a row
  const handleContextMenu = (e, fac) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ faculty: fac, x: e.clientX, y: e.clientY });
  };

  // Three-dot button click — open menu just below the button
  const handleThreeDot = (e, fac) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({
      faculty: fac,
      x: Math.min(rect.left, window.innerWidth - 240),
      y: rect.bottom + 6,
    });
  };

  const COLS = [
    { key: 'name',        label: 'Faculty' },
    { key: 'employeeId',  label: 'Emp ID' },
    { key: 'designation', label: 'Designation' },
    { key: null,          label: 'Qualification' },
    { key: null,          label: 'Roles' },
    { key: null,          label: '' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Faculty List</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {pagination.total ?? '—'} total faculty in your department
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, ID, designation..."
          className="flex-1"
        />
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['faculty'] })}
          className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Refresh"
          title="Refresh"
        >
          <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
                {COLS.map((col, i) => (
                  <th
                    key={i}
                    onClick={() => col.key && handleSort(col.key)}
                    className={clsx(
                      'px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap',
                      col.key && 'cursor-pointer hover:text-gray-900 dark:hover:text-white select-none'
                    )}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.key && sortBy === col.key && (
                        <ArrowUpDown size={12} className="text-indigo-500" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : faculty.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 dark:text-gray-500">
                    {search ? `No faculty found for "${search}"` : 'No faculty in this department yet.'}
                  </td>
                </tr>
              ) : (
                faculty.map((f) => (
                  <tr
                    key={f.employeeId}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors cursor-pointer"
                    onContextMenu={(e) => handleContextMenu(e, f)}
                    onClick={() => navigate(`/hod/faculty/${f.employeeId}`)}
                  >
                    {/* Name + avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={f.photo} name={f.name} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{f.name}</p>
                          <p className="text-xs text-gray-400">{f.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 font-mono">{f.employeeId}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-[140px] truncate">{f.designation}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-[140px] truncate">{f.qualification}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {(f.roles || []).map((fr) => {
                          const role = fr.role || fr;
                          return <RoleBadge key={role.id || role.slug} slug={role.slug} name={role.name} size="sm" />;
                        })}
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={(e) => handleThreeDot(e, f)}
                          className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title="Options & Roles"
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <Pagination pagination={pagination} onPageChange={setPage} />
        )}
      </div>

      {/* Context menu — renders as fixed overlay */}
      {contextMenu && (
        <ContextMenu
          faculty={contextMenu.faculty}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
          onViewProfile={(f) => { navigate(`/hod/faculty/${f.employeeId}`); }}
        />
      )}
    </div>
  );
}
