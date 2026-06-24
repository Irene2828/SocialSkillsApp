import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Reward } from '../data/types';
import { RewardCard } from './RewardCard';
import { useRewards } from '../context/RewardsContext';

interface RewardListProps {
  rewards: Reward[];
}

export const RewardList: React.FC<RewardListProps> = ({ rewards }) => {
  const { deductCoins } = useRewards();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRedeem = async (reward: Reward) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const success = deductCoins(reward.cost);
    if (success) {
      Alert.alert('Redeemed ✓', `You have successfully redeemed ${reward.title}!`);
    } else {
      Alert.alert('Oops!', 'You need more coins to unlock this reward.');
    }

    setTimeout(() => {
      setIsProcessing(false);
    }, 500);
  };

  if (rewards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No rewards added yet.</Text>
        <Text style={styles.emptySubText}>Ask a parent to set up some goals!</Text>
      </View>
    );
  }

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
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...theme.typography.heading,
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptySubText: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    textAlign: 'center',
  },
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
