import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
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

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { fadeAnim, scaleAnim } = useAttentionLoop();

  return (
    <View style={{ flex: 1 }}>
      <AnimatedCubesBackground />
      <ScreenWrapper transparent>
        <View style={styles.startContainer}>
          <View style={styles.startContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Text style={styles.startTitle}>Social </Text>
              <AnimatedExplodingWord word="Explorer" style={styles.startTitle} />
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
            <Text style={styles.startSubtitle}>Ready to practice?</Text>
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
    ...theme.typography.heading,
    fontSize: 42,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 52,
    letterSpacing: -1.2,
    textAlign: 'center',
  },
  startSubtitle: {
    ...theme.typography.body,
    fontSize: 18,
    color: theme.colors.secondaryText,
    letterSpacing: 0.1,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    width: '100%',
  },
});
