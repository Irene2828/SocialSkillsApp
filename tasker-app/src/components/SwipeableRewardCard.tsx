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

const SWIPE_THRESHOLD = 60;
const ACTION_WIDTH = 140;

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
  const actionsOpacity = translateX.interpolate({
    inputRange: [-ACTION_WIDTH, -24, 0],
    outputRange: [1, 0.25, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 10 && Math.abs(gs.dx) > Math.abs(gs.dy),
      onPanResponderMove: (_, gs) => {
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
          <Ionicons name="trash-outline" size={22} color={theme.colors.text} />
          <Text style={[styles.actionText, styles.deleteActionText]}>Delete</Text>
        </Pressable>
      </Animated.View>

      <Animated.View
        style={[{ transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <Card style={!canAfford && styles.cardDimmed}>
          <View style={styles.inner}>
            <View style={styles.iconContainer}>
              <Ionicons name={reward.icon as any || 'gift-outline'} size={24} color={theme.colors.text} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
                {reward.title}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={styles.costContainer}>
                  <FontAwesome5 name="coins" size={12} color={theme.colors.text} style={{ marginRight: 4 }} />
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
                    style={styles.redeemButton}
                    textStyle={{ color: theme.colors.background }}
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
  },
  editBtn: {
    backgroundColor: theme.colors.neutralGrey,
    borderTopLeftRadius: theme.borderRadius.md,
    borderBottomLeftRadius: theme.borderRadius.md,
  },
  deleteBtn: {
    backgroundColor: theme.colors.danger,
    borderTopRightRadius: theme.borderRadius.md,
    borderBottomRightRadius: theme.borderRadius.md,
  },
  actionText: {
    ...theme.typography.tab,
    marginTop: theme.spacing.xs,
  },
  editActionText: {
    color: theme.colors.text,
  },
  deleteActionText: {
    color: theme.colors.text,
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
  iconContainer: {
    marginRight: theme.spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
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
    color: theme.colors.text,
    letterSpacing: 0,
    marginBottom: theme.spacing.xs,
    textTransform: 'capitalize',
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  costText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: theme.colors.text,
  },
  redeemButton: {
    minWidth: 80,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    alignSelf: 'center',
  },
  lockedButton: {
    minWidth: 80,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    alignSelf: 'center',
    backgroundColor: theme.colors.neutralGrey,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedButtonText: {
    ...theme.typography.button,
    fontFamily: FONTS.medium,
    fontWeight: '500',
    color: theme.colors.secondaryText,
    fontSize: 14,
  },
});
