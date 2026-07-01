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
import { theme } from '../theme';
import { Button } from './Button';

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
  const translateX = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 8 && Math.abs(gs.dy) < 20,
      onPanResponderMove: (_, gs) => {
        // Only allow left-swipe (negative dx)
        const x = Math.min(0, Math.max(-ACTION_WIDTH, gs.dx + (isOpen ? -ACTION_WIDTH : 0)));
        translateX.setValue(x);
      },
      onPanResponderRelease: (_, gs) => {
        const currentX = gs.dx + (isOpen ? -ACTION_WIDTH : 0);
        if (currentX < -SWIPE_THRESHOLD) {
          // Snap open
          Animated.spring(translateX, {
            toValue: -ACTION_WIDTH,
            useNativeDriver: true,
            tension: 80,
            friction: 10,
          }).start(() => setIsOpen(true));
        } else {
          // Snap closed
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 80,
            friction: 10,
          }).start(() => setIsOpen(false));
        }
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
          <Ionicons name="pencil" size={22} color="#111827" />
          <Text style={[styles.actionText, styles.editActionText]}>Edit</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => { close(); onDelete(reward); }}
        >
          <Ionicons name="trash-outline" size={22} color="#111827" />
          <Text style={[styles.actionText, styles.deleteActionText]}>Delete</Text>
        </Pressable>
      </View>

      {/* Swipeable card */}
      <Animated.View
        style={[styles.card, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.inner, !canAfford && styles.cardDimmed]}>
          <View style={styles.leftContent}>
            <View style={styles.iconContainer}>
              <Ionicons name={reward.icon as any || 'gift'} size={24} color="#4B5563" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
                {reward.title}
              </Text>
              <Button
                title={isProcessing ? 'Redeeming..' : 'Redeem'}
                onPress={() => onRedeem(reward)}
                style={[styles.redeemButton, canAfford && styles.redeemButtonActive]}
                variant={isProcessing ? 'outline' : (canAfford ? 'primary' : 'secondary')}
                disabled={!canAfford || isProcessing}
              />
            </View>
          </View>
          <View style={styles.costContainer}>
            <FontAwesome5
              name="coins"
              size={14}
              color={theme.colors.primary}
              style={{ textShadowColor: '#9CA3AF', textShadowOffset: { width: -0.5, height: 0.5 }, textShadowRadius: 1 }}
            />
            <Text style={styles.costText}>{reward.cost}</Text>
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
    gap: 4,
  },
  editBtn: {
    backgroundColor: '#F3F4F6', // Footer Grey
    borderTopLeftRadius: theme.borderRadius.lg,
    borderBottomLeftRadius: theme.borderRadius.lg,
  },
  deleteBtn: {
    backgroundColor: '#BEF264', // Brand Green
    borderTopRightRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  editActionText: {
    color: '#111827',
  },
  deleteActionText: {
    color: '#111827',
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
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
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  iconContainer: {
    marginRight: theme.spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(190, 242, 100, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...theme.typography.button,
    fontSize: 16,
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
    backgroundColor: '#F7FEE7',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
});
