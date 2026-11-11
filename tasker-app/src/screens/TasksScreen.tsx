import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { theme, FONTS } from '../theme';
import { GlobalBackground } from '../components/GlobalBackground';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Button } from '../components/Button';
import { useTasks, Task } from '../context/TasksContext';
import { useRewards } from '../context/RewardsContext';
import { TopBar } from '../components/TopBar';
import { SwipeableTaskCard } from '../components/SwipeableTaskCard';
import { TaskerStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<TaskerStackParamList, 'Tasks'>;

export const TasksScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const { tasks, addTask, toggleTaskCompletion, deleteTask, editTask } = useTasks();
  const { addCoins } = useRewards();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCoins, setNewTaskCoins] = useState('10');

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    return b.createdAt - a.createdAt;
  });

  const handleToggleTask = (task: Task) => {
    if (task.isCompleted) return;
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
              <Text style={{ textAlign: 'center', color: theme.colors.secondaryText, marginTop: 8 }}>
                Tap the button below to add your first task!
              </Text>
            </View>
          ) : (
            <View style={styles.section}>
              {sortedTasks.map(renderTask)}
            </View>
          )}

          <View style={{ alignItems: 'center', marginTop: theme.spacing.xl, marginBottom: theme.spacing.lg, paddingHorizontal: theme.spacing.xl }}>
            <Text style={{
              ...theme.typography.body,
              fontFamily: FONTS.medium,
              fontWeight: '500',
              color: theme.colors.secondaryText,
              textAlign: 'center',
              letterSpacing: 0.6,
              marginBottom: theme.spacing.md,
            }}>
              Add a new task to earn coins.
            </Text>

            <Button
              title="Add New Task"
              iconName="add-circle-outline"
              onPress={() => {
                setEditingTaskId(null);
                setNewTaskTitle('');
                setNewTaskCoins('10');
                setIsModalVisible(true);
              }}
              style={{
                paddingHorizontal: 36,
                paddingVertical: 12,
                minHeight: 0,
              }}
              textStyle={{
                fontFamily: FONTS.medium,
                fontWeight: '500',
                fontSize: 16,
                letterSpacing: 0.4,
              }}
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
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsModalVisible(false)} />
          <View style={styles.modalContent}>
            <Pressable onPress={() => setIsModalVisible(false)} style={{ alignSelf: 'flex-end', padding: 4, marginBottom: 4 }}>
              <Ionicons name="close" size={28} color={theme.colors.text} />
            </Pressable>
            <Text style={styles.modalTitle}>
              {editingTaskId ? 'Edit Task' : 'New Task'}
            </Text>

            <Text style={styles.inputLabel}>What needs to be done?</Text>
            <TextInput
              style={styles.input}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="e.g., Clean your room"
              placeholderTextColor={theme.colors.secondaryText}
              autoFocus
            />

            <Text style={[styles.inputLabel, { marginTop: theme.spacing.md }]}>Reward (Coins)</Text>
            <View style={styles.coinInputContainer}>
              <FontAwesome5 name="coins" size={16} color={theme.colors.text} />
              <TextInput
                style={styles.coinInput}
                value={newTaskCoins}
                onChangeText={setNewTaskCoins}
                keyboardType="number-pad"
                maxLength={4}
                placeholderTextColor={theme.colors.secondaryText}
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
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 80,
  },
  section: {
    marginBottom: theme.spacing.xl,
    paddingHorizontal: 12,
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 12,
  },
  emptyTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 20,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.neutralGrey,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    zIndex: 10,
    elevation: 10,
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
    color: theme.colors.secondaryText,
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
    backgroundColor: theme.colors.background,
  },
  coinInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
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
    flexDirection: 'column',
    width: '100%',
    marginTop: theme.spacing.xl,
  },
});

export default TasksScreen;
