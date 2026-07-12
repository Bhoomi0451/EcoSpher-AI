import React, { useState } from 'react';
import BadgeCard from '../components/BadgeCard';

const Badges = () => {
  const [filter, setFilter] = useState('all');

  const mockBadges = [
    { name: 'Tree Planter', description: 'Participated in tree planting activity.', icon: '🌳', points: 100, dateEarned: '2026-05-15', isEarned: true },
    { name: 'Eco Commuter', description: 'Commuted by cycling or walking 10 times.', icon: '🚲', points: 200, dateEarned: '2026-06-20', isEarned: true },
    { name: 'Waste Warrior', description: 'Successfully completed Zero Waste Challenge.', icon: '♻️', points: 300, dateEarned: '2026-07-02', isEarned: true },
    { name: 'Power Saver', description: 'Reduced office desk energy usage by 15% in a month.', icon: '💡', points: 150, dateEarned: null, isEarned: false },
    { name: 'Water Guard', description: 'Logged 5 water-saving routines.', icon: '💧', points: 120, dateEarned: null, isEarned: false },
    { name: 'ESG Champion', description: 'Obtained approval for 10 CSR submissions.', icon: '🛡️', points: 500, dateEarned: null, isEarned: false },
  ];

  const filteredBadges = mockBadges.filter(badge => {
    if (filter === 'earned') return badge.isEarned;
    if (filter === 'locked') return !badge.isEarned;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Badges & Achievements</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Unlock achievements by contributing to corporate sustainability initiatives.
          </p>
        </div>

        {/* Filters */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 self-start sm:self-auto">
          {['all', 'earned', 'locked'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                filter === tab
                  ? 'bg-white text-slate-800 shadow-xs dark:bg-slate-900 dark:text-slate-200'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map((badge) => (
          <BadgeCard key={badge.name} badge={badge} />
        ))}
      </div>
    </div>
  );
};

export default Badges;
