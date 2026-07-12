import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/helpers';

const Card = ({
  children,
  className = '',
  title,
  headerAction,
  footer,
  hoverEffect = false,
  ...props
}) => {
  const Component = hoverEffect ? motion.div : 'div';
  const animationProps = hoverEffect
    ? {
        whileHover: { y: -4, transition: { duration: 0.2 } },
        className: cn(
          'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs dark:shadow-none hover:shadow-md dark:hover:border-slate-700 transition-all duration-300',
          className
        ),
      }
    : {
        className: cn(
          'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs dark:shadow-none',
          className
        ),
      };

  return (
    <Component {...animationProps} {...props}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 gap-2">
          {title && (
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base leading-none">
              {title}
            </h3>
          )}
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}
      
      <div className="text-sm text-slate-600 dark:text-slate-300">
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-4 flex items-center justify-end text-xs text-slate-500 dark:text-slate-400">
          {footer}
        </div>
      )}
    </Component>
  );
};

export default Card;
