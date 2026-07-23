import React from 'react';
import clsx from 'clsx';
import { getInitials, getAvatarColor } from '../../utils/formatters';

export default function Avatar({ src, name = '', size = 'md', className }) {
  const sizes = {
    xs:  'w-7 h-7 text-xs',
    sm:  'w-9 h-9 text-sm',
    md:  'w-11 h-11 text-sm',
    lg:  'w-16 h-16 text-lg',
    xl:  'w-24 h-24 text-2xl',
    '2xl': 'w-32 h-32 text-3xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={clsx(
          'rounded-full object-cover ring-2 ring-white dark:ring-gray-800',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-white dark:ring-gray-800',
        getAvatarColor(name),
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
