import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import authService from '../services/authService';
import csrService from '../services/csrService';
import { STORAGE_KEYS } from '../utils/constants';
import { getInitials } from '../utils/helpers';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  EnvelopeIcon, 
  TrophyIcon, 
  ShieldCheckIcon,
  SparklesIcon,
  BoltIcon,
  ArrowPathIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

const DEPARTMENTS = [
  'Operations & Supply Chain',
  'Logistics & Distribution',
  'Facilities & Energy Management',
  'Product Design & Engineering',
  'Human Resources & Admin',
  'Marketing & Public Relations',
];

const Profile = () => {
  const { user, setUser } = useAuth();
  const { success, error: toastError } = useNotification();
  
  const [profile, setProfile] = useState(null);
  const [csrStats, setCsrStats] = useState({ approved: 0, pending: 0, totalOffset: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', department: '' });
  const [saving, setSaving] = useState(false);

  const fetchProfileAndStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [profileRes, submissionsRes] = await Promise.all([
        authService.getProfile().catch(err => {
          if (import.meta.env.DEV) return { success: true, user };
          throw err;
        }),
        csrService.getMySubmissions().catch(err => {
          if (import.meta.env.DEV) {
            return {
              success: true,
              submissions: [
                { _id: 'sub-1', status: 'Approved' },
                { _id: 'sub-2', status: 'Pending' },
                { _id: 'sub-3', status: 'Approved' },
              ]
            };
          }
          throw err;
        })
      ]);

      const activeUser = profileRes?.user || user;
      setProfile(activeUser);
      setEditForm({
        name: activeUser?.name || '',
        department: activeUser?.department || '',
      });

      // Calculate statistics locally from submissions
      const list = submissionsRes?.submissions || [];
      const approved = list.filter(s => s.status === 'Approved').length;
      const pending = list.filter(s => s.status === 'Pending').length;
      // Estimate 2.5kg of CO2 per approved activity
      const totalOffset = approved * 2.5;

      setCsrStats({ approved, pending, totalOffset });
    } catch (err) {
      setError(err.message || 'Failed to retrieve profile records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndStats();
  }, []);

  const handleOpenEdit = () => {
    setEditForm({
      name: profile?.name || '',
      department: profile?.department || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.department) {
      toastError('Please fill in all details.');
      return;
    }
    setSaving(true);

    try {
      const res = await authService.updateProfile(editForm);
      const updatedUser = res?.user || { ...profile, ...editForm };
      
      setProfile(updatedUser);
      setUser(updatedUser); // Update context
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      success('Profile updated successfully!');
      setIsModalOpen(false);
    } catch (err) {
      if (import.meta.env.DEV) {
        // Dev Simulation
        const updatedUser = { ...profile, ...editForm };
        setProfile(updatedUser);
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        success('Profile updated successfully (dev simulation)!');
        setIsModalOpen(false);
      } else {
        toastError(err.message || 'Failed to update profile settings.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          <div className="md:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto text-center p-6 space-y-4">
        <span className="text-4xl">⚠️</span>
        <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Failed to Load Profile</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{error}</p>
        <Button variant="primary" onClick={fetchProfileAndStats} className="flex items-center gap-1.5 mx-auto">
          <ArrowPathIcon className="h-4 w-4" /> Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Employee Profile</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your account settings and review your cumulative green sustainability metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Points Card */}
        <div className="space-y-6">
          <Card className="flex flex-col items-center text-center p-6 space-y-4 relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,_var(--tw-gradient-stops))] from-brand-500 to-emerald-600 text-3xl font-black text-white shadow-lg shadow-emerald-500/20">
              {getInitials(profile?.name)}
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">{profile?.name}</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">{profile?.role || 'Employee'}</p>
            </div>

            <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-around text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Eco XP</span>
                <p className="font-extrabold text-slate-800 dark:text-slate-100 text-sm flex items-center justify-center gap-1">
                  <TrophyIcon className="h-4 w-4 text-amber-500" /> {profile?.xp || 0}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Badge</span>
                <p className="font-semibold text-slate-700 dark:text-slate-200 text-xs">
                  {profile?.xp >= 1000 ? 'Waste Warrior ♻️' : 'Beginner 🎖️'}
                </p>
              </div>
            </div>
          </Card>

          {/* CSR Statistics Box */}
          <Card title="CSR Statistics" className="space-y-3">
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-450 dark:text-slate-500 font-semibold flex items-center gap-1.5">
                <CheckCircleIcon className="h-4.5 w-4.5 text-emerald-500" /> Approved Acts
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{csrStats.approved}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-450 dark:text-slate-500 font-semibold flex items-center gap-1.5">
                <ClockIcon className="h-4.5 w-4.5 text-amber-500" /> Pending Review
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{csrStats.pending}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100 dark:border-slate-850 pt-3">
              <span className="text-slate-450 dark:text-slate-500 font-semibold flex items-center gap-1.5">
                <BoltIcon className="h-4.5 w-4.5 text-brand-500" /> CO2 Offset Est.
              </span>
              <span className="font-extrabold text-emerald-650 dark:text-emerald-450">{csrStats.totalOffset} kg</span>
            </div>
          </Card>
        </div>

        {/* Right Column: Profile Info Details */}
        <div className="md:col-span-2 space-y-6">
          <Card title="Account Information">
            <div className="space-y-5 py-2">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider leading-none">Full Name</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-2">{profile?.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider leading-none">Email Address</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-2">{profile?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <BuildingOfficeIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider leading-none">Assigned Department</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-2">{profile?.department || 'No department selected'}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleOpenEdit} 
                  className="cursor-pointer text-xs font-bold flex items-center gap-1.5"
                  iconLeft={<PencilSquareIcon className="h-4 w-4" />}
                >
                  Edit Profile Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Profile Details"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveProfile} loading={saving}>
              Save Details
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your full name"
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:border-brand-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Department */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Department</label>
            <select
              value={editForm.department}
              onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-transparent px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:border-brand-500 focus:outline-hidden dark:bg-slate-900 cursor-pointer"
              required
            >
              <option value="" disabled className="text-slate-500">Select department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="text-slate-800 dark:text-slate-100">
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
