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
        Animated.timing(fadeAnim, { toValue: 0.7, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]).start(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 800, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
        ]).start(() => {
          const delay = 6000 + Math.random() * 4000;
          timeoutId = setTimeout(pulse, delay);
        });
      });
    };

    timeoutId = setTimeout(pulse, 6000);
    return () => clearTimeout(timeoutId);
  }, []);

  return { fadeAnim, scaleAnim };
};

const useFloatAnim = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 8,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  return floatAnim;
};

const ElectrifiedText = ({ text, style }: { text: string; style: any }) => {
  const animatedValues = useRef(text.split('').map(() => new Animated.Value(0))).current;

  useEffect(() => {
    let isMounted = true;
    const animateElectricity = () => {
      if (!isMounted) return;
      const animations = animatedValues.map((anim, index) => {
        return Animated.sequence([
          Animated.delay(index * 200), // slower wave across letters
          Animated.timing(anim, {
            toValue: 1,
            duration: 400, // slower glow in
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1200, // slower glow out
            useNativeDriver: false,
          })
        ]);
      });

      Animated.sequence([
        Animated.stagger(0, animations),
        Animated.delay(1000) // Much shorter break before it goes again
      ]).start(({ finished }) => {
        if (finished && isMounted) animateElectricity();
      });
    };

    animateElectricity();
    return () => { isMounted = false; };
  }, [animatedValues]);

  return (
    <View style={{ flexDirection: 'row' }}>
      {text.split('').map((char, index) => {
        const color = animatedValues[index].interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [style.color || '#333', '#FDE047', '#38BDF8']
        });
        
        const shadowColor = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: ['rgba(56, 189, 248, 0)', 'rgba(56, 189, 248, 1)']
        });

        return (
          <Animated.Text 
            key={`${char}-${index}`} 
            style={[
              style, 
              { 
                color,
                textShadowColor: shadowColor,
                textShadowRadius: 8,
                textShadowOffset: { width: 0, height: 0 },
              }
            ]}
          >
            {char}
          </Animated.Text>
        );
      })}
    </View>
  );
};

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { fadeAnim, scaleAnim } = useAttentionLoop();
  const floatAnim = useFloatAnim();
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
            <Animated.Image 
              source={require('../../assets/mascot_v2_transparent.png')} 
              style={{ width: 90, height: 90, position: 'absolute', top: -45, left: -15, resizeMode: 'contain', zIndex: 10, transform: [{ translateY: floatAnim }] }} 
            />
            <ElectrifiedText text="Smart" style={[styles.startTitle, { fontFamily: FONTS.medium, fontWeight: '500', color: titleColor, marginBottom: -2 }]} />
            <ElectrifiedText text="Explorer" style={[styles.startTitle, { fontFamily: FONTS.medium, fontWeight: '500', color: titleColor }]} />
          </View>

            <Text 
              style={[styles.startSubtitle, { color: subtitleColor, textAlign: 'center', fontWeight: '600' }, isSmallScreen && { paddingHorizontal: theme.spacing.lg }]}
            >
              Turn your knowledge{'\n'}into cool rewards!
            </Text>

            <Button
              title="START NOW"
              onPress={() => navigation.navigate('NewQuiz')}
              style={styles.actionButton}
            />
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
