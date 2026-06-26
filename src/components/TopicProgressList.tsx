import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

interface TopicProgressListProps {
  // We can pass total completions from context here, or just mock it as requested for now
  totalCompletions: number;
}

export const TopicProgressList: React.FC<TopicProgressListProps> = ({ totalCompletions }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Completed Quizzes</Text>
      
      <View style={styles.topicCard}>
        <Text style={styles.topicText}>Topic "Friendship"</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>5 times</Text>
        </View>
      </View>
      
      <View style={styles.topicCard}>
        <Text style={styles.topicText}>Topic "Playground"</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>0 times</Text>
        </View>
      </View>

      <View style={styles.topicCard}>
        <Text style={styles.topicText}>Topic "Manners"</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>2 times</Text>
        </View>
      </View>

      <View style={styles.topicCard}>
        <Text style={styles.topicText}>Topic "School"</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>0 times</Text>
        </View>
      </View>

      <View style={styles.topicCard}>
        <Text style={styles.topicText}>Topic "Feelings"</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>1 times</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.heading,
    fontSize: 22,
    marginBottom: theme.spacing.md,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.soft,
  },
  topicText: {
    ...theme.typography.body,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    paddingLeft: theme.spacing.sm,
  },
  badgeText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});
