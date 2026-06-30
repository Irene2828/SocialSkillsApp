import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { AnimatedCubesBackground } from '../components/AnimatedCubesBackground';

export const HomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1 }}>
      <AnimatedCubesBackground />
      <ScreenWrapper transparent>
        <View style={styles.startContainer}>
          <View style={styles.startContent}>
            <Text 
              style={styles.startTitle}
              adjustsFontSizeToFit
              numberOfLines={2}
            >
              Social Explorer
            </Text>
          </View>
          <View style={{ width: '100%', alignItems: 'center' }}>
            <Text style={styles.startSubtitle}>Ready to practice?</Text>
            <Button 
              title="Start Quiz" 
              onPress={() => navigation.navigate('NewQuiz')} 
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  startContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  startTitle: {
    ...theme.typography.heading,
    fontSize: 42,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 52, // Half spacing
    textAlign: 'center', // Centered with subtitle
  },
  startSubtitle: {
    ...theme.typography.body,
    fontSize: 18,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    width: '100%',
  }
});
