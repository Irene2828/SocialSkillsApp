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
import { useFeedback } from '../context/FeedbackContext';
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
  const isRocket = mood === 'rocket';
  
  const { tasks, addTask, toggleTaskCompletion, deleteTask, editTask } = useTasks();
  const { addCoins } = useRewards();
  const { showModal } = useFeedback();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCoins, setNewTaskCoins] = useState('10'); // Default 10 coins

  // Tasks ordered by creation time
  const sortedTasks = [...tasks].sort((a, b) => b.createdAt - a.createdAt);

  const handleToggleTask = (task: Task) => {
    if (task.isCompleted) return; // Do nothing if already completed
    const wasJustCompleted = toggleTaskCompletion(task.id);
    if (wasJustCompleted) {
      addCoins(task.coinValue);
      showModal({
        title: 'Task Completed!',
        message: 'Check your rewards to redeem earned coins for real rewards!',
        type: 'success',
      });
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
        <TopBar title="Tasks" onBack={() => navigation.goBack()} />
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          
          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-done-circle-outline" size={64} color={isRocket ? 'rgba(255, 255, 255, 0.5)' : theme.colors.secondaryText} />
              <Text style={[styles.emptyTitle, isDark && { color: '#FFFFFF' }]}>No tasks yet</Text>
              <Text style={[styles.emptyText, isDark && { color: 'rgba(255,255,255,0.7)' }]}>Add some tasks to start earning coins!</Text>
            </View>
          ) : (
            <View style={styles.section}>
              {sortedTasks.map(renderTask)}
            </View>
          )}

          <View style={{ width: '100%', marginTop: 24, paddingHorizontal: theme.spacing.xl, alignItems: 'center' }}>
            <Button 
              title="Add a New Task" 
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
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isRocket && { backgroundColor: '#1E293B', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }]}>
            <Text style={[styles.modalTitle, isDark && { color: '#FFFFFF' }]}>
              {editingTaskId ? 'Edit Task' : 'New Task'}
            </Text>
            
            <Text style={[styles.inputLabel, isDark && { color: '#FFFFFF' }]}>What needs to be done?</Text>
            <TextInput
              style={[styles.input, isRocket && { backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }]}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="e.g., Clean your room"
              placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : '#9CA3AF'}
              autoFocus
            />

            <Text style={[styles.inputLabel, isDark && { color: '#FFFFFF' }, { marginTop: theme.spacing.md }]}>Reward (Coins)</Text>
            <View style={[styles.coinInputContainer, isRocket && { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }]}>
              <FontAwesome5 name="coins" size={16} color="#F59E0B" />
              <TextInput
                style={[styles.coinInput, isRocket && { color: '#FFFFFF' }]}
                value={newTaskCoins}
                onChangeText={setNewTaskCoins}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>

            <View style={styles.modalActions}>
              <Button 
                title="Cancel" 
                onPress={() => setIsModalVisible(false)}
                style={{ flex: 1, marginRight: theme.spacing.sm, backgroundColor: isRocket ? 'rgba(255,255,255,0.1)' : '#E5E7EB' }}
                textStyle={{ color: isDark ? '#FFFFFF' : theme.colors.text }}
              />
              <Button 
                title="Save Task" 
                onPress={handleAddTask}
                style={{ flex: 1, marginLeft: theme.spacing.sm }}
                variant="primary"
                disabled={!newTaskTitle.trim()}
              />
            </View>
          </View>
        </View>
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
  },
  headerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
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
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
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
  rightContent: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
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
    ...theme.shadows.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  modalTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  inputLabel: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    color: theme.colors.text,
  },
  coinInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
  },
  coinInput: {
    flex: 1,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    padding: theme.spacing.md,
    color: theme.colors.text,
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
  },
});
