import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, FONTS } from '../theme';
import { GlobalBackground } from '../components/GlobalBackground';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GradientIcon } from '../components/GradientIcon';
import { QuizLibraryStackParamList } from '../navigation/QuizLibraryNavigator';
import { useMood, getMoodColors } from '../context/MoodContext';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';

type NavigationProp = NativeStackNavigationProp<QuizLibraryStackParamList, 'QuizMenu'>;

export const QuizMenuScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  
  const isDark = moodColors.isDark;
  
  return (
    <View style={styles.container}>
      <GlobalBackground />
      <View style={{ paddingTop: insets.top }}>
        <TopBar title="Earn Coins" onBack={() => navigation.goBack()} />
      </View>
      <ScreenWrapper transparent>
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
              onPress={() => navigation.navigate('Tasks')}
            >
              <Card style={styles.card}>
                <View style={styles.iconContainer}>
                  <GradientIcon iconFamily="Ionicons" name="checkmark-circle-outline" size={48} />
                </View>
                <Text style={[styles.cardTitle, { color: isDark ? '#FFFFFF' : theme.colors.text }]}>Complete Tasks</Text>
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
    paddingHorizontal: theme.spacing.lg,
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
