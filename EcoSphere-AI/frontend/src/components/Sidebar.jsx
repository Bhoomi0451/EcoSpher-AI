import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/helpers';
import { EMPLOYEE_NAV_ITEMS } from '../utils/constants';
import {
  Squares2X2Icon,
  DocumentTextIcon,
  TrophyIcon,
  AcademicCapIcon,
  GiftIcon,
  BellIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Map icons statically to ensure tree-shaking compatibility
const iconMap = {
  Squares2X2Icon,
  DocumentTextIcon,
  TrophyIcon,
  AcademicCapIcon,
  GiftIcon,
  BellIcon,
  UserIcon,
};

const Sidebar = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const renderNavLinks = (activeClassHelper) => {
    return EMPLOYEE_NAV_ITEMS.map((item) => {
      const IconComponent = iconMap[item.icon] || Squares2X2Icon;
      return (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onCloseMobile}
          className={({ isActive }) =>
            cn(
              'group relative flex items-center rounded-xl py-2.5 px-3.5 text-sm font-medium transition-all duration-150 cursor-pointer',
              isActive
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/20 dark:text-brand-400'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
            )
          }
        >
          {({ isActive }) => (
            <>
              {/* Active bar decoration */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-brand-600 dark:bg-brand-500"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              
              <IconComponent className="h-5 w-5 flex-shrink-0 transition-colors group-hover:text-current" />
              
              <span
                className={cn(
                  'ml-3 transition-opacity duration-200 truncate',
                  isCollapsed ? 'md:hidden opacity-0 pointer-events-none' : 'opacity-100'
                )}
              >
                {item.name}
              </span>

              {/* Tooltip helper for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 hidden rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white shadow-md group-hover:block z-50 whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </>
          )}
        </NavLink>
      );
    });
  };

  return (
    <>
      {/* 1. Mobile Sidebar sliding drawer layout */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Sidebar drawer content */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative flex w-full max-w-xs flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 transition-colors"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🌿</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-base">
                    EcoSphere <span className="text-brand-600 font-medium">AI</span>
                  </span>
                </div>
                <button
                  onClick={onCloseMobile}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation list */}
              <nav className="flex-1 space-y-1.5 overflow-y-auto">
                {renderNavLinks()}
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Desktop Persistent Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 flex-shrink-0 relative',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Navigation block */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {renderNavLinks()}
        </nav>

        {/* Desktop Collapse toggler trigger */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onToggleCollapse}
            className="flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-350 transition-colors cursor-pointer"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
