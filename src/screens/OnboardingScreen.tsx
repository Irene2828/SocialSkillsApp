import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Animated } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useProgress } from '../context/ProgressContext';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { ScalePressable } from '../components/ScalePressable';

export const OnboardingScreen = () => {
  const { setChildProfile, setOnboarded } = useProgress();
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [avatar, setAvatar] = useState<string>('person');

  const avatars = ['person', 'rocket', 'star', 'planet'];

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    }
  };

  const handleFinish = async () => {
    // Save profile and mark onboarded
    const finalName = name.trim() || 'Explorer';
    const finalAge = age || 7;
    await setChildProfile(finalName, finalAge);
    // You could also save avatar to context if needed, but keeping it simple for MVP
    await setOnboarded();
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Welcome to Social Explorer</Text>
      <Text style={styles.subtitle}>Helping kids build strong social skills through simple daily practice.</Text>
      <Button title="Get Started" onPress={handleNext} style={styles.button} />
    </View>
  );

  const renderStep2 = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollStepContainer}>
      <Text style={styles.title}>Who is playing?</Text>
      
      <Text style={styles.label}>Child's Name</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g. Alex"
        value={name}
        onChangeText={setName}
        maxLength={15}
        placeholderTextColor={theme.colors.secondaryText}
      />

      <Text style={styles.label}>Age</Text>
      <View style={styles.row}>
        {[5, 6, 7, 8, 9, 10].map(a => (
          <ScalePressable 
            key={a} 
            onPress={() => setAge(a)}
            style={[styles.ageButton, age === a && styles.ageButtonActive]}
          >
            <Text style={[styles.ageText, age === a && styles.ageTextActive]}>{a}</Text>
          </ScalePressable>
        ))}
      </View>

      <Text style={styles.label}>Choose an Avatar</Text>
      <View style={styles.row}>
        {avatars.map(icon => (
          <ScalePressable 
            key={icon}
            onPress={() => setAvatar(icon)}
            style={[styles.avatarButton, avatar === icon && styles.avatarButtonActive]}
          >
            <Ionicons 
              name={icon as any} 
              size={32} 
              color={avatar === icon ? theme.colors.white : theme.colors.primary} 
            />
          </ScalePressable>
        ))}
      </View>

      <View style={styles.spacer} />
      <Button 
        title="Continue" 
        onPress={handleNext} 
        style={styles.button} 
        disabled={name.trim().length === 0 || age === null}
      />
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollStepContainer}>
      <Ionicons name="shield-checkmark-outline" size={60} color={theme.colors.success} style={styles.icon} />
      <Text style={styles.title}>For the Parents</Text>
      
      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="bulb-outline" size={24} color={theme.colors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Quizzes</Text>
            <Text style={styles.infoDesc}>Daily learning tools to spark conversations.</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={24} color={theme.colors.accent} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Coins</Text>
            <Text style={styles.infoDesc}>Children earn coins to redeem real-life rewards you set.</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="settings-outline" size={24} color={theme.colors.secondaryText} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Parent Controls</Text>
            <Text style={styles.infoDesc}>Manage limits and rewards safely in the Settings tab.</Text>
          </View>
        </View>
      </Card>

      <View style={styles.spacer} />
      <Button title="Continue as Parent" onPress={handleNext} style={styles.button} variant="secondary" />
    </ScrollView>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Ionicons name="rocket-outline" size={80} color={theme.colors.primary} style={styles.icon} />
      <Text style={styles.title}>All Set!</Text>
      <Text style={styles.subtitle}>You are ready to start building great social skills.</Text>
      <View style={styles.spacer} />
      <Button title="Start First Quiz" onPress={handleFinish} style={styles.button} />
    </View>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.xl,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollStepContainer: {
    flexGrow: 1,
    paddingVertical: theme.spacing.xl,
  },
  icon: {
    marginBottom: theme.spacing.lg,
    alignSelf: 'center',
  },
  title: {
    ...theme.typography.heading,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.body,
    fontSize: 16,
    textAlign: 'center',
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.xl,
  },
  spacer: {
    flex: 1,
    minHeight: theme.spacing.xl,
  },
  button: {
    width: '100%',
  },
  label: {
    ...theme.typography.heading,
    fontSize: 18,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    fontSize: 18, // Placed after spread to override
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  ageButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  ageText: {
    ...theme.typography.heading,
    color: theme.colors.text,
  },
  ageTextActive: {
    color: theme.colors.white,
  },
  avatarButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  infoCard: {
    marginTop: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  infoTextContainer: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  infoTitle: {
    ...theme.typography.heading,
    fontSize: 18,
  },
  infoDesc: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    marginTop: 4,
  },
});
