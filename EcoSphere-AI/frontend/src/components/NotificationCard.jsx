import React from 'react';
import { BellIcon, InformationCircleIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Card from './Card';
import { formatDate, cn } from '../utils/helpers';

const NotificationCard = ({ notification, onRead }) => {
  const { title, message, createdAt, read, type } = notification || {};

  const icons = {
    info: <InformationCircleIcon className="h-5 w-5 text-blue-500" />,
    success: <CheckCircleIcon className="h-5 w-5 text-emerald-500" />,
    warning: <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />,
    alert: <BellIcon className="h-5 w-5 text-rose-500" />,
  };

  const currentIcon = icons[type] || <BellIcon className="h-5 w-5 text-slate-500" />;

  return (
    <Card
      onClick={!read ? onRead : undefined}
      className={cn(
        'relative border transition-all duration-200',
        read
          ? 'border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50'
          : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 font-medium hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer shadow-xs'
      )}
    >
      <div className="flex items-start space-x-4">
        {/* Unread indicator dot */}
        {!read && (
          <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
          </span>
        )}

        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
          {currentIcon}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between pr-4">
            <h4 className={cn('text-sm text-slate-800 dark:text-slate-100', !read && 'font-semibold')}>
              {title || 'System Alert'}
            </h4>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap pl-2">
              {formatDate(createdAt, { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {message || 'No notification message provided.'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default NotificationCard;
