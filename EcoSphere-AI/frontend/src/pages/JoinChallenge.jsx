import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNotification } from '../context/NotificationContext';

const JoinChallenge = () => {
  const { success } = useNotification();
  const [joined, setJoined] = useState({});

  const mockChallenges = [
    {
      id: 'ch-1',
      title: 'Zero Waste Week',
      description: 'Avoid single-use plastics and minimize landfill trash for a full week.',
      points: 250,
      participants: 42,
      category: 'Waste',
      daysLeft: 5,
    },
    {
      id: 'ch-2',
      title: 'Bike to Work Initiative',
      description: 'Commute via bicycle or walk to the office at least 3 times this week.',
      points: 400,
      participants: 19,
      category: 'Transport',
      daysLeft: 12,
    },
    {
      id: 'ch-3',
      title: 'Digital Clean-Up',
      description: 'Clean cloud servers and inbox space to reduce digital carbon footprint.',
      points: 150,
      participants: 68,
      category: 'Energy',
      daysLeft: 3,
    },
  ];

  const handleJoin = (id, title) => {
    setJoined(prev => ({ ...prev, [id]: true }));
    success(`Successfully joined challenge: ${title}! Keep up the green work.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Green ESG Challenges</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Participate in collective initiatives to decrease environmental impact and earn bonus Eco Points.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockChallenges.map((challenge) => (
          <Card
            key={challenge.id}
            title={challenge.title}
            headerAction={
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {challenge.category}
              </span>
            }
            footer={
              <div className="flex w-full items-center justify-between">
                <span>{challenge.daysLeft} days left</span>
                <span>{challenge.participants} active participants</span>
              </div>
            }
          >
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400 text-xs min-h-[40px]">
                {challenge.description}
              </p>
              
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                  +{challenge.points} XP
                </span>
                
                <Button
                  variant={joined[challenge.id] ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => handleJoin(challenge.id, challenge.title)}
                  disabled={joined[challenge.id]}
                  className="cursor-pointer"
                >
                  {joined[challenge.id] ? 'Joined' : 'Join Challenge'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JoinChallenge;
