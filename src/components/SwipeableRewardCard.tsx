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

  const glassCardStyle = isRocket ? {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 0.1,
  } : {};

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
      <View style={styles.actionsContainer}>
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
          <Ionicons name="trash-outline" size={22} color={theme.colors.white} />
          <Text style={[styles.actionText, styles.deleteActionText]}>Delete</Text>
        </Pressable>
      </View>

      {/* Swipeable card */}
      <Animated.View
        style={[styles.card, glassCardStyle, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.inner, !canAfford && styles.cardDimmed]}>
          <View style={[styles.iconContainer, isRocket && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
            <Ionicons name={reward.icon as any || 'gift-outline'} size={24} color={isRocket ? '#FFFFFF' : gradientColors[0]} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, isRocket && { color: '#FFFFFF' }, isRocket && glassTextShadow]} numberOfLines={2} adjustsFontSizeToFit>
              {reward.title}
            </Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={[styles.costContainer, isRocket && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                <FontAwesome5
                  name="coins"
                  size={14}
                  color={isRocket ? '#FFFFFF' : gradientColors[0]}
                />
                <View style={{ flexDirection: 'row', marginLeft: 4 }}>
                  {reward.cost.toString().split('').map((char, index) => (
                    <Text 
                      key={`cost-${index}`} 
                      style={[
                        styles.costText, 
                        isRocket && { color: '#FFFFFF' }, 
                        { marginLeft: 0 },
                        { color: isRocket ? '#FFFFFF' : gradientColors[Math.min(2 + index, gradientColors.length - 1)] }
                      ]}
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
                    isRocket && { backgroundColor: '#FFFFFF', borderColor: '#BEF264' }
                  ]}
                  variant="secondary"
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
        </View>
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
    backgroundColor: theme.colors.neutralGrey,
    borderTopLeftRadius: theme.borderRadius.md,
    borderBottomLeftRadius: theme.borderRadius.md,
  },
  deleteBtn: {
    backgroundColor: theme.colors.secondaryText,
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
    color: theme.colors.white,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.stroke,
    ...theme.shadows.soft,
  },
  inner: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardDimmed: {
    opacity: 0.5,
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
    borderRadius: theme.borderRadius.md,
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
    marginBottom: theme.spacing.xs,
    textTransform: 'capitalize',
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.errorSoft,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  costText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: theme.colors.text,
  },
  redeemButton: {
    minWidth: 80,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    alignSelf: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: theme.colors.stroke,
  },
  redeemButtonActive: {
    borderColor: theme.colors.primary,
  },
  lockedButton: {
    minWidth: 80,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    alignSelf: 'center',
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
