import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Button } from './Button';
import { theme } from '../theme';
import { useRewards } from '../context/RewardsContext';
import { useFeedback } from '../context/FeedbackContext';

export const AddRewardForm = () => {
  const { addReward } = useRewards();
  const { showModal, showToast } = useFeedback();
  const [title, setTitle] = useState('');
  const [costStr, setCostStr] = useState('');

  const handleAdd = () => {
    const cost = parseInt(costStr, 10);
    if (!title.trim() || isNaN(cost) || cost <= 0) {
      showModal({ title: 'Invalid Input', message: 'Please enter a valid reward name and a cost greater than 0.', type: 'error' });
      return;
    }

    addReward({ title: title.trim(), cost });
    setTitle('');
    setCostStr('');
    showToast({ message: 'Custom reward added!' });
  };

  return (
    <Card style={styles.card}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.titleInput]}
          placeholder="Reward name (e.g. Play game)"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.costInput]}
          placeholder="Cost"
          value={costStr}
          onChangeText={setCostStr}
          keyboardType="numeric"
        />
      </View>
      <Button title="Add Reward" onPress={handleAdd} variant="secondary" />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    ...theme.typography.body,
  },
  titleInput: {
    flex: 2,
    marginRight: theme.spacing.sm,
  },
  costInput: {
    flex: 1,
  },
});
