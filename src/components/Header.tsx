import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface HeaderProps {
  title: string;
  hasDivider?: boolean;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, hasDivider, rightElement }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        {rightElement && (
          <View style={styles.rightElementContainer}>
            {rightElement}
          </View>
        )}
      </View>
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
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 40,
  },
  title: {
    ...theme.typography.heading,
    textAlign: 'center',
    fontSize: 28,
  },
  rightElementContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D5DB', // Light grey for the line
    marginTop: theme.spacing.md,
    marginHorizontal: -theme.spacing.lg, // Stretch full width
  },
});
