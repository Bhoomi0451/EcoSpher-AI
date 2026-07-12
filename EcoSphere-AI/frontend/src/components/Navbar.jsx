import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import { STORAGE_KEYS, THEMES } from '../utils/constants';
import { 
  Bars3Icon, 
  SunIcon, 
  MoonIcon, 
  ArrowRightOnRectangleIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || THEMES.LIGHT;
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === THEMES.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Left section: Toggle and Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleMobileSidebar}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300 md:hidden cursor-pointer"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌿</span>
            <span className="font-bold text-slate-800 dark:text-slate-100 tracking-tight text-lg">
              EcoSphere <span className="text-brand-600 font-medium">AI</span>
            </span>
          </div>
        </div>

        {/* Right section: Options, Theme toggle, Profile menu */}
        <div className="flex items-center space-x-4">
          
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === THEMES.DARK ? (
              <SunIcon className="h-5 w-5 text-amber-400" />
            ) : (
              <MoonIcon className="h-5 w-5 text-indigo-600" />
            )}
          </button>

          {/* User profile dropdown container */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(prev => !prev)}
              className="flex items-center space-x-2 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-hidden"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-semibold text-white shadow-xs">
                {getInitials(user?.name)}
              </div>
              <div className="hidden text-left md:block pr-1">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-none">
                  {user?.name || 'Employee'}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  {user?.department || 'ESG Team'}
                </p>
              </div>
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <>
                  {/* Invisible clicking canvas for closing */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2 shadow-lg ring-1 ring-black/5 focus:outline-hidden z-20"
                  >
                    {/* User info details block */}
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <div className="p-1">
                      {/* Department indicator */}
                      <div className="flex items-center space-x-2 px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                        <BuildingOfficeIcon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{user?.department || 'General Department'}</span>
                      </div>

                      {/* Role indicator */}
                      <div className="flex items-center space-x-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <UserIcon className="h-4 w-4 flex-shrink-0" />
                        <span>Role: {user?.role || 'Employee'}</span>
                      </div>
                    </div>

                    {/* Logout trigger button */}
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-2 p-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors text-left cursor-pointer"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 flex-shrink-0" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
