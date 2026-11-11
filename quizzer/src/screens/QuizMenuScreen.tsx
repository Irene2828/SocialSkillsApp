import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme, FONTS } from '../theme';
import { GlobalBackground } from '../components/AstronautBackground';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GradientIcon } from '../components/QuizCard';
import { QuizzerStackParamList } from '../navigation/types';
import { useMood, getMoodColors } from '../context/MoodContext';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';

type NavigationProp = NativeStackNavigationProp<QuizzerStackParamList, 'QuizMenu'>;

export const QuizMenuScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const isDark = moodColors.isDark;

  return (
    <View style={styles.container}>
      <GlobalBackground />
      <ScreenWrapper transparent>
        <TopBar title="Earn Coins" onBack={() => navigation.goBack()} />
        <View style={styles.content}>
          <View style={[styles.cardsContainer, { flexDirection: isTablet ? 'row' : 'column', alignItems: 'center' }]}>
            <Pressable
              style={({ pressed }) => [
                { transform: [{ scale: pressed ? 0.95 : 1 }], width: '100%', maxWidth: 240 }
              ]}
              onPress={() => navigation.navigate('QuizLibrary')}
            >
              <Card style={styles.card}>
                <View style={styles.iconContainer}>
                  <GradientIcon iconFamily="Ionicons" name="bulb-outline" size={48} />
                </View>
                <Text style={[styles.cardTitle, { color: isDark ? '#FFFFFF' : theme.colors.text }]}>Solve Quizzes</Text>
              </Card>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                { transform: [{ scale: pressed ? 0.95 : 1 }], width: '100%', maxWidth: 240 }
              ]}
              onPress={() => navigation.navigate('CreateQuizFromPhoto', { initialTab: 'camera' })}
            >
              <Card style={styles.card}>
                <View style={styles.iconContainer}>
                  <GradientIcon iconFamily="Ionicons" name="camera-outline" size={48} />
                </View>
                <Text style={[styles.cardTitle, { color: isDark ? '#FFFFFF' : theme.colors.text }]}>Scan Homework</Text>
              </Card>
            </Pressable>
          </View>
        </View>
      </ScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  cardsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 24,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 20,
    marginTop: 8,
    textAlign: 'center',
  },
});
