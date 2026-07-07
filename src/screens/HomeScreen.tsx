import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, useWindowDimensions, Pressable, Image } from 'react-native';
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
      <Image 
        source={require('../../assets/space_bg.png')} 
        style={[StyleSheet.absoluteFill, { opacity: 0.15, resizeMode: 'repeat' }]} 
      />
      <ScreenWrapper transparent>
        <TopBar title="" />

        <View style={styles.startContainer}>
          <View style={[styles.startContent, isSmallScreen && { marginBottom: theme.spacing.xl }]}>
            <Image 
              source={require('../../assets/mascot_v2_transparent.png')} 
              style={{ width: 90, height: 90, position: 'absolute', top: -45, left: -15, resizeMode: 'contain', zIndex: 10 }} 
            />
            <Text style={[styles.startTitle, { fontFamily: FONTS.medium, fontWeight: '500', color: titleColor, marginBottom: -2 }]}>Smart</Text>
            <Text style={[styles.startTitle, { fontFamily: FONTS.medium, fontWeight: '500', color: titleColor }]}>Explorer</Text>
          </View>

            <Text 
              style={[styles.startSubtitle, { color: subtitleColor, textAlign: 'center', fontWeight: '500' }, isSmallScreen && { paddingHorizontal: theme.spacing.lg }]}
              numberOfLines={2}
            >
              Turn your knowledge{'\n'}into rewards!
            </Text>

            <Animated.View
              style={{
                width: '100%',
                alignItems: 'center',
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }}
            >
              <Button
                title="Start Now"
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
