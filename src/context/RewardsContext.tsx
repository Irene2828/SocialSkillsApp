import React, { createContext, useContext, useState, useEffect } from 'react';
import { Reward } from '../data/types';
import { safeStorage } from '../utils/storage';
import { logger } from '../utils/logger';

interface RewardsContextType {
  coinBalance: number;
  addCoins: (amount: number) => void;
  deductCoins: (amount: number) => boolean;
  rewards: Reward[];
  addReward: (reward: Omit<Reward, 'id' | 'isCustom'>) => void;
}

const DEFAULT_REWARDS: Reward[] = [
  { id: 'r1', title: 'Ice Cream', cost: 5, icon: 'ice-cream-outline', isCustom: false },
  { id: 'r2', title: 'Movie Night', cost: 10, icon: 'film-outline', isCustom: false },
  { id: 'r3', title: 'Extra Game Time', cost: 8, icon: 'game-controller-outline', isCustom: false },
  { id: 'r4', title: 'Bike Adventure', cost: 15, icon: 'bicycle-outline', isCustom: false },
  { id: 'r5', title: 'Surprise Toy', cost: 20, icon: 'gift-outline', isCustom: false },
];

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export const RewardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coinBalance, setCoinBalance] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>(DEFAULT_REWARDS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedCoins = await safeStorage.get<number>('@coin_balance', 0);
        setCoinBalance(Math.max(0, storedCoins));

        const storedRewards = await safeStorage.get<Reward[]>('@custom_rewards', []);
        setRewards([...DEFAULT_REWARDS, ...storedRewards]);
      } catch (e) {
        logger.error('Failed to load rewards data', e);
        setCoinBalance(0);
        setRewards(DEFAULT_REWARDS);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  const saveCoins = async (newBalance: number) => {
    const validBalance = Math.max(0, newBalance);
    const success = await safeStorage.set('@coin_balance', validBalance);
    if (!success) {
      logger.warn('Failed to save coins, rolling back');
      setCoinBalance(coinBalance); // rollback on fail
    }
  };

  const saveCustomRewards = async (newRewards: Reward[]) => {
    const customOnly = newRewards.filter(r => r.isCustom);
    const success = await safeStorage.set('@custom_rewards', customOnly);
    if (!success) {
      logger.warn('Failed to save custom rewards');
    }
  };

  const addCoins = (amount: number) => {
    const validAmount = Math.max(0, amount);
    const newBalance = coinBalance + validAmount;
    setCoinBalance(newBalance);
    saveCoins(newBalance);
  };

  const deductCoins = (amount: number) => {
    const validAmount = Math.max(0, amount);
    if (coinBalance >= validAmount) {
      const newBalance = coinBalance - validAmount;
      setCoinBalance(newBalance);
      saveCoins(newBalance);
      logger.info('reward_redeemed', { amount: validAmount, newBalance });
      return true;
    }
    return false;
  };

  const addReward = (rewardData: Omit<Reward, 'id' | 'isCustom'>) => {
    const newReward: Reward = {
      ...rewardData,
      id: `custom_${Date.now()}`,
      isCustom: true,
      icon: rewardData.icon || 'star-outline',
    };
    const newRewards = [...rewards, newReward];
    setRewards(newRewards);
    saveCustomRewards(newRewards);
  };

  if (!isLoaded) return null;

  return (
    <RewardsContext.Provider value={{ coinBalance, addCoins, deductCoins, rewards, addReward }}>
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (context === undefined) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
};
