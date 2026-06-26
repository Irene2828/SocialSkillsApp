import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { TopicProgressList } from '../components/TopicProgressList';
import { ParentLockToggle } from '../components/ParentLockToggle';
import { Button } from '../components/Button';
import { useProgress } from '../context/ProgressContext';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export const SettingsScreen = () => {
  const { achievements, isParentModeUnlocked, dailyLimit, setDailyLimit, resetAllData, childName, childAge, totalQuizzesCompleted } = useProgress();

  const handleResetData = () => {
    Alert.alert(
      "Reset Progress?",
      "Are you sure? This will reset all progress and quizzes.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes, Reset", 
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Final Confirmation",
              "We are safely clearing the data. Continue?",
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "Reset", 
                  style: "destructive",
                  onPress: () => {
                    resetAllData();
                    Alert.alert("Success", "We saved your progress safely (Reset complete).");
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <ScreenWrapper>
      <Header title="Profile" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Child Profile (Stack) */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={32} color={theme.colors.white} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{childName}</Text>
            <Text style={styles.profileAge}>Age: {childAge}</Text>
          </View>
        </Card>

        {/* Achievements (Topic Progress) */}
        <TopicProgressList totalCompletions={totalQuizzesCompleted} />

        {/* Parent Section */}
        <ParentLockToggle />

        {isParentModeUnlocked && (
          <Card style={styles.parentControlsCard}>
            <Text style={styles.controlTitle}>Daily Quiz Limit</Text>
            <Text style={styles.controlDescription}>Prevent burnout by limiting quizzes per day.</Text>
            <View style={styles.limitRow}>
              {[1, 2, 3, 5, 10].map(limit => (
                <Button 
                  key={limit}
                  title={`${limit}`}
                  variant={dailyLimit === limit ? 'primary' : 'secondary'}
                  onPress={() => setDailyLimit(limit)}
                  style={styles.limitButton}
                />
              ))}
            </View>
            
            <Text style={[styles.controlTitle, { marginTop: theme.spacing.lg, color: '#EF4444' }]}>Danger Zone</Text>
            <Button 
              title="Reset All Progress" 
              variant="secondary" 
              onPress={handleResetData} 
            />
          </Card>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...theme.typography.heading,
    fontSize: 20,
    color: theme.colors.text,
  },
  profileAge: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
  },
  sectionHeader: {
    ...theme.typography.heading,
    fontSize: 22,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  parentControlsCard: {
    marginBottom: theme.spacing.lg,
  },
  controlTitle: {
    ...theme.typography.heading,
    fontSize: 18,
    marginBottom: theme.spacing.xs,
  },
  controlDescription: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.md,
  },
  limitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  limitButton: {
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    minWidth: 50,
  },
});
