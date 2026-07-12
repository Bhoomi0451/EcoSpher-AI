import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import Card from './Card';
import { formatDate, cn } from '../utils/helpers';

const BadgeCard = ({ badge, onClick }) => {
  const { name, description, icon, points, dateEarned, isEarned } = badge || {};

  return (
    <Card
      hoverEffect={isEarned}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden cursor-pointer transition-all duration-300 border',
        isEarned
          ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/10 dark:bg-emerald-950/10'
          : 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/5 dark:bg-slate-950/5'
      )}
    >
      <div className="flex items-start space-x-4">
        {/* Badge Icon */}
        <div
          className={cn(
            'p-3 rounded-2xl flex items-center justify-center flex-shrink-0',
            isEarned
              ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
          )}
        >
          {icon ? (
            <span className="text-2xl">{icon}</span>
          ) : (
            <AcademicCapIcon className="h-6 w-6" />
          )}
        </div>

        {/* Text Area */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
              {name || 'Achievement'}
            </h4>
            {points && (
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  isEarned
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                )}
              >
                +{points} XP
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            {description || 'Complete activities to earn this badge.'}
          </p>
          {isEarned && dateEarned && (
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
              Earned: {formatDate(dateEarned)}
            </p>
          )}
          {!isEarned && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium pt-1">
              Locked Achievement
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BadgeCard;
