import React from 'react';
import clsx from 'clsx';
import { getRoleBadgeClass, getRoleShortName } from '../../utils/roleUtils';

export const RoleBadge = ({ slug, name, size = 'sm' }) => {
  const label = getRoleShortName(slug) || name;
  const colorClass = getRoleBadgeClass(slug);
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        colorClass
      )}
    >
      {label}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const config = {
    ACTIVE:   { label: 'Active',   classes: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
    INACTIVE: { label: 'Inactive', classes: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
    ON_LEAVE: { label: 'On Leave', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' },
  };
  const { label, classes } = config[status] || config['INACTIVE'];
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', classes)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {label}
    </span>
  );
};

export default RoleBadge;
