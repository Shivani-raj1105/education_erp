import React from 'react';
import clsx from 'clsx';

export default function Card({ children, className, hover = false, glass = false, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-2xl border transition-all duration-200',
        glass
          ? 'glass-light dark:glass'
          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700',
        'shadow-card',
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={clsx('px-6 py-4 border-b border-gray-100 dark:border-gray-700', className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }) {
  return <div className={clsx('px-6 py-4', className)}>{children}</div>;
}

export function StatCard({ title, value, subtitle, icon: Icon, color = 'indigo', trend }) {
  const colorMap = {
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-100 dark:ring-indigo-800' },
    green:  { bg: 'bg-green-50 dark:bg-green-900/20',   icon: 'text-green-600 dark:text-green-400',   ring: 'ring-green-100 dark:ring-green-800' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', icon: 'text-orange-600 dark:text-orange-400', ring: 'ring-orange-100 dark:ring-orange-800' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400', ring: 'ring-purple-100 dark:ring-purple-800' },
    blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',     icon: 'text-blue-600 dark:text-blue-400',     ring: 'ring-blue-100 dark:ring-blue-800' },
    pink:   { bg: 'bg-pink-50 dark:bg-pink-900/20',     icon: 'text-pink-600 dark:text-pink-400',     ring: 'ring-pink-100 dark:ring-pink-800' },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value ?? '—'}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={clsx('p-3 rounded-2xl ring-2', c.bg, c.ring)}>
            <Icon size={22} className={c.icon} />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="mt-3 text-xs text-gray-400">
          <span className={trend >= 0 ? 'text-green-500' : 'text-red-500'}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          {' '}vs last month
        </div>
      )}
    </Card>
  );
}
