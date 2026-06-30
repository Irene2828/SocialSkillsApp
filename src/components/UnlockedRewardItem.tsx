import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UnlockedReward } from '../data/types';
import { theme } from '../theme';

interface UnlockedRewardItemProps {
  reward: UnlockedReward;
  onToggle: (id: string) => void;
}

export const UnlockedRewardItem: React.FC<UnlockedRewardItemProps> = ({ reward, onToggle }) => {
  return (
    <Pressable 
      style={[styles.container, reward.isFulfilled && styles.containerFulfilled]} 
      onPress={() => onToggle(reward.id)}
    >
      <View style={[styles.iconContainer, reward.isFulfilled && styles.iconContainerFulfilled]}>
        <Ionicons 
          name={reward.icon as any || 'gift'} 
          size={24} 
          color={reward.isFulfilled ? theme.colors.secondaryText : "#4B5563"} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, reward.isFulfilled && styles.titleFulfilled]} numberOfLines={2}>
          {reward.title}
        </Text>
        <Text style={styles.date}>
          Unlocked: {new Date(reward.timestamp).toLocaleDateString()}
        </Text>
      </View>
      {reward.isFulfilled ? (
        <View style={styles.receivedChip}>
          <Ionicons name="checkmark-circle" size={16} color={theme.colors.text} style={{ marginRight: 4 }} />
          <Text style={styles.receivedText}>Reward Received</Text>
        </View>
      ) : (
        <View style={styles.checkbox} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    ...theme.shadows.soft,
  },
  containerFulfilled: {
    backgroundColor: theme.colors.errorSoft,
    borderColor: theme.colors.border,
    opacity: 0.7,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(190, 242, 100, 0.4)', // lighter lime
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  iconContainerFulfilled: {
    backgroundColor: theme.colors.border,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...theme.typography.button,
    fontSize: 16,
    marginBottom: 4,
  },
  titleFulfilled: {
    textDecorationLine: 'line-through',
    color: theme.colors.secondaryText,
  },
  date: {
    ...theme.typography.caption,
    fontSize: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.md,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});
