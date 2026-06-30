import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Button } from './Button';
import { Reward } from '../data/types';
import { theme } from '../theme';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

interface RewardCardProps {
  reward: Reward;
  onRedeem: (reward: Reward) => void;
  canAfford?: boolean;
  isProcessing?: boolean;
}

export const RewardCard: React.FC<RewardCardProps> = ({ reward, onRedeem, canAfford, isProcessing }) => {
  return (
    <View style={[styles.card, !canAfford && styles.cardDimmed]}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={reward.icon as any || 'gift'} size={32} color="#4B5563" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
            {reward.title}
          </Text>
          <Button 
            title={isProcessing ? "Redeeming points.." : "Redeem"} 
            onPress={() => onRedeem(reward)} 
            style={[styles.redeemButton, canAfford && styles.redeemButtonActive]}
            variant={canAfford ? "primary" : "secondary"}
            disabled={!canAfford || isProcessing}
          />
        </View>
      </View>
      <View style={styles.costContainer}>
        <FontAwesome5 
          name="coins" 
          size={14} 
          color={theme.colors.primary} 
          style={{
            textShadowColor: '#9CA3AF',
            textShadowOffset: { width: -0.5, height: 0.5 },
            textShadowRadius: 1
          }}
        />
        <Text style={styles.costText}>{reward.cost}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    ...theme.shadows.soft,
  },
  cardDimmed: {
    opacity: 0.5,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  iconContainer: {
    marginRight: theme.spacing.md,
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.errorSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...theme.typography.heading,
    fontSize: 18,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.errorSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
  costText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 6,
  },
  redeemButton: {
    minWidth: 80,
    borderRadius: theme.borderRadius.full,
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.md,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  redeemButtonActive: {
    // Managed by primary variant
  },
});
