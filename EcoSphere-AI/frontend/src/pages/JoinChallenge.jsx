import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { useNotification } from '../context/NotificationContext';
import challengeService from '../services/challengeService';
import { 
  TrophyIcon, 
  CalendarDaysIcon, 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const JoinChallenge = () => {
  const { success, error: toastError } = useNotification();
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // User progress tracker locally (storing joined challenge IDs)
  const [joinedStates, setJoinedStates] = useState({});
  const [progressStates, setProgressStates] = useState({});

  const fetchChallenges = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await challengeService.getActiveChallenges();
      // Assume API returns array of challenges or { success: true, challenges: [...] }
      const list = Array.isArray(data) ? data : data.challenges || [];
      setChallenges(list);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('Development Mode: Backend active challenges API failed. Using mock challenges.');
        // Fallback mock challenges
        setChallenges([
          {
            _id: 'ch-1',
            title: 'Zero Waste Week',
            description: 'Avoid single-use plastics and minimize landfill trash for a full week. Track garbage bags and refuse details daily.',
            points: 250,
            participants: 42,
            category: 'Waste',
            daysLeft: 5,
            deadline: '2026-07-17T18:00:00Z',
            progress: 0
          },
          {
            _id: 'ch-2',
            title: 'Bike to Work Initiative',
            description: 'Commute via bicycle or walk to the office at least 3 times this week. Snap a photo of your commute or route tracker.',
            points: 400,
            participants: 19,
            category: 'Transport',
            daysLeft: 12,
            deadline: '2026-07-24T18:00:00Z',
            progress: 33
          },
          {
            _id: 'ch-3',
            title: 'Digital Clean-Up Day',
            description: 'Clean cloud servers and inbox space to reduce digital carbon footprint. Delete old emails and archive inactive records.',
            points: 150,
            participants: 68,
            category: 'Energy',
            daysLeft: 3,
            deadline: '2026-07-15T18:00:00Z',
            progress: 0
          },
          {
            _id: 'ch-4',
            title: 'Office Thermostat Adjustment',
            description: 'Keep desktop temperature set to energy-saving level (24C or above) for 10 consecutive business days.',
            points: 200,
            participants: 25,
            category: 'Energy',
            daysLeft: 8,
            deadline: '2026-07-20T18:00:00Z',
            progress: 50
          },
          {
            _id: 'ch-5',
            title: 'Water Conservation Awareness',
            description: 'Submit 5 water-saving routines (e.g. reporting leaks, using aerated taps) implemented in your department.',
            points: 180,
            participants: 14,
            category: 'Conservation',
            daysLeft: 15,
            deadline: '2026-07-27T18:00:00Z',
            progress: 0
          }
        ]);
      } else {
        setError(err.message || 'Failed to load challenges.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleJoin = async (challengeId, title) => {
    try {
      await challengeService.joinChallenge(challengeId);
      setJoinedStates(prev => ({ ...prev, [challengeId]: true }));
      setProgressStates(prev => ({ ...prev, [challengeId]: 10 })); // Start at 10% progress
      success(`Successfully joined challenge: "${title}"!`);
    } catch (err) {
      if (import.meta.env.DEV) {
        setJoinedStates(prev => ({ ...prev, [challengeId]: true }));
        setProgressStates(prev => ({ ...prev, [challengeId]: 10 }));
        success(`Successfully joined challenge (simulation): "${title}"!`);
      } else {
        toastError(err.message || 'Failed to join challenge.');
      }
    }
  };

  // Get distinct categories
  const categories = ['All', ...new Set(challenges.map(c => c.category))];

  // Filter and search logic
  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="flex gap-4">
          <div className="h-10 flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto text-center p-6 space-y-4">
        <span className="text-4xl">⚠️</span>
        <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Failed to Load Challenges</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{error}</p>
        <Button variant="primary" onClick={fetchChallenges} className="flex items-center gap-1.5 mx-auto">
          <ArrowPathIcon className="h-4 w-4" /> Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Green ESG Challenges</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Participate in collective corporate initiatives, log your green habits, and claim Eco Points.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <MagnifyingGlassIcon className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search challenges by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Categories filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full sm:max-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl border cursor-pointer transition-all duration-150 whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-950/20 dark:border-brand-900 dark:text-brand-400 font-bold'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-850 dark:text-slate-455 dark:hover:text-slate-250'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      {filteredChallenges.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <span className="text-4xl">🏅</span>
          <p className="mt-2 text-sm">No challenges match your criteria.</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredChallenges.map((challenge) => {
              const isJoined = joinedStates[challenge._id];
              const progress = progressStates[challenge._id] !== undefined ? progressStates[challenge._id] : (challenge.progress || 0);

              return (
                <motion.div
                  key={challenge._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    title={challenge.title}
                    headerAction={
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {challenge.category}
                      </span>
                    }
                    footer={
                      <div className="flex w-full items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><CalendarDaysIcon className="h-4 w-4 text-slate-350" /> {challenge.daysLeft} days left</span>
                        <span className="flex items-center gap-1"><UserGroupIcon className="h-4 w-4 text-slate-350" /> {challenge.participants + (isJoined ? 1 : 0)} participants</span>
                      </div>
                    }
                    hoverEffect
                    className="flex flex-col justify-between h-full"
                  >
                    <div className="space-y-4">
                      <p className="text-slate-500 dark:text-slate-400 text-xs min-h-[50px] leading-relaxed">
                        {challenge.description}
                      </p>

                      {/* Progress bar */}
                      {isJoined && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500">
                            <span>Challenge Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-brand-500 dark:bg-brand-400 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <TrophyIcon className="h-4 w-4" /> +{challenge.points} XP
                        </span>
                        
                        <Button
                          variant={isJoined ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => handleJoin(challenge._id, challenge.title)}
                          disabled={isJoined}
                          className="cursor-pointer font-semibold"
                        >
                          {isJoined ? '✓ Joined' : 'Join Challenge'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default JoinChallenge;
