import React from 'react';
import { cn } from '../utils/helpers';

export const Spinner = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-t-brand-600 border-r-transparent border-b-transparent border-l-transparent',
        sizes[size],
        className
      )}
      style={{ borderColor: 'var(--color-brand-600) transparent transparent transparent' }}
    />
  );
};

export const ScreenLoader = ({ message = 'Loading EcoSphere...' }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xs z-50 transition-colors">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-brand-500/20 blur-md animate-pulse h-16 w-16" />
          <Spinner size="lg" />
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg',
        className
      )}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900 space-y-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="pt-4 flex items-center justify-between">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
};

export const DashboardGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
};

const Loader = ({ variant = 'spinner', ...props }) => {
  if (variant === 'screen') return <ScreenLoader {...props} />;
  if (variant === 'skeleton') return <Skeleton {...props} />;
  if (variant === 'card') return <CardSkeleton {...props} />;
  return <Spinner {...props} />;
};

export default Loader;
