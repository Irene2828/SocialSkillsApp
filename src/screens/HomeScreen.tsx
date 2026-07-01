import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, useWindowDimensions } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { AnimatedCubesBackground } from '../components/AnimatedCubesBackground';
import { AnimatedExplodingWord } from '../components/AnimatedExplodingWord';

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

const PROMPTS = [
  "Did you say please today?",
  "How are you feeling right now?",
  "Who did you help today?",
  "Ready for an adventure?"
];

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { fadeAnim, scaleAnim } = useAttentionLoop();
  const { height } = useWindowDimensions();
  const isSmallScreen = height < 700;
  
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % PROMPTS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);


  return (
    <View style={{ flex: 1 }}>
      <AnimatedCubesBackground />
      <ScreenWrapper transparent>
        {__DEV__ && (
          <View style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
            <Text 
              onPress={() => navigation.navigate('DesignQA')} 
              style={{ color: 'rgba(0,0,0,0.2)', fontSize: 12, fontWeight: 'bold' }}
            >
              QA
            </Text>
          </View>
        )}
        <View style={styles.startContainer}>
          <View style={[styles.startContent, isSmallScreen && { marginBottom: theme.spacing.xl }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', opacity: 0.8 }}>
              <Text style={[styles.startTitle, isSmallScreen && { lineHeight: 42 }, { color: theme.colors.text }]}>Social </Text>
              <AnimatedExplodingWord word="Explorer" style={[styles.startTitle, isSmallScreen && { lineHeight: 42 }, { color: theme.colors.text }]} />
            </View>
          </View>

          <Animated.View
            style={{
              width: '100%',
              alignItems: 'center',
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <Text style={styles.startSubtitle}>{PROMPTS[promptIndex]}</Text>
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
