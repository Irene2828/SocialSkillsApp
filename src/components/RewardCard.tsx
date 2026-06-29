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
  canAfford: boolean;
}

export const RewardCard: React.FC<RewardCardProps> = ({ reward, onRedeem, canAfford }) => {
  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={reward.icon as any || 'gift'} size={32} color={theme.colors.text} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
            {reward.title}
          </Text>
          <View style={styles.costContainer}>
            <FontAwesome5 
              name="coins" 
              size={14} 
              color={theme.colors.primary} 
              style={{
                textShadowColor: 'rgba(0,0,0,0.15)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2
              }}
            />
            <Text style={styles.costText}>{reward.cost}</Text>
          </View>
        </View>
      </View>
      <Button 
        title="Redeem" 
        onPress={() => onRedeem(reward)} 
        style={styles.redeemButton}
        variant={canAfford ? "outline" : "secondary"}
      />
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
    backgroundColor: theme.colors.primary,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
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
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.errorSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
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
    paddingVertical: 8,
    paddingHorizontal: theme.spacing.sm,
  },
});
