import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Reward } from '../data/types';
import { RewardCard } from './RewardCard';
import { useRewards } from '../context/RewardsContext';

interface RewardListProps {
  rewards: Reward[];
}

export const RewardList: React.FC<RewardListProps> = ({ rewards }) => {
  const { deductCoins, coinBalance } = useRewards();
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
          <RewardCard 
            reward={reward} 
            onRedeem={handleRedeem} 
            canAfford={coinBalance >= reward.cost}
          />
        </View>
      ))}
      <View style={styles.bannerContainer}>
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>Keep learning, keep earning!</Text>
          <Text style={styles.bannerSubtitle}>You can use your coins to unlock fun rewards.</Text>
        </View>
      </View>
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
    flexDirection: 'column',
  },
  gridItem: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  bannerContainer: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    ...theme.typography.heading,
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  bannerSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.secondaryText,
  }
});

import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
