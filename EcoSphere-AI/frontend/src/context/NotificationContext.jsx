import React, { createContext, useContext } from 'react';
import toast from 'react-hot-toast';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  
  // Custom styled notifications matching our platform colors
  const showSuccess = (message, options = {}) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        borderRadius: '12px',
        background: '#0f172a',
        color: '#f8fafc',
        border: '1px solid #1e293b',
        fontSize: '0.875rem',
      },
      ...options,
    });
  };

  const showError = (message, options = {}) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        borderRadius: '12px',
        background: '#0f172a',
        color: '#f8fafc',
        border: '1px solid #1e293b',
        fontSize: '0.875rem',
      },
      ...options,
    });
  };

  const showInfo = (message, options = {}) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        borderRadius: '12px',
        background: '#0f172a',
        color: '#f8fafc',
        border: '1px solid #1e293b',
        fontSize: '0.875rem',
      },
      ...options,
    });
  };

  const showWarning = (message, options = {}) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        borderRadius: '12px',
        background: '#0f172a',
        color: '#f8fafc',
        border: '1px solid #1e293b',
        fontSize: '0.875rem',
      },
      ...options,
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        success: showSuccess,
        error: showError,
        info: showInfo,
        warning: showWarning,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
