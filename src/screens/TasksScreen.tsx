import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Modal, useWindowDimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, FONTS } from '../theme';
import { GlobalBackground } from '../components/GlobalBackground';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Button } from '../components/Button';
import { useTasks, Task } from '../context/TasksContext';
import { useRewards } from '../context/RewardsContext';

import { QuizLibraryStackParamList } from '../navigation/QuizLibraryNavigator';
import { useMood, getMoodColors } from '../context/MoodContext';
import { TopBar } from '../components/TopBar';
import { SwipeableTaskCard } from '../components/SwipeableTaskCard';

type NavigationProp = NativeStackNavigationProp<QuizLibraryStackParamList, 'Tasks'>;

export const TasksScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const isDark = moodColors.isDark;
  
  const { tasks, addTask, toggleTaskCompletion, deleteTask, editTask } = useTasks();
  const { addCoins } = useRewards();


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCoins, setNewTaskCoins] = useState('10'); // Default 10 coins

  // Tasks ordered by creation time
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    return b.createdAt - a.createdAt;
  });

  const handleToggleTask = (task: Task) => {
    if (task.isCompleted) return; // Do nothing if already completed
    const wasJustCompleted = toggleTaskCompletion(task.id);
    if (wasJustCompleted) {
      addCoins(task.coinValue);
    }
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const coinValue = parseInt(newTaskCoins, 10) || 10;
      if (editingTaskId) {
        editTask(editingTaskId, newTaskTitle.trim(), coinValue);
      } else {
        addTask(newTaskTitle.trim(), coinValue);
      }
      setNewTaskTitle('');
      setNewTaskCoins('10');
      setEditingTaskId(null);
      setIsModalVisible(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setNewTaskTitle(task.title);
    setNewTaskCoins(task.coinValue.toString());
    setEditingTaskId(task.id);
    setIsModalVisible(true);
  };

  const renderTask = (task: Task) => {
    return (
      <SwipeableTaskCard
        key={task.id}
        task={task}
        onToggle={handleToggleTask}
        onEdit={handleEditTask}
        onDelete={deleteTask}
      />
    );
  };

  return (
    <View style={styles.container}>
      <GlobalBackground />

      <ScreenWrapper transparent>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <TopBar title="Tasks" showSettingsAndRewards={true} />
          
          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No tasks yet</Text>
            </View>
          ) : (
            <View style={styles.section}>
              {sortedTasks.map(renderTask)}
            </View>
          )}

          <View style={{ width: '100%', marginTop: 24, paddingHorizontal: theme.spacing.xl, alignItems: 'center' }}>
            <Button 
              title="Add a New Task" 
              iconName="add"
              onPress={() => setIsModalVisible(true)}
              style={styles.addButton}
              variant="primary"
            />
          </View>
        </ScrollView>
      </ScreenWrapper>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
            <Text style={styles.modalTitle}>
              {editingTaskId ? 'Edit Task' : 'New Task'}
            </Text>
            
            <Text style={styles.inputLabel}>What needs to be done?</Text>
            <TextInput
              style={styles.input}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="e.g., Clean your room"
              placeholderTextColor="rgba(255,255,255,0.44)"
              autoFocus
            />

            <Text style={[styles.inputLabel, { marginTop: theme.spacing.md }]}>Reward (Coins)</Text>
            <View style={styles.coinInputContainer}>
              <FontAwesome5 name="coins" size={16} color="#38BDF8" />
              <TextInput
                style={styles.coinInput}
                value={newTaskCoins}
                onChangeText={setNewTaskCoins}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>

            <View style={styles.modalActions}>
              <Button 
                title="Save Task" 
                onPress={handleAddTask}
                style={{ width: '100%', marginBottom: theme.spacing.sm }}
                variant="primary"
                disabled={!newTaskTitle.trim()}
              />
              <Button 
                title="Cancel" 
                onPress={() => setIsModalVisible(false)}
                style={{ width: '100%' }}
                variant="secondary"
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.055)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0,
    elevation: 0,
  },
  headerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 160, // Match spacing on other screens of the app
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.055)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.2,
    shadowRadius: 34,
    elevation: 0,
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
  rightContent: {
    flexDirection: 'column',
    alignItems: 'center',
    // gap is not supported in flexbox on iOS 12.5.
    // Child items use marginBottom instead.
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 20,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: theme.colors.secondaryText,
    textAlign: 'center',
  },
  addButton: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#BEF264', // Match the green CTA color from MyRewardsScreen add button
    borderColor: '#BEF264',
    ...theme.shadows.soft,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(224, 251, 252, 0.96)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(224, 251, 252, 0.95)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowOpacity: 0,
    elevation: 0,
  },
  modalTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 24,
    color: '#0A2F35',
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  inputLabel: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: '#0A2F35',
    marginBottom: theme.spacing.xs,
  },
  input: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(15, 26, 44, 0.15)',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    color: '#0A2F35',
    backgroundColor: 'rgba(15, 26, 44, 0.05)',
  },
  coinInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15, 26, 44, 0.15)',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: 'rgba(15, 26, 44, 0.05)',
  },
  coinInput: {
    flex: 1,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    padding: theme.spacing.md,
    color: '#0A2F35',
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'column',
    width: '100%',
    marginTop: theme.spacing.xl,
  },
});
