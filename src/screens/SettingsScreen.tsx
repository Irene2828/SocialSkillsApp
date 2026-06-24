import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { AchievementList } from '../components/AchievementList';
import { useProgress } from '../context/ProgressContext';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export const SettingsScreen = () => {
  const { achievements } = useProgress();

  return (
    <ScreenWrapper>
      <Header title="Settings" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Child Profile (Stack) */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={32} color={theme.colors.white} />
          </View>
          <View>
            <Text style={styles.profileName}>Child Profile</Text>
            <Text style={styles.profileAge}>Age: 7-10</Text>
          </View>
        </Card>

        {/* Achievements (Light Bento Mix) */}
        <AchievementList unlockedIds={achievements} />

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
  profileName: {
    ...theme.typography.heading,
    fontSize: 20,
    color: theme.colors.text,
  },
  profileAge: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
  },
});
