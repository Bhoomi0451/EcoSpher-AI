import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import rewardService from '../services/rewardService';
import authService from '../services/authService';
import { 
  GiftIcon, 
  ShoppingBagIcon, 
  ArrowPathIcon,
  InformationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const RewardStore = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useNotification();
  
  const [rewards, setRewards] = useState([]);
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeeming, setRedeeming] = useState(false);

  const loadRewardStoreData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [profileData, rewardsData] = await Promise.all([
        authService.getProfile().catch(err => {
          if (import.meta.env.DEV) return { success: true, user: { xp: user?.xp || 1240 } };
          throw err;
        }),
        rewardService.getRewards().catch(err => {
          if (import.meta.env.DEV) {
            return {
              success: true,
              rewards: [
                { _id: 'rw-1', name: 'Plant a Real Tree', cost: 300, description: 'We will plant a native tree in your name with tracking coordinates.', icon: '🌱', stock: 95 },
                { _id: 'rw-2', name: 'Organic Cotton Eco-Tote', cost: 500, description: 'Handcrafted fairtrade cotton tote bag featuring the EcoSphere logo.', icon: '👜', stock: 8 },
                { _id: 'rw-3', name: 'Eco Water Flask (750ml)', cost: 800, description: 'Double-walled insulated stainless steel bottle to eliminate plastic waste.', icon: '🍶', stock: 3 },
                { _id: 'rw-4', name: 'Local Coffee Voucher', cost: 200, description: 'Free shade-grown espresso drink at partner local sustainable coffee house.', icon: '☕', stock: 50 },
                { _id: 'rw-5', name: 'Bamboo Cutlery Set', cost: 450, description: 'Portable reusable bamboo fork, knife, spoon, and metal straw pouch.', icon: '🍴', stock: 12 }
              ]
            };
          }
          throw err;
        })
      ]);

      setPoints(profileData.user?.xp || 0);
      
      const list = Array.isArray(rewardsData) ? rewardsData : rewardsData.rewards || [];
      setRewards(list);
    } catch (err) {
      setError(err.message || 'Failed to load reward store content.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRewardStoreData();
  }, []);

  const openRedeemConfirmation = (reward) => {
    if (points < reward.cost) {
      toastError(`Insufficient points. You need ${reward.cost - points} more Eco Points.`);
      return;
    }
    if (reward.stock <= 0) {
      toastError('This item is currently out of stock.');
      return;
    }
    setSelectedReward(reward);
    setIsConfirmOpen(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    setIsConfirmOpen(false);
    setRedeeming(true);

    try {
      await rewardService.redeemReward(selectedReward._id);
      
      // Update local state points and stock counts
      setPoints(prev => prev - selectedReward.cost);
      setRewards(prev => prev.map(item => 
        item._id === selectedReward._id ? { ...item, stock: item.stock - 1 } : item
      ));

      success(`Successfully redeemed: "${selectedReward.name}"! Check email for receipt.`);
    } catch (err) {
      if (import.meta.env.DEV) {
        // Dev Simulation
        setPoints(prev => prev - selectedReward.cost);
        setRewards(prev => prev.map(item => 
          item._id === selectedReward._id ? { ...item, stock: item.stock - 1 } : item
        ));
        success(`Successfully redeemed (dev simulation): "${selectedReward.name}"!`);
      } else {
        toastError(err.message || 'Failed to redeem reward.');
      }
    } finally {
      setRedeeming(false);
      setSelectedReward(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-14 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-72 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto text-center p-6 space-y-4">
        <span className="text-4xl">⚠️</span>
        <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Failed to Load Rewards</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{error}</p>
        <Button variant="primary" onClick={loadRewardStoreData} className="flex items-center gap-1.5 mx-auto">
          <ArrowPathIcon className="h-4 w-4" /> Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Eco Rewards Store</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Spend your earned Eco Points on sustainable products or environmental impact donations.
          </p>
        </div>

        {/* Current Points Balance Card */}
        <div className="flex items-center space-x-3 rounded-2xl bg-brand-50 border border-brand-200 dark:bg-brand-950/20 dark:border-brand-900 px-4 py-2.5 self-start sm:self-auto shadow-xs">
          <span className="text-xl">💎</span>
          <div>
            <p className="text-[10px] text-brand-650 dark:text-brand-400 font-bold uppercase tracking-wider leading-none">Your Balance</p>
            <p className="text-base font-black text-brand-850 dark:text-brand-350 leading-none mt-1.5">{points} XP</p>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      {rewards.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <span className="text-4xl">🎁</span>
          <p className="mt-2 text-sm">No rewards currently configured in the shop.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rewards.map((reward) => {
            const isOutOfStock = reward.stock <= 0;
            const isAffordable = points >= reward.cost;

            return (
              <Card 
                key={reward._id} 
                hoverEffect 
                className="flex flex-col justify-between h-full relative"
              >
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start">
                    <span className="text-4xl">{reward.icon || '🎁'}</span>
                    
                    {/* Stock status indicator */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isOutOfStock 
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400' 
                        : reward.stock <= 5 
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 animate-pulse'
                          : 'bg-slate-100 text-slate-550 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {isOutOfStock ? 'Out of Stock' : `${reward.stock} in stock`}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">{reward.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed min-h-[48px]">
                      {reward.description}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-4 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-200">{reward.cost} XP</span>
                  
                  <Button
                    variant={isOutOfStock ? 'secondary' : isAffordable ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => openRedeemConfirmation(reward)}
                    disabled={isOutOfStock || redeeming}
                    className="cursor-pointer text-xs font-semibold px-4"
                  >
                    {isOutOfStock ? 'Sold Out' : 'Redeem'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Confirm Reward Redemption"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmRedeem} loading={redeeming}>
              Confirm Redemption
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-brand-50 dark:bg-brand-950/20 text-brand-800 dark:text-brand-350 rounded-xl text-xs leading-normal">
            <InformationCircleIcon className="h-5 w-5 flex-shrink-0 text-brand-500 mt-0.5" />
            <p>
              Redeeming this item will deduct <strong>{selectedReward?.cost} XP</strong> from your total points balance. This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center gap-3.5 p-4 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl">
            <span className="text-4xl">{selectedReward?.icon}</span>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">{selectedReward?.name}</h4>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 leading-snug">{selectedReward?.description}</p>
              <p className="text-[10px] font-black text-emerald-650 dark:text-emerald-450 mt-1.5">Redemption cost: {selectedReward?.cost} XP</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RewardStore;
