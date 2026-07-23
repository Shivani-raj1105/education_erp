import React, { useEffect, useRef, useState } from 'react';
import { User, CheckSquare, Square, ChevronRight, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService } from '../../services/faculty.service';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import ReactDOM from 'react-dom';

const COORDINATOR_SLUGS = [
  'TIMETABLE_COORDINATOR',
  'EXAM_COORDINATOR',
  'CULTURAL_COORDINATOR',
  'PLACEMENT_COORDINATOR',
];

export default function ContextMenu({ faculty, position, onClose, onViewProfile, onDelete }) {
  const menuRef = useRef(null);
  const queryClient = useQueryClient();
  const [roleSubmenuOpen, setRoleSubmenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: position.x, y: position.y });

  // Fetch all roles
  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: roleService.getAll,
    staleTime: Infinity,
  });

  const coordinatorRoles = (rolesData?.data || []).filter((r) =>
    COORDINATOR_SLUGS.includes(r.slug)
  );

  const currentRoleSlugs = faculty.roles?.map((fr) => fr.role?.slug || fr.slug) || [];

  const facultyId = faculty.employeeId || faculty.id;

  const syncMutation = useMutation({
    mutationFn: ({ add, remove }) => roleService.sync(facultyId, { add, remove }),
    onSuccess: (res) => {
      const { results } = res.data;
      if (results.added.length)   toast.success('Role assigned');
      if (results.removed.length) toast.success('Role removed');
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      queryClient.invalidateQueries({ queryKey: ['faculty', facultyId] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update role');
    },
  });

  const handleRoleToggle = (role) => {
    const hasRole = currentRoleSlugs.includes(role.slug);
    if (hasRole) syncMutation.mutate({ add: [], remove: [role.id] });
    else         syncMutation.mutate({ add: [role.id], remove: [] });
  };

  // Adjust to stay within viewport after render
  useEffect(() => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let { x, y } = position;
    if (x + rect.width  > vw - 8) x = vw - rect.width  - 8;
    if (y + rect.height > vh - 8) y = vh - rect.height - 8;
    if (x < 8) x = 8;
    if (y < 8) y = 8;
    setMenuPos({ x, y });
  }, [position, roleSubmenuOpen]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    // Use setTimeout so the click that opened the menu doesn't immediately close it
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler); };
  }, [onClose]);

  // Close on scroll
  useEffect(() => {
    document.addEventListener('scroll', onClose, true);
    return () => document.removeEventListener('scroll', onClose, true);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const menu = (
    <div
      ref={menuRef}
      style={{ left: menuPos.x, top: menuPos.y, position: 'fixed', zIndex: 9999 }}
      className="w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Faculty info */}
      <div className="px-3 py-2.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/60">
        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{faculty.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{faculty.designation}</p>
      </div>

      <div className="p-1.5 space-y-0.5">
        {/* View Profile */}
        <button
          onClick={() => { onViewProfile(faculty); onClose(); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 transition-colors"
        >
          <User size={15} className="text-gray-400 flex-shrink-0" />
          View Profile
        </button>

        {/* Coordinator Roles toggle */}
        <button
          onClick={() => setRoleSubmenuOpen(!roleSubmenuOpen)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-sm text-indigo-600 dark:text-indigo-400 transition-colors"
        >
          {syncMutation.isPending
            ? <Loader2 size={15} className="animate-spin flex-shrink-0" />
            : <CheckSquare size={15} className="flex-shrink-0" />
          }
          <span className="flex-1 text-left">Coordinator Roles</span>
          <ChevronRight
            size={13}
            className={clsx('transition-transform duration-150', roleSubmenuOpen && 'rotate-90')}
          />
        </button>

        {/* Inline role checkboxes */}
        {roleSubmenuOpen && (
          <div className="mx-1 p-1 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
            {coordinatorRoles.length === 0 ? (
              <p className="text-xs text-gray-400 px-3 py-2">Loading roles…</p>
            ) : (
              coordinatorRoles.map((role) => {
                const checked = currentRoleSlugs.includes(role.slug);
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleToggle(role)}
                    disabled={syncMutation.isPending}
                    className={clsx(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                      checked
                        ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700',
                      syncMutation.isPending && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {checked
                      ? <CheckSquare size={13} className="text-indigo-500 flex-shrink-0" />
                      : <Square      size={13} className="flex-shrink-0" />
                    }
                    {role.name}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Render into document.body so it's never clipped by overflow:hidden parents
  return ReactDOM.createPortal(menu, document.body);
}
