import React, { createContext, useContext, useState, useEffect } from 'react';
import { Reward, UnlockedReward } from '../data/types';
import { safeStorage } from '../utils/storage';
import { logger } from '../utils/logger';

interface RewardsContextType {
  coinBalance: number;
  addCoins: (amount: number) => void;
  deductCoins: (amount: number) => boolean;
  rewards: Reward[];
  unlockedRewards: UnlockedReward[];
  addReward: (reward: Omit<Reward, 'id' | 'isCustom'>) => void;
  deleteReward: (id: string) => void;
  updateReward: (id: string, updates: Partial<Pick<Reward, 'title' | 'cost'>>) => void;
  addUnlockedReward: (reward: Reward) => void;
  toggleRewardFulfilled: (id: string) => void;
}

const DEFAULT_REWARDS: Reward[] = [
  { id: 'r1', title: 'New HW / MB Car', cost: 5, icon: 'car-sport-outline', isCustom: false },
  { id: 'r2', title: 'Ice Cream At McDonald\'s', cost: 10, icon: 'ice-cream-outline', isCustom: false },
  { id: 'r3', title: 'New Dry Erase Markers', cost: 15, icon: 'pencil-outline', isCustom: false },
  { id: 'r4', title: 'New Coloring Book', cost: 25, icon: 'book-outline', isCustom: false },
  { id: 'r5', title: 'New Captain Underpants Book', cost: 50, icon: 'book-outline', isCustom: false },
];

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export const RewardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coinBalance, setCoinBalance] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>(DEFAULT_REWARDS);
  const [unlockedRewards, setUnlockedRewards] = useState<UnlockedReward[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedCoins = await safeStorage.get<number>('@coin_balance', 0);
        
        // Auto-correct any leftover stats from older versions of the app where 
        // payouts were 1 coin. Since all quizzes now give 5 coins, any balance 
        // not divisible by 5 is invalid.
        if (storedCoins > 0 && storedCoins % 5 !== 0) {
          setCoinBalance(0);
          safeStorage.set('@coin_balance', 0);
        } else {
          setCoinBalance(Math.max(0, storedCoins));
        }

        const storedRewards = await safeStorage.get<Reward[]>('@custom_rewards', []);
        setRewards([...DEFAULT_REWARDS, ...storedRewards]);

        const storedUnlocked = await safeStorage.get<UnlockedReward[]>('@unlocked_rewards', []);
        setUnlockedRewards(storedUnlocked);
      } catch (e) {
        logger.error('Failed to load rewards data', e);
        setCoinBalance(0);
        setRewards(DEFAULT_REWARDS);
        setUnlockedRewards([]);
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

  const saveUnlockedRewards = async (newUnlocked: UnlockedReward[]) => {
    const success = await safeStorage.set('@unlocked_rewards', newUnlocked);
    if (!success) {
      logger.warn('Failed to save unlocked rewards');
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

  const deleteReward = (id: string) => {
    const newRewards = rewards.filter(r => r.id !== id);
    setRewards(newRewards);
    saveCustomRewards(newRewards);
  };

  const updateReward = (id: string, updates: Partial<Pick<Reward, 'title' | 'cost'>>) => {
    const newRewards = rewards.map(r => r.id === id ? { ...r, ...updates } : r);
    setRewards(newRewards);
    saveCustomRewards(newRewards);
  };

  const addUnlockedReward = (reward: Reward) => {
    const newUnlocked: UnlockedReward = {
      id: `unlocked_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      rewardId: reward.id,
      title: reward.title,
      cost: reward.cost,
      icon: reward.icon || 'gift',
      timestamp: Date.now(),
      isFulfilled: false,
    };
    // Prepend so newest is at the top
    const newList = [newUnlocked, ...unlockedRewards];
    setUnlockedRewards(newList);
    saveUnlockedRewards(newList);
  };

  const toggleRewardFulfilled = (id: string) => {
    const newList = unlockedRewards.map(r => 
      r.id === id ? { ...r, isFulfilled: !r.isFulfilled } : r
    );
    setUnlockedRewards(newList);
    saveUnlockedRewards(newList);
  };

  if (!isLoaded) return null;

  return (
    <RewardsContext.Provider value={{ 
      coinBalance, 
      addCoins, 
      deductCoins, 
      rewards, 
      unlockedRewards,
      addReward,
      deleteReward,
      updateReward,
      addUnlockedReward,
      toggleRewardFulfilled
    }}>
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
