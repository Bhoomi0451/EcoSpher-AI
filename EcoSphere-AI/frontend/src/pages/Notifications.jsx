import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCard from '../components/NotificationCard';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { useNotification } from '../context/NotificationContext';
import notificationService from '../services/notificationService';
import { 
  BellIcon, 
  ArrowPathIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const getRelativeTime = (dateString) => {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  if (isNaN(diffMs)) return dateString; // fallback to raw string if already formatted

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const Notifications = () => {
  const { success, error: toastError } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications();
      const list = Array.isArray(data) ? data : data.notifications || [];
      setNotifications(list);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('Development Mode: Backend notifications API failed. Using mock alerts.');
        // Set mock data
        setNotifications([
          { id: '1', title: 'Submission Approved', message: 'Your Ride-sharing CSR proof has been approved. +50 Eco Points earned!', createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), read: false, type: 'success' },
          { id: '2', title: 'New Challenge Active', message: 'Digital Clean-Up challenge is now active. Join today to earn 150 points!', createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), read: false, type: 'info' },
          { id: '3', title: 'Points Milestone!', message: 'Congratulations! You have crossed the 1,000 points mark.', createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), read: true, type: 'success' },
          { id: '4', title: 'Verification Requested', message: 'Please re-upload a clear file for your Solar Commute activity.', createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), read: true, type: 'warning' },
        ]);
      } else {
        setError(err.message || 'Failed to load notifications.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      if (import.meta.env.DEV) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
      } else {
        toastError(err.message || 'Failed to mark notification as read.');
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      success('All notifications marked as read.');
    } catch (err) {
      if (import.meta.env.DEV) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        success('All notifications marked as read (simulation).');
      } else {
        toastError(err.message || 'Failed to mark all as read.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto text-center p-6 space-y-4">
        <span className="text-4xl">⚠️</span>
        <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Failed to Load Notifications</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{error}</p>
        <Button variant="primary" onClick={fetchNotifications} className="flex items-center gap-1.5 mx-auto">
          <ArrowPathIcon className="h-4 w-4" /> Retry
        </Button>
      </Card>
    );
  }

  // Pre-process notifications to format relative dates
  const formattedNotifications = notifications.map(n => ({
    ...n,
    createdAt: getRelativeTime(n.createdAt)
  }));

  const hasUnread = notifications.some(n => !n.read);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header Panel */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Your Notifications</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Stay up to date with reward redemptions, challenges, and manager approval statuses.
          </p>
        </div>

        {hasUnread && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMarkAllRead} 
            className="cursor-pointer text-xs font-bold flex items-center gap-1"
            iconLeft={<CheckIcon className="h-4 w-4" />}
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications list */}
      {formattedNotifications.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500 space-y-3">
          <span className="text-5xl block">🔔</span>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350">All caught up!</h3>
          <p className="text-xs max-w-xs mx-auto">
            You don't have any notifications or warnings at the moment.
          </p>
        </div>
      ) : (
        <motion.div 
          layout
          className="space-y-4"
        >
          <AnimatePresence>
            {formattedNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <NotificationCard
                  notification={notification}
                  onRead={() => handleRead(notification.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Notifications;
