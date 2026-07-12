import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '../utils/helpers';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
}) => {
  // Listen for Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const modalRoot = document.getElementById('root') || document.body;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
            className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Modal content body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className={cn(
              'relative w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col z-10 max-h-[90vh]',
              sizes[size]
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
              {title && (
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {title}
                </h3>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-full cursor-pointer"
                iconLeft={<XMarkIcon className="h-5 w-5" />}
              />
            </div>

            {/* Content body scroll-area */}
            <div className="px-6 py-4 overflow-y-auto text-sm text-slate-600 dark:text-slate-300 flex-grow">
              {children}
            </div>

            {/* Footer actions */}
            {footer && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex-shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};

export default Modal;
