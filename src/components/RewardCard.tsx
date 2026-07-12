import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Button } from './Button';
import { Reward } from '../data/types';
import { theme, FONTS } from '../theme';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

interface RewardCardProps {
  reward: Reward;
  onRedeem: (reward: Reward) => void;
  canAfford?: boolean;
  isProcessing?: boolean;
}

export const RewardCard: React.FC<RewardCardProps> = ({ reward, onRedeem, canAfford, isProcessing }) => {
  const gradientColors = [
    '#38BDF8', '#0EA5E9', '#0284C7', '#0369A1', '#075985',
    '#0C4A6E', '#1E3A8A', '#1E40AF', '#1D4ED8', '#2563EB',
    '#3B82F6', '#60A5FA', '#93C5FD'
  ];
  return (
    <View style={[styles.card, !canAfford && styles.cardDimmed]}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={reward.icon as any || 'gift-outline'} size={32} color={gradientColors[0]} />
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
          color={gradientColors[0]} 
        />
        <View style={{ flexDirection: 'row', marginLeft: 4 }}>
          {reward.cost.toString().split('').map((char, index) => (
            <Text 
              key={`cost-${index}`} 
              style={[
                styles.costText, 
                { marginLeft: 0 },
                { color: gradientColors[Math.min(2 + index, gradientColors.length - 1)] }
              ]}
            >
              {char}
            </Text>
          ))}
        </View>
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
    borderWidth: 2,
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
    ...theme.typography.body,
    fontFamily: FONTS.medium,
    fontWeight: '500',
    color: theme.colors.secondaryText,
    letterSpacing: 0.1,
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
