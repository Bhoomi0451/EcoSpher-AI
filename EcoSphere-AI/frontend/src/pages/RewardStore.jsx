import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNotification } from '../context/NotificationContext';

const RewardStore = () => {
  const { success, error } = useNotification();
  const [points, setPoints] = useState(1240);

  const mockRewards = [
    { id: 'rw-1', name: 'Plant a Real Tree', cost: 300, description: 'We will plant a native tree in your name with tracking coordinates.', icon: '🌱' },
    { id: 'rw-2', name: 'Organic Cotton Eco-Tote', cost: 500, description: 'Handcrafted fairtrade cotton tote bag featuring the EcoSphere logo.', icon: '👜' },
    { id: 'rw-3', name: 'Eco Water Flask (750ml)', cost: 800, description: 'Double-walled insulated stainless steel bottle to eliminate plastic waste.', icon: '🍶' },
    { id: 'rw-4', name: 'Local Organic Coffee Voucher', cost: 200, description: 'Free shade-grown espresso drink at partner local sustainable coffee house.', icon: '☕' },
  ];

  const handleRedeem = (reward) => {
    if (points < reward.cost) {
      error(`Insufficient points. You need ${reward.cost - points} more Eco Points.`);
      return;
    }
    setPoints(prev => prev - reward.cost);
    success(`Redeemed: ${reward.name}! Confirmation email is on its way.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Eco Rewards Store</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Spend your earned Eco Points on sustainable products or environmental impact donations.
          </p>
        </div>

        {/* Current Points Balance */}
        <div className="flex items-center space-x-3 rounded-2xl bg-brand-50 border border-brand-200 dark:bg-brand-950/20 dark:border-brand-900 px-4 py-2.5 self-start sm:self-auto shadow-xs">
          <span className="text-xl">💎</span>
          <div>
            <p className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold uppercase tracking-wider leading-none">Your Balance</p>
            <p className="text-lg font-bold text-brand-800 dark:text-brand-300 leading-none mt-1">{points} Points</p>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockRewards.map((reward) => (
          <Card key={reward.id} hoverEffect className="flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="text-4xl">{reward.icon}</div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{reward.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed min-h-[48px]">{reward.description}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-4 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{reward.cost} pts</span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleRedeem(reward)}
                className="cursor-pointer"
              >
                Redeem
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RewardStore;
