import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface HeaderProps {
  title: string;
  hasDivider?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, hasDivider }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {hasDivider && <View style={styles.divider} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.heading,
    textAlign: 'center',
    fontSize: 28,
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D5DB', // Light grey for the line
    marginTop: theme.spacing.md,
    marginHorizontal: -theme.spacing.lg, // Stretch full width
  },
});
