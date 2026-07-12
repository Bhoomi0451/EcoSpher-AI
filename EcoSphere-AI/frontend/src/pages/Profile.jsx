import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { getInitials } from '../utils/helpers';

const Profile = () => {
  const { user } = useAuth();
  const { success } = useNotification();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [dept, setDept] = useState(user?.department || '');

  const handleSave = (e) => {
    e.preventDefault();
    setEditing(false);
    success('Profile updated successfully (local simulation).');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Employee Profile</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your account profile details and overview your personal green metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <Card className="md:col-span-1 flex flex-col items-center text-center p-6 space-y-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-500 text-2xl font-bold text-white shadow-lg">
            {getInitials(user?.name)}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">{user?.name}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{user?.department}</p>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {user?.role}
          </span>
        </Card>

        {/* Account Details block */}
        <Card className="md:col-span-2" title="Account Details">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2 text-sm text-slate-800 dark:text-slate-100 focus:border-brand-500 focus:outline-hidden"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Department</label>
                <input
                  type="text"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2 text-sm text-slate-800 dark:text-slate-100 focus:border-brand-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(false)} className="cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="cursor-pointer">
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Email Address</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Department</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{user?.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Carbon Saved Rank</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">Top 15% (#4 in Team)</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Earned Badges</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">3 Achievements</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="cursor-pointer">
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;
