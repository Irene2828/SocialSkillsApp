import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, useWindowDimensions, Pressable } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Button } from '../components/Button';
import { theme, FONTS } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useMood, getMoodColors } from '../context/MoodContext';
import { TopBar } from '../components/TopBar';
import { GlobalBackground } from '../components/GlobalBackground';

const useAttentionLoop = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const pulse = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 350, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.92, duration: 350, easing: Easing.in(Easing.ease), useNativeDriver: true }),
      ]).start(() => {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.back(1.6)), useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.back(1.6)), useNativeDriver: true }),
          ]).start(() => {
            const delay = 3000 + Math.random() * 3000;
            timeoutId = setTimeout(pulse, delay);
          });
        }, 120);
      });
    };

    timeoutId = setTimeout(pulse, 4000);
    return () => clearTimeout(timeoutId);
  }, []);

  return { fadeAnim, scaleAnim };
};


export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { fadeAnim, scaleAnim } = useAttentionLoop();
  const { height } = useWindowDimensions();
  const isSmallScreen = height < 700;
  
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const titleColor = moodColors.isDark ? '#FFFFFF' : theme.colors.text;
  const subtitleColor = moodColors.isDark ? 'rgba(255,255,255,0.7)' : theme.colors.secondaryText;


  return (
    <View style={{ flex: 1 }}>
      <GlobalBackground showCubes />
      <ScreenWrapper transparent>
        <TopBar title="" />

        <View style={styles.startContainer}>
          <View style={[styles.startContent, isSmallScreen && { marginBottom: theme.spacing.xl }]}>
            <Text style={[styles.startTitle, { fontFamily: FONTS.regularItalic, fontWeight: '400', color: titleColor }]}>Smart</Text>
            <Text style={[styles.startTitle, { fontFamily: FONTS.regularItalic, fontWeight: '400', color: titleColor }]}>Explorer</Text>
          </View>

          <Animated.View
            style={{
              width: '100%',
              alignItems: 'center',
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <Text style={[styles.startSubtitle, { color: subtitleColor }]}>Ready to test?</Text>
            <Button
              title="Start Quiz"
              onPress={() => navigation.navigate('NewQuiz')}
              style={styles.actionButton}
            />
          </Animated.View>
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
    ...theme.typography.display,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  startSubtitle: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    letterSpacing: 0.1,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    width: '100%',
  },
});
