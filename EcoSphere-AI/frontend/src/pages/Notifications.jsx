import React, { useState } from 'react';
import NotificationCard from '../components/NotificationCard';
import Button from '../components/Button';
import { useNotification } from '../context/NotificationContext';

const Notifications = () => {
  const { success } = useNotification();
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Submission Approved', message: 'Your Ride-sharing CSR proof has been approved. +50 Eco Points earned!', createdAt: '2026-07-12T10:00:00Z', read: false, type: 'success' },
    { id: '2', title: 'New Challenge Active', message: 'Digital Clean-Up challenge is now active. Join today to earn 150 points!', createdAt: '2026-07-11T14:30:00Z', read: false, type: 'info' },
    { id: '3', title: 'Points Milestone!', message: 'Congratulations! You have crossed the 1,000 points mark.', createdAt: '2026-07-10T09:00:00Z', read: true, type: 'success' },
    { id: '4', title: 'Verification Requested', message: 'Please re-upload a clear file for your Solar Commute activity.', createdAt: '2026-07-08T16:15:00Z', read: true, type: 'warning' },
  ]);

  const handleRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    success('All notifications marked as read.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Your Notifications</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Stay up to date with comments, rewards, challenges, and manager approval statuses.
          </p>
        </div>

        {notifications.some(n => !n.read) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="cursor-pointer">
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <span className="text-4xl">🔔</span>
          <p className="mt-2 text-sm">No notifications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onRead={() => handleRead(notification.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
