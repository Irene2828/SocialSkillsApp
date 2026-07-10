import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { GlobalBackground } from '../components/GlobalBackground';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { PuzzleStackParamList } from '../navigation/PuzzleNavigator';
import { useMood, getMoodColors } from '../context/MoodContext';

type NavigationProp = NativeStackNavigationProp<PuzzleStackParamList, 'PuzzleMenu'>;

export const PuzzleMenuScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  
  const isDark = moodColors.isDark;
  
  return (
    <View style={styles.container}>
      <GlobalBackground />
      <ScreenWrapper transparent>
        <View style={styles.content}>
          <View style={styles.cardsContainer}>
            <Pressable 
              style={({ pressed }) => [
                styles.card,
                { transform: [{ scale: pressed ? 0.95 : 1 }] }
              ]}
              onPress={() => navigation.navigate('PuzzleGame')}
            >
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(190, 242, 100, 0.2)' }]}>
                <Ionicons name="extension-puzzle-outline" size={48} color={theme.colors.success} />
              </View>
              <Text style={[styles.cardTitle, { color: moodColors.text }]}>Puzzles</Text>
            </Pressable>

            <Pressable 
              style={({ pressed }) => [
                styles.card,
                { transform: [{ scale: pressed ? 0.95 : 1 }] }
              ]}
              onPress={() => navigation.navigate('DrawingBoard')}
            >
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(167, 139, 250, 0.2)' }]}>
                <Ionicons name="color-palette-outline" size={48} color="#A78BFA" />
              </View>
              <Text style={[styles.cardTitle, { color: moodColors.text }]}>Drawing Board</Text>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: theme.spacing.lg,
  },
  card: {
    flex: 1,
    maxWidth: 160,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    padding: theme.spacing.md,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    ...theme.typography.heading,
    fontSize: 20,
    textAlign: 'center',
  }
});
