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
          <Ionicons name={reward.icon as any || 'gift-outline'} size={32} color={theme.colors.secondaryText} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
            {reward.title}
          </Text>
          {canAfford ? (
            <Button 
              title={isProcessing ? "Redeeming points.." : "Redeem"} 
              onPress={() => onRedeem(reward)} 
              style={[styles.redeemButton, styles.redeemButtonActive]}
              variant="primary"
              disabled={isProcessing}
            />
          ) : (
            <View style={styles.lockedButton}>
              <Ionicons name="lock-closed" size={14} color={theme.colors.secondaryText} style={{ marginRight: 4 }} />
              <Text style={styles.lockedButtonText}>Locked</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.costContainer}>
        <FontAwesome5 
          name="coins" 
          size={14} 
          color={theme.colors.primary} 
          style={{
            textShadowColor: '#4B5563',
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
    ...theme.typography.subheading,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.errorSoft,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'center',
  },
  costText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  redeemButton: {
    minWidth: 80,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  redeemButtonActive: {
    // Managed by primary variant
  },
  lockedButton: {
    minWidth: 80,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: theme.colors.neutralGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedButtonText: {
    ...theme.typography.button,
    color: theme.colors.secondaryText,
    fontSize: 14,
  },
});
