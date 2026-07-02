import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export const SimpleLockScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="moon-outline" size={64} color={theme.colors.primary} style={styles.icon} />
      <Text style={styles.title}>Great work today!</Text>
      <Text style={styles.subtitle}>Come back tomorrow 😊</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  icon: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.heading,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    textAlign: 'center',
  },
});
