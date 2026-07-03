import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UnlockedReward } from '../data/types';
import { theme } from '../theme';

interface UnlockedRewardItemProps {
  reward: UnlockedReward;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isHighlighted?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const UnlockedRewardItem: React.FC<UnlockedRewardItemProps> = ({ reward, onToggle, onDelete, isHighlighted }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const borderGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isHighlighted) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.05,
          friction: 3,
          tension: 40,
          useNativeDriver: false,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: false,
        }),
      ]).start();

      Animated.timing(borderGlow, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      borderGlow.setValue(0);
      scaleAnim.setValue(1);
    }
  }, [isHighlighted]);

  const borderGlowColor = borderGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.stroke, theme.colors.primary],
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <AnimatedPressable 
        style={[
          styles.container, 
          reward.isFulfilled && styles.containerFulfilled,
          isHighlighted && { borderColor: borderGlowColor, borderWidth: 2 }
        ]} 
        onPress={() => {
          if (!reward.isFulfilled) {
            onToggle(reward.id);
          }
        }}
      >
        <View style={[styles.iconContainer, reward.isFulfilled && styles.iconContainerFulfilled]}>
          <Ionicons 
            name={reward.icon as any || 'gift'} 
            size={24} 
            color={reward.isFulfilled ? theme.colors.secondaryText : theme.colors.text} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, reward.isFulfilled && styles.titleFulfilled]} numberOfLines={2}>
            {reward.title}
          </Text>
          {!reward.isFulfilled && (
            <Text style={styles.date}>
              Unlocked: {new Date(reward.timestamp).toLocaleDateString()}
            </Text>
          )}
        </View>
        {reward.isFulfilled ? (
          <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
            <View style={styles.receivedChip}>
              <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.text} style={{ marginRight: 4 }} />
              <Text style={styles.receivedText}>Reward Received</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Pressable 
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete(reward.id);
                }}
                style={{ padding: 4, marginRight: 8 }}
              >
                <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
              </Pressable>
              <Pressable 
                onPress={(e) => {
                  e.stopPropagation();
                  onToggle(reward.id);
                }}
                style={{ padding: 4, marginRight: 4 }}
              >
                <Ionicons name="arrow-undo-outline" size={20} color={theme.colors.secondaryText} />
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.checkbox} />
        )}
      </AnimatedPressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    backgroundColor: theme.colors.errorSoft, // solid light grey
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
    marginBottom: theme.spacing.xs,
  },
  titleFulfilled: {
    textDecorationLine: 'line-through',
    color: theme.colors.secondaryText,
  },
  date: {
    ...theme.typography.tab,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.sm,
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
  receivedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutralGrey,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginLeft: theme.spacing.md,
  },
  receivedText: {
    ...theme.typography.tab,
    color: theme.colors.text,
  },
});
