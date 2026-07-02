import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface HeaderProps {
  title: string;
  hasDivider?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  style?: any;
  align?: 'left' | 'center' | 'right';
}

export const Header: React.FC<HeaderProps> = ({ title, hasDivider, leftElement, rightElement, style, align }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.contentContainer, align === 'left' && { justifyContent: 'flex-start' }, align === 'right' && { justifyContent: 'flex-end' }]}>
        {leftElement && (
          <View style={styles.leftElementContainer}>
            {leftElement}
          </View>
        )}
        <Text style={[styles.title, align && { textAlign: align }]}>{title}</Text>
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
    ...theme.typography.subheading,
    textAlign: 'center',
  },
  leftElementContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
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
