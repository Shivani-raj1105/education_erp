import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date, fmt = 'dd MMM yyyy') => {
  if (!date) return '—';
  try { return format(new Date(date), fmt); }
  catch { return '—'; }
};

export const formatRelativeTime = (date) => {
  if (!date) return '—';
  try { return formatDistanceToNow(new Date(date), { addSuffix: true }); }
  catch { return '—'; }
};

export const formatExperience = (years) => {
  if (!years && years !== 0) return '—';
  return years === 1 ? '1 year' : `${years} years`;
};

export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const getAvatarColor = (name = '') => {
  const colors = [
    'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-orange-500',
    'bg-pink-500', 'bg-cyan-500', 'bg-rose-500', 'bg-teal-500',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
};

export const formatActionLabel = (action) => {
  const labels = {
    ASSIGN_ROLE:    'Assigned Role',
    REMOVE_ROLE:    'Removed Role',
    CREATE_FACULTY: 'Added Faculty',
    UPDATE_FACULTY: 'Updated Faculty',
    DELETE_FACULTY: 'Deleted Faculty',
  };
  return labels[action] || action;
};
