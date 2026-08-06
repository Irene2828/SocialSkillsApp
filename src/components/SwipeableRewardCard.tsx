import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Pressable,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Reward } from '../data/types';
import { theme, FONTS } from '../theme';
import { Button } from './Button';
import { Card } from './Card';

import { useMood, getMoodColors } from '../context/MoodContext';

const SWIPE_THRESHOLD = 60; // px to reveal actions
const ACTION_WIDTH = 140;   // total reveal width (2 × 70px actions)

interface SwipeableRewardCardProps {
  reward: Reward;
  onRedeem: (reward: Reward) => void;
  canAfford?: boolean;
  isProcessing?: boolean;
  onEdit: (reward: Reward) => void;
  onDelete: (reward: Reward) => void;
}

export const SwipeableRewardCard: React.FC<SwipeableRewardCardProps> = ({
  reward,
  onRedeem,
  canAfford,
  isProcessing,
  onEdit,
  onDelete,
}) => {
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const isRocket = mood === 'rocket';

  const translateX = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);
  const actionsOpacity = translateX.interpolate({
    inputRange: [-ACTION_WIDTH, -24, 0],
    outputRange: [1, 0.25, 0],
    extrapolate: 'clamp',
  });

  const glassTextShadow = isRocket ? {
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  } : {};

  const gradientColors = [
    '#38BDF8', '#0EA5E9', '#0284C7', '#0369A1', '#075985',
    '#0C4A6E', '#1E3A8A', '#1E40AF', '#1D4ED8', '#2563EB',
    '#3B82F6', '#60A5FA', '#93C5FD'
  ];

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 10 && Math.abs(gs.dx) > Math.abs(gs.dy),
      onPanResponderMove: (_, gs) => {
        // Only allow left-swipe (negative dx)
        const x = Math.min(0, Math.max(-ACTION_WIDTH, gs.dx + (isOpen ? -ACTION_WIDTH : 0)));
        translateX.setValue(x);
      },
      onPanResponderRelease: (_, gs) => {
        const currentX = gs.dx + (isOpen ? -ACTION_WIDTH : 0);
        if (currentX < -SWIPE_THRESHOLD) {
          Animated.spring(translateX, {
            toValue: -ACTION_WIDTH,
            useNativeDriver: true,
            tension: 80,
            friction: 10,
          }).start(() => setIsOpen(true));
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 80,
            friction: 10,
          }).start(() => setIsOpen(false));
        }
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }).start(() => setIsOpen(false));
      },
    })
  ).current;

  const close = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start(() => setIsOpen(false));
  };

  return (
    <View style={styles.wrapper}>
      {/* Action buttons revealed behind the card */}
      <Animated.View style={[styles.actionsContainer, { opacity: actionsOpacity }]}>
        <Pressable
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => { close(); onEdit(reward); }}
        >
          <Ionicons name="pencil-outline" size={22} color={theme.colors.text} />
          <Text style={[styles.actionText, styles.editActionText]}>Edit</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => { close(); onDelete(reward); }}
        >
          <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
          <Text style={[styles.actionText, styles.deleteActionText]}>Delete</Text>
        </Pressable>
      </Animated.View>

      {/* Swipeable card */}
      <Animated.View
        style={[{ transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <Card style={!canAfford && styles.cardDimmed}>
          <View style={styles.inner}>
          <View style={styles.iconContainer}>
            <Ionicons name={reward.icon as any || 'gift-outline'} size={24} color="#0C4A6E" />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, isRocket && { color: '#FFFFFF' }, isRocket && glassTextShadow]} numberOfLines={2} adjustsFontSizeToFit>
              {reward.title}
            </Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={styles.costContainer}>
                <FontAwesome5 name="coins" size={12} color={gradientColors[0]} style={{ marginRight: 4 }} />
                <View style={{ flexDirection: 'row' }}>
                  {reward.cost.toString().split('').map((char, index) => (
                    <Text 
                      key={`cost-${index}`} 
                      style={styles.costText}
                    >
                      {char}
                    </Text>
                  ))}
                </View>
              </View>

              {canAfford ? (
                <Button
                  title={isProcessing ? 'Redeeming..' : 'Redeem'}
                  onPress={() => onRedeem(reward)}
                  style={[
                    styles.redeemButton,
                    styles.redeemButtonActive,
                  ]}
                  textStyle={{ color: '#0C4A6E' }}
                  variant="secondary"
                  disabled={isProcessing}
                />
              ) : (
                <View style={styles.lockedButton}>
                  <Ionicons name="lock-closed" size={14} color="rgba(12, 74, 110, 0.4)" style={{ marginRight: 4 }} />
                  <Text style={styles.lockedButtonText}>Locked</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Card>
    </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  actionsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: ACTION_WIDTH,
    flexDirection: 'row',
  },
  actionBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // gap is not supported in flexbox on iOS 12.5 / older WebKit.
    // Use marginTop on the text child (actionText) instead — see below.
  },
  editBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderTopLeftRadius: theme.borderRadius.md,
    borderBottomLeftRadius: theme.borderRadius.md,
  },
  deleteBtn: {
    backgroundColor: 'rgba(59, 130, 246, 0.34)',
    borderTopRightRadius: theme.borderRadius.md,
    borderBottomRightRadius: theme.borderRadius.md,
  },
  actionText: {
    ...theme.typography.tab,
    // Replaces the gap that was removed from actionBtn for iOS 12.5 compatibility
    marginTop: theme.spacing.xs,
  },
  editActionText: {
    color: theme.colors.text,
  },
  deleteActionText: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.32)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    width: '100%',
    ...theme.shadows.soft,
  },
  inner: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardDimmed: {
    opacity: 0.88,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  iconContainer: {
    marginRight: theme.spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(42, 30, 92, 0.15)',
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
    color: '#0C4A6E',
    letterSpacing: 0,
    marginBottom: theme.spacing.xs,
    textTransform: 'capitalize',
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(42, 30, 92, 0.15)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  costText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: '#0C4A6E',
  },
  redeemButton: {
    minWidth: 80,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  redeemButtonActive: {
    borderColor: '#0C4A6E',
  },
  lockedButton: {
    minWidth: 80,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(12, 74, 110, 0.22)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedButtonText: {
    ...theme.typography.button,
    fontFamily: FONTS.medium,
    fontWeight: '500',
    color: 'rgba(12, 74, 110, 0.4)',
    fontSize: 14,
  },
});
