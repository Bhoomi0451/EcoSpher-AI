import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { useNotification } from '../context/NotificationContext';
import badgeService from '../services/badgeService';
import { 
  AcademicCapIcon, 
  ArrowPathIcon,
  CheckBadgeIcon,
  LockClosedIcon,
  CalendarDaysIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const Badges = () => {
  const { error: toastError } = useNotification();
  const [allBadges, setAllBadges] = useState([]);
  const [earnedBadgeNames, setEarnedBadgeNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering & Modal state
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const fetchBadgeData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [allRes, earnedRes] = await Promise.all([
        badgeService.getAllBadges().catch(err => {
          if (import.meta.env.DEV) {
            return {
              success: true,
              badges: [
                { _id: 'bd-1', name: 'Tree Planter', description: 'Participated in a reforestation or tree planting activity.', icon: '🌳', points: 100, requirement: 'Verify 1 forestry or tree planting activity submission' },
                { _id: 'bd-2', name: 'Eco Commuter', description: 'Commuted by cycling, walking, or public transport 10 times.', icon: '🚲', points: 200, requirement: 'Log 10 sustainable transportation commutes' },
                { _id: 'bd-3', name: 'Waste Warrior', description: 'Successfully completed the Zero Waste Challenge.', icon: '♻️', points: 300, requirement: 'Complete the Zero Waste Week campaign' },
                { _id: 'bd-4', name: 'Power Saver', description: 'Reduced office desk energy usage by 15% in a month.', icon: '💡', points: 150, requirement: 'Log 5 workstation energy savings proofs' },
                { _id: 'bd-5', name: 'Water Guard', description: 'Logged 5 water-saving routines in your department.', icon: '💧', points: 120, requirement: 'Review and report water leaks or usage reductions' },
                { _id: 'bd-6', name: 'ESG Champion', description: 'Obtained approval for 10 CSR submissions.', icon: '🛡️', points: 500, requirement: 'Receive approval for 10 CSR activity filings' },
              ]
            };
          }
          throw err;
        }),
        badgeService.getEarnedBadges().catch(err => {
          if (import.meta.env.DEV) {
            return {
              success: true,
              earned: ['Tree Planter', 'Eco Commuter', 'Waste Warrior']
            };
          }
          throw err;
        })
      ]);

      const badgeList = Array.isArray(allRes) ? allRes : allRes.badges || [];
      const earnedList = Array.isArray(earnedRes) ? earnedRes : earnedRes.earned || [];
      
      setAllBadges(badgeList);
      setEarnedBadgeNames(earnedList);
    } catch (err) {
      setError(err.message || 'Failed to fetch badge achievements.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBadgeData();
  }, []);

  const openDetailsModal = (badge, isEarned) => {
    setSelectedBadge({
      ...badge,
      isEarned,
      // Simulate earned dates for demo/visual completeness
      dateEarned: isEarned ? 'July 12, 2026' : null
    });
    setIsModalOpen(true);
  };

  // Map earned state
  const badgesWithStatus = allBadges.map(badge => ({
    ...badge,
    isEarned: earnedBadgeNames.includes(badge.name)
  }));

  const earnedCount = badgesWithStatus.filter(b => b.isEarned).length;
  const totalCount = badgesWithStatus.length;
  const progressPercent = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

  const filteredBadges = badgesWithStatus.filter(badge => {
    if (filter === 'earned') return badge.isEarned;
    if (filter === 'locked') return !badge.isEarned;
    return true;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="h-32 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto text-center p-6 space-y-4">
        <span className="text-4xl">⚠️</span>
        <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Failed to Load Badges</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{error}</p>
        <Button variant="primary" onClick={fetchBadgeData} className="flex items-center gap-1.5 mx-auto">
          <ArrowPathIcon className="h-4 w-4" /> Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Badges & Achievements</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Unlock achievements and showcase your environmental impact on the leaderboards.
          </p>
        </div>

        {/* Filters */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 self-start sm:self-auto">
          {['all', 'earned', 'locked'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                filter === tab
                  ? 'bg-white text-slate-800 shadow-xs dark:bg-slate-900 dark:text-slate-200 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Achievement Progress Tracker Card */}
      <Card className="bg-[linear-gradient(135deg,_var(--tw-gradient-stops))] from-indigo-500/5 to-purple-500/5 border border-indigo-500/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left flex-1">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Unlock Achievements</h3>
            <p className="text-xs text-slate-550 dark:text-slate-450 leading-relaxed max-w-lg">
              Collect badges by performing green initiatives. Each badge awards bonus XP to increase your ranking inside your department.
            </p>
          </div>
          
          <div className="w-full md:max-w-xs space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckBadgeIcon className="h-4 w-4 text-emerald-500" />
                {earnedCount} of {totalCount} Badges Earned
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[linear-gradient(90deg,_var(--tw-gradient-stops))] from-indigo-500 to-purple-600 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Badges Grid */}
      {filteredBadges.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <span className="text-4xl">🎖️</span>
          <p className="mt-2 text-sm">No achievements match this filter.</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredBadges.map((badge) => (
              <motion.div
                key={badge._id}
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={() => openDetailsModal(badge, badge.isEarned)}
                className="cursor-pointer"
              >
                <Card 
                  hoverEffect 
                  className={`relative overflow-hidden group h-full flex flex-col justify-between p-5 border ${
                    badge.isEarned 
                      ? 'border-indigo-100 hover:border-indigo-300 dark:border-slate-850 dark:hover:border-slate-750' 
                      : 'border-slate-200 dark:border-slate-850 opacity-70'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Badge Icon (colored vs grayscale) */}
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 transition-transform group-hover:scale-105 shadow-xs ${
                      badge.isEarned 
                        ? 'bg-indigo-50 dark:bg-indigo-950/20' 
                        : 'bg-slate-100 dark:bg-slate-850 filter grayscale'
                    }`}>
                      {badge.icon}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate leading-snug">{badge.name}</h4>
                        {!badge.isEarned && <LockClosedIcon className="h-3.5 w-3.5 text-slate-400" />}
                      </div>
                      <p className="text-slate-500 dark:text-slate-450 text-xs leading-normal truncate-2-lines">
                        {badge.description}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-4 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-emerald-600 dark:text-emerald-450">+{badge.points} XP</span>
                    <span className={badge.isEarned ? 'text-indigo-600 dark:text-brand-400' : 'text-slate-400'}>
                      {badge.isEarned ? 'Earned' : 'Locked'}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Badge Achievements details"
        footer={
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>
            Close Details
          </Button>
        }
      >
        {selectedBadge && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className={`h-20 w-20 rounded-3xl flex items-center justify-center text-4xl shadow-md ${
                selectedBadge.isEarned 
                  ? 'bg-indigo-50 dark:bg-indigo-950/20' 
                  : 'bg-slate-100 dark:bg-slate-800 filter grayscale'
              }`}>
                {selectedBadge.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">{selectedBadge.name}</h4>
                  {selectedBadge.isEarned ? (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded-full">Earned</span>
                  ) : (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <LockClosedIcon className="h-2.5 w-2.5" /> Locked
                    </span>
                  )}
                </div>
                <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">+{selectedBadge.points} XP Achievement</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Description</span>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{selectedBadge.description}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Requirements to unlock</span>
                <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
                  <InformationCircleIcon className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <p>{selectedBadge.requirement}</p>
                </div>
              </div>

              {selectedBadge.isEarned && (
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                  <CalendarDaysIcon className="h-4.5 w-4.5" />
                  <span>Unlocked on {selectedBadge.dateEarned}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Badges;
