import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reward } from '../data/types';

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
        const storedCoins = await AsyncStorage.getItem('@coin_balance');
        if (storedCoins !== null) {
          setCoinBalance(parseFloat(storedCoins));
        }

        const storedRewards = await AsyncStorage.getItem('@custom_rewards');
        if (storedRewards !== null) {
          const customRewards = JSON.parse(storedRewards) as Reward[];
          setRewards([...DEFAULT_REWARDS, ...customRewards]);
        }
      } catch (e) {
        console.error('Failed to load rewards data', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  const saveCoins = async (newBalance: number) => {
    try {
      await AsyncStorage.setItem('@coin_balance', newBalance.toString());
    } catch (e) {
      console.error('Failed to save coins', e);
    }
  };

  const saveCustomRewards = async (newRewards: Reward[]) => {
    try {
      const customOnly = newRewards.filter(r => r.isCustom);
      await AsyncStorage.setItem('@custom_rewards', JSON.stringify(customOnly));
    } catch (e) {
      console.error('Failed to save custom rewards', e);
    }
  };

  const addCoins = (amount: number) => {
    const newBalance = coinBalance + amount;
    setCoinBalance(newBalance);
    saveCoins(newBalance);
  };

  const deductCoins = (amount: number) => {
    if (coinBalance >= amount) {
      const newBalance = coinBalance - amount;
      setCoinBalance(newBalance);
      saveCoins(newBalance);
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
