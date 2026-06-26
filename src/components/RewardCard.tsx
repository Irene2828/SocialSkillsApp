import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Button } from './Button';
import { Reward } from '../data/types';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface RewardCardProps {
  reward: Reward;
  onRedeem: (reward: Reward) => void;
}

export const RewardCard: React.FC<RewardCardProps> = ({ reward, onRedeem }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={reward.icon as any || 'star-outline'} size={32} color={theme.colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>{reward.title}</Text>
          <View style={styles.costContainer}>
            <Ionicons name="cash" size={16} color={theme.colors.success} />
            <Text style={styles.costText}>{reward.cost}</Text>
          </View>
        </View>
      </View>
      <Button 
        title="Redeem" 
        onPress={() => onRedeem(reward)} 
        style={styles.redeemButton}
        variant="outline"
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  iconContainer: {
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...theme.typography.heading,
    fontSize: 16,
    marginBottom: 4,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.success,
    marginLeft: theme.spacing.xs,
  },
  redeemButton: {
    minWidth: 100,
  },
});
