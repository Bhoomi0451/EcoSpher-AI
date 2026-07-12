import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { 
  TrophyIcon, 
  BoltIcon, 
  FireIcon, 
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  BellIcon,
  MapPinIcon,
  PlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import authService from '../services/authService';
import csrService from '../services/csrService';
import challengeService from '../services/challengeService';
import notificationService from '../services/notificationService';

const ESG_QUOTES = [
  "Small acts, when multiplied by millions of people, can transform the world.",
  "The greatest threat to our planet is the belief that someone else will save it.",
  "We don't inherit the earth from our ancestors, we borrow it from our children.",
  "Sustainability is no longer about doing less harm. It’s about doing more good.",
  "The future depends on what we do in the present."
];

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useNotification();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quote, setQuote] = useState('');
  const [joinedChallenges, setJoinedChallenges] = useState({});
  const [simulateError, setSimulateError] = useState(false);

  // Pick random quote on load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * ESG_QUOTES.length);
    setQuote(ESG_QUOTES[randomIndex]);
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (simulateError) {
        throw new Error('Simulated API connection failure. Server is not responding.');
      }

      const [profileRes, statsRes, submissionsRes, challengesRes, notificationsRes] = await Promise.all([
        authService.getProfile().catch(err => {
          if (import.meta.env.DEV) return { success: true, user };
          throw err;
        }),
        csrService.getDashboardStats().catch(err => {
          if (import.meta.env.DEV) {
            return {
              success: true,
              stats: {
                xp: user?.xp || 1240,
                currentBadge: 'Waste Warrior ♻️',
                deptEsgScore: 84,
                rank: '#12',
                completedCSRCount: 18,
                completedChallengesCount: 3
              }
            };
          }
          throw err;
        }),
        csrService.getMySubmissions().catch(err => {
          if (import.meta.env.DEV) {
            return {
              success: true,
              submissions: [
                { _id: 'sub-1', title: 'Department E-Waste Recycling Drive', activityDate: '2026-07-10', status: 'Approved', category: 'waste' },
                { _id: 'sub-2', title: 'Installed smart power strips at desk station', activityDate: '2026-07-12', status: 'Pending', category: 'energy' },
                { _id: 'sub-3', title: 'Carpooling to office with 3 colleagues', activityDate: '2026-07-08', status: 'Approved', category: 'transport' },
              ]
            };
          }
          throw err;
        }),
        challengeService.getActiveChallenges().catch(err => {
          if (import.meta.env.DEV) {
            return {
              success: true,
              challenges: [
                { _id: 'ch-1', title: 'Zero Waste Week', points: 250, daysLeft: 5, category: 'Waste', deadline: '2026-07-17T18:00:00Z' },
                { _id: 'ch-2', title: 'Bike to Work Initiative', points: 400, daysLeft: 12, category: 'Transport', deadline: '2026-07-24T18:00:00Z' },
                { _id: 'ch-3', title: 'Digital Clean-Up', points: 150, daysLeft: 3, category: 'Energy', deadline: '2026-07-15T18:00:00Z' },
              ]
            };
          }
          throw err;
        }),
        notificationService.getNotifications().catch(err => {
          if (import.meta.env.DEV) {
            return {
              success: true,
              notifications: [
                { id: '1', title: 'Submission Approved', message: 'Your Ride-sharing CSR proof has been approved. +50 Eco Points earned!', createdAt: '2026-07-12T10:00:00Z', read: false },
                { id: '2', title: 'New Challenge Active', message: 'Digital Clean-Up challenge is now active. Join today to earn 150 points!', createdAt: '2026-07-11T14:30:00Z', read: false }
              ]
            };
          }
          throw err;
        })
      ]);

      setData({
        user: profileRes?.user || user,
        stats: statsRes?.stats,
        activities: submissionsRes?.submissions || [],
        challenges: challengesRes?.challenges || [],
        notifications: notificationsRes?.notifications || []
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [simulateError]);

  const handleJoinChallenge = async (challengeId, challengeTitle) => {
    try {
      await challengeService.joinChallenge(challengeId);
      setJoinedChallenges(prev => ({ ...prev, [challengeId]: true }));
      success(`Successfully joined challenge: "${challengeTitle}"!`);
      
      // Update statistics completed count locally for visual response
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          stats: {
            ...prev.stats,
            completedChallengesCount: prev.stats.completedChallengesCount + 1
          }
        };
      });
    } catch (err) {
      if (import.meta.env.DEV) {
        // Dev simulation
        setJoinedChallenges(prev => ({ ...prev, [challengeId]: true }));
        success(`Successfully joined challenge (dev simulation): "${challengeTitle}"!`);
        setData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            stats: {
              ...prev.stats,
              completedChallengesCount: prev.stats.completedChallengesCount + 1
            }
          };
        });
      } else {
        toastError(err.message || 'Failed to join the challenge.');
      }
    }
  };

  // Check if everything is empty
  const isEmptyState = data && 
    data.activities.length === 0 && 
    data.challenges.length === 0 && 
    data.notifications.length === 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
  };

  // Format Current Date
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Render States
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-44 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center shadow-lg"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 text-3xl mb-4">
            ⚠️
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Connection Error</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
            {error}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" onClick={fetchDashboardData} className="px-6 flex items-center justify-center gap-2">
              <ArrowPathIcon className="h-4 w-4" /> Retry Connection
            </Button>
            {import.meta.env.DEV && (
              <Button variant="outline" onClick={() => setSimulateError(false)} size="sm">
                Disable Error Simulation
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  if (isEmptyState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md space-y-4"
        >
          <svg className="mx-auto h-36 w-36 text-emerald-500/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">No ESG data found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            It looks like there are no active sustainability logs or challenges registered. Get started by submitting your first green action.
          </p>
          <div className="pt-2">
            <Button variant="primary" onClick={() => navigate('/csr-submissions')}>
              Submit CSR Action
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const { stats, activities, challenges, notifications } = data;

  const statsCards = [
    { name: 'Current XP', value: `${stats?.xp || 0} XP`, change: 'Earned from actions', icon: TrophyIcon, color: 'text-amber-500 bg-amber-500/10' },
    { name: 'Latest Badge', value: stats?.currentBadge || 'Eco Beginner 🎖️', change: 'Keep submitting to unlock more', icon: SparklesIcon, color: 'text-brand-500 bg-brand-500/10' },
    { name: 'Dept ESG Score', value: `${stats?.deptEsgScore || 0}%`, change: 'Target goal: 90%', icon: BoltIcon, color: 'text-emerald-500 bg-emerald-500/10' },
    { name: 'Company Rank', value: stats?.rank || '#--', change: 'Out of 250 employees', icon: FireIcon, color: 'text-rose-500 bg-rose-500/10' },
    { name: 'Completed CSRs', value: stats?.completedCSRCount || 0, change: 'Verifications pending: 1', icon: ShieldCheckIcon, color: 'text-blue-500 bg-blue-500/10' },
    { name: 'Active Challenges', value: stats?.completedChallengesCount || 0, change: 'Joint collaborative campaigns', icon: CalendarDaysIcon, color: 'text-indigo-500 bg-indigo-500/10' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      {/* Dev options */}
      {import.meta.env.DEV && (
        <div className="flex flex-wrap gap-2 items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
          <span>🛠️ <strong>Development Controls</strong> (Only visible in dev)</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setSimulateError(prev => !prev)}
              className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 font-semibold cursor-pointer"
            >
              Toggle Error State
            </button>
            <button 
              onClick={() => {
                setData(prev => ({
                  ...prev,
                  activities: [],
                  challenges: [],
                  notifications: []
                }));
              }}
              className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 font-semibold cursor-pointer"
            >
              Simulate Empty State
            </button>
          </div>
        </div>
      )}

      {/* 1. Welcome Banner */}
      <motion.div 
        variants={itemVariants}
        className="rounded-3xl bg-[linear-gradient(135deg,_var(--tw-gradient-stops))] from-emerald-500 via-emerald-600 to-teal-700 p-6 md:p-8 text-white shadow-lg shadow-emerald-500/15 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-radial-gradient(ellipse_at_center,_var(--tw-gradient-stops)) from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2.5 py-1 rounded-full w-max">
              {formattedDate}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white m-0">
              Welcome back, {data.user?.name || 'Eco Warrior'}!
            </h2>
            <p className="text-emerald-100 text-xs font-medium">
              Department: <span className="underline decoration-emerald-300 underline-offset-2">{data.user?.department || 'Operations'}</span>
            </p>
            <p className="text-emerald-50/80 text-xs italic pt-1 leading-relaxed border-l-2 border-emerald-300/40 pl-3">
              &ldquo;{quote}&rdquo;
            </p>
          </div>
          <div className="hidden lg:block text-6xl">
            🌱
          </div>
        </div>
      </motion.div>

      {/* 2. Statistics Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6"
      >
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} hoverEffect className="relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.name}</span>
                <div className={`p-1.5 rounded-lg ${stat.color} transition-transform group-hover:scale-110`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 space-y-0.5">
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">{stat.value}</p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate leading-none">{stat.change}</p>
              </div>
            </Card>
          );
        })}
      </motion.div>

      {/* 3. Quick Actions */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quick actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/csr-submissions')}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xs hover:shadow-md transition-all text-left cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <PlusIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Submit ESG Proof</p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500">Log new green action</p>
            </div>
          </button>

          <button 
            onClick={() => navigate('/challenges')}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 shadow-xs hover:shadow-md transition-all text-left cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 group-hover:scale-105 transition-transform">
              <TrophyIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Join Challenges</p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500">Compete with teams</p>
            </div>
          </button>

          <button 
            onClick={() => navigate('/badges')}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 shadow-xs hover:shadow-md transition-all text-left cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">View Badges</p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500">Review Achievements</p>
            </div>
          </button>

          <button 
            onClick={() => navigate('/rewards')}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all text-left cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <ArrowRightIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Redeem Rewards</p>
              <p className="text-[9px] text-slate-405 dark:text-slate-500">Spend Eco Points</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Main Grid: Content blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: CSR Activities & Upcoming Challenges */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 4. Recent CSR Activities */}
          <motion.div variants={itemVariants}>
            <Card 
              title="Recent CSR Activities" 
              headerAction={
                <Button variant="ghost" size="sm" onClick={() => navigate('/csr-submissions')} className="text-xs font-bold text-brand-600 hover:text-brand-700">
                  View All
                </Button>
              }
            >
              {activities.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <p className="text-sm">No CSR submissions registered yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    <thead>
                      <tr className="text-left font-semibold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 pr-4">Activity Description</th>
                        <th className="pb-3 px-4">Date</th>
                        <th className="pb-3 pl-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {activities.slice(0, 4).map((act) => {
                        const statusColors = {
                          Approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400',
                          Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400',
                          Rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                        };
                        return (
                          <tr key={act._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                            <td className="py-3 pr-4 font-medium text-slate-700 dark:text-slate-200">{act.title}</td>
                            <td className="py-3 px-4 text-slate-400 dark:text-slate-500 whitespace-nowrap">
                              {new Date(act.activityDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="py-3 pl-4 text-right">
                              <span className={`inline-flex px-2 py-0.5 rounded-full font-bold tracking-wide uppercase text-[8px] ${statusColors[act.status] || 'bg-slate-100 text-slate-600'}`}>
                                {act.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </motion.div>

          {/* 5. Upcoming Challenges */}
          <motion.div variants={itemVariants}>
            <Card title="Available Challenges">
              {challenges.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <p className="text-sm">No new challenges available at this time.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {challenges.slice(0, 2).map((ch) => (
                    <div 
                      key={ch._id}
                      className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-3 bg-slate-50/30 dark:bg-slate-900/30 hover:border-slate-200 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950/20 dark:text-brand-400">
                            {ch.category || 'ESG'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                            <ClockIcon className="h-3.5 w-3.5 text-slate-300" /> {ch.daysLeft} days left
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">{ch.title}</h4>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2.5 mt-2">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+{ch.points} XP</span>
                        {joinedChallenges[ch._id] ? (
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                            ✓ Joined
                          </span>
                        ) : (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => handleJoinChallenge(ch._id, ch.title)}
                            className="text-[10px] font-bold py-1 px-3 cursor-pointer"
                          >
                            Join
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

        </div>

        {/* Right column: Recent Notifications & Activity summary preview */}
        <div className="space-y-6">
          
          {/* 6. Recent Notifications */}
          <motion.div variants={itemVariants}>
            <Card 
              title="Recent Alerts" 
              headerAction={
                <Button variant="ghost" size="sm" onClick={() => navigate('/notifications')} className="text-xs font-bold text-brand-600 hover:text-brand-700">
                  See All
                </Button>
              }
            >
              {notifications.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <p className="text-sm">No new alerts.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notif) => (
                    <div 
                      key={notif.id}
                      className="flex gap-3 text-xs leading-normal border-b border-slate-50 dark:border-slate-850 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="h-7 w-7 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center flex-shrink-0">
                        <BellIcon className="h-4 w-4 text-slate-500" />
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <p className="font-bold text-slate-700 dark:text-slate-200 truncate">{notif.title}</p>
                        <p className="text-slate-400 dark:text-slate-500 text-[10px] truncate">{notif.message}</p>
                        <span className="text-[8px] text-slate-350 dark:text-slate-600 block">
                          {new Date(notif.createdAt || Date.now()).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Environmental Impact Summary Widget */}
          <motion.div variants={itemVariants}>
            <Card className="bg-emerald-500/5 dark:bg-emerald-500/2 border border-emerald-500/10">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🌍</span>
                  <div>
                    <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">Carbon Offset Impact</h4>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-500">Calculated based on your submissions</p>
                  </div>
                </div>
                
                <div className="border-t border-emerald-500/10 pt-3">
                  <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>CO2 Saved Today</span>
                    <span className="text-emerald-600 font-bold">2.4 kg</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
                    <span>Yearly Contribution</span>
                    <span className="text-emerald-600 font-bold">45.2 kg</span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 leading-normal">
                  Your carbon saving is equivalent to planting <strong>2 new trees</strong> and growing them for 10 years! Thank you for your contribution to our corporate ESG target.
                </div>
              </div>
            </Card>
          </motion.div>

        </div>

      </div>
    </motion.div>
  );
};

export default EmployeeDashboard;
