import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Reward } from '../data/types';
import { RewardCard } from './RewardCard';
import { useRewards } from '../context/RewardsContext';

interface RewardListProps {
  rewards: Reward[];
}

export const RewardList: React.FC<RewardListProps> = ({ rewards }) => {
  const { deductCoins } = useRewards();

  const handleRedeem = (reward: Reward) => {
    const success = deductCoins(reward.cost);
    if (success) {
      Alert.alert('Redeemed ✓', `You have successfully redeemed ${reward.title}!`);
    } else {
      Alert.alert('Oops!', 'You need more coins to unlock this reward.');
    }
  };

  return (
    <View style={styles.gridContainer}>
      {rewards.map(reward => (
        <View key={reward.id} style={styles.gridItem}>
          <RewardCard reward={reward} onRedeem={handleRedeem} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  gridItem: {
    width: '50%',
  },
});

import { theme } from '../theme'; // Import at the bottom due to circular dependency or place properly
