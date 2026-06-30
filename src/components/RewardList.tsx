import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Reward } from '../data/types';
import { RewardCard } from './RewardCard';
import { useRewards } from '../context/RewardsContext';

interface RewardListProps {
  rewards: Reward[];
  onRedeemSuccess?: (reward: Reward) => void;
}

export const RewardList: React.FC<RewardListProps> = ({ rewards, onRedeemSuccess }) => {
  const { deductCoins, coinBalance } = useRewards();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleRedeem = async (reward: Reward) => {
    if (processingId) return;
    setProcessingId(reward.id);

    // Simulate realistic processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const success = deductCoins(reward.cost);
    if (success) {
      if (onRedeemSuccess) {
        onRedeemSuccess(reward);
      }
    } else {
      Alert.alert('Oops!', 'You need more coins to unlock this reward.');
    }

    setProcessingId(null);
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
            isProcessing={processingId === reward.id}
          />
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
    flexDirection: 'column',
  },
  gridItem: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  }
});

import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
