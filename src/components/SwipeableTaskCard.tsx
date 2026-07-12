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
import { Task } from '../context/TasksContext';
import { theme, FONTS } from '../theme';

import { useMood, getMoodColors } from '../context/MoodContext';

const ACTION_WIDTH = 120; // 60 for edit + 60 for delete
const SWIPE_THRESHOLD = 30;

interface SwipeableTaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const SwipeableTaskCard: React.FC<SwipeableTaskCardProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const isRocket = mood === 'rocket';

  const translateX = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);

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
        // Only allow left-swipe
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
    })
  ).current;

  return (
    <View style={styles.wrapper}>
      {/* Background Actions */}
      <View style={styles.actionsContainer}>
        <Pressable
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            Animated.timing(translateX, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setIsOpen(false));
            onEdit(task);
          }}
        >
          <Ionicons name="pencil-outline" size={24} color="#FFFFFF" />
        </Pressable>
        <Pressable
          style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
          onPress={() => {
            onDelete(task.id);
          }}
        >
          <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Foreground Task Card */}
      <Animated.View
        style={[
          styles.foreground,
          { transform: [{ translateX }] }
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.taskCard, task.isCompleted && styles.taskCardCompleted, isRocket && { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }]}>
          <Pressable 
            style={[styles.checkboxContainer, task.isCompleted && { opacity: 0.5 }]}
            onPress={() => onToggle(task)}
          >
            <View style={[
              styles.checkbox,
              task.isCompleted && styles.checkboxChecked,
              isRocket && { borderColor: 'rgba(255, 255, 255, 0.5)' },
              task.isCompleted && isRocket && { backgroundColor: '#BEF264', borderColor: '#BEF264' }
            ]}>
              {task.isCompleted && <Ionicons name="checkmark" size={16} color={isRocket ? '#0F172A' : '#FFFFFF'} />}
            </View>
          </Pressable>

          <View style={styles.taskInfo}>
            <Text style={[
              styles.taskTitle,
              isRocket && { color: '#FFFFFF' },
              task.isCompleted && styles.taskTitleCompleted,
              task.isCompleted && isRocket && { color: 'rgba(255, 255, 255, 0.5)' }
            ]} numberOfLines={1}>
              {task.title}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <FontAwesome5 name="coins" size={12} color={gradientColors[0]} style={{ marginRight: 4 }} />
              <View style={{ flexDirection: 'row' }}>
                {('+' + task.coinValue).split('').map((char, index) => (
                  <Text 
                    key={`cost-${index}`} 
                    style={[
                      { fontFamily: FONTS.bold, fontSize: 14 },
                      isRocket && { color: '#FFFFFF' }, 
                      { color: isRocket ? '#FFFFFF' : (index === 0 ? gradientColors[0] : gradientColors[Math.min(2 + index, gradientColors.length - 1)] || gradientColors[1]) }
                    ]}
                  >
                    {char}
                  </Text>
                ))}
              </View>
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
    marginBottom: theme.spacing.sm,
    height: 72,
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    width: ACTION_WIDTH,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  actionButton: {
    width: ACTION_WIDTH / 2,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foreground: {
    width: '100%',
    height: '100%',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    height: '100%',
    ...theme.shadows.soft,
  },
  taskCardCompleted: {
    opacity: 0.6,
  },
  checkboxContainer: {
    padding: 4,
    marginRight: theme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: theme.colors.text,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.secondaryText,
  },
});
