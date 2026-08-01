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
import { SettingsModal } from '../components/SettingsModal';

const useAttentionLoop = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

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

    Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();

    return () => clearTimeout(timeoutId);
  }, []);

  return { fadeAnim, scaleAnim, borderAnim };
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

const ElectrifiedText = ({ text, style, startIndex = 0, totalLetters = 13 }: { text: string; style: any; startIndex?: number; totalLetters?: number }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1, // Full wave pass
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(anim, {
        toValue: 2, // Fade to static gradient
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      })
    ]).start();
  }, [anim]);

  const gradientColors = [
    '#FFFFFF', '#F8FAFC', '#E5E7EB', '#CBD5E1', '#F8FAFC',
    '#FFFFFF', '#D1D5DB', '#F9FAFB', '#E2E8F0', '#FFFFFF',
    '#CBD5E1', '#F8FAFC', '#FFFFFF'
  ];

  return (
    <View style={{ flexDirection: 'row' }}>
      {text.split('').map((char, index) => {
        const center = (startIndex + index) / totalLetters;
        const spread = 0.15; // 15% of the text glows at once
        const staticGradientColor = gradientColors[startIndex + index] || '#FFFFFF';

        const color = anim.interpolate({
          inputRange: [
            -1, // Dummy to ensure strictly increasing
            center - spread, center, center + spread,
            1.5, 2
          ],
          outputRange: [
            style.color || '#FFFFFF', 
            style.color || '#FFFFFF', '#FFFFFF', style.color || '#FFFFFF',
            style.color || '#FFFFFF', staticGradientColor
          ],
          extrapolate: 'clamp',
        });
        
        return (
          <Animated.Text 
            key={`${char}-${index}`} 
            style={[
              style, 
              { 
                color,
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
  const { height, width } = useWindowDimensions();
  const isSmallScreen = height < 700;
  const isTablet = width >= 768;
  
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const titleColor = '#FFFFFF';
  const subtitleColor = '#2A1E5C';
  const [showSettings, setShowSettings] = useState(false);


  return (
    <View style={{ flex: 1 }}>
      <GlobalBackground showCubes />
      <ScreenWrapper transparent>
        <TopBar 
          title="" 
          hideHome 
          hideTitle 
          hideBorder
          noEdgeToEdge
          rightComponent={
            <Pressable onPress={() => setShowSettings(true)} style={{ alignItems: 'center', justifyContent: 'center', padding: 8, marginRight: -8 }}>
              <Ionicons name="options-outline" size={24} color="#2A1E5C" />
            </Pressable>
          }
        />

        <View style={styles.startContainer}>
          <View style={[styles.startContent, isSmallScreen && { marginBottom: theme.spacing.xl }]}>
            <Animated.View style={{ position: 'absolute', top: -95, left: -15, width: 90, height: 90, zIndex: 10, transform: [{ translateY: floatAnim }], alignItems: 'center' }}>
              <View style={{ 
                position: 'absolute', 
                bottom: 85, // Stops just at the top of his helmet
                width: 1, 
                height: 500, // Long enough to go off screen
                backgroundColor: 'rgba(30, 58, 138, 0.5)', // Navy blue
                zIndex: 9, 
              }} />
              <Image 
                source={require('../../assets/mascot_v2_transparent.png')} 
                style={{ width: 90, height: 90, resizeMode: 'contain', zIndex: 10 }} 
              />
            </Animated.View>
            <ElectrifiedText text="Smart" style={[styles.startTitle, { fontFamily: FONTS.medium, fontWeight: '500', color: titleColor, marginBottom: -2 }]} startIndex={0} totalLetters={13} />
            <ElectrifiedText text="Explorer" style={[styles.startTitle, { fontFamily: FONTS.medium, fontWeight: '500', color: titleColor }]} startIndex={5} totalLetters={13} />
          </View>

            <Text 
              style={[styles.startSubtitle, { color: subtitleColor, textAlign: 'center', fontFamily: FONTS.medium, fontWeight: '500' }, isSmallScreen && { paddingHorizontal: theme.spacing.lg }]}
            >
              Turn your knowledge{'\n'}into cool rewards!
            </Text>

            <Button
              title="START"
              iconName="rocket-outline"
              onPress={() => navigation.navigate('AppTabs')}
              style={styles.actionButton}
              textStyle={{ fontFamily: FONTS.semiBold, fontWeight: '600', fontSize: 17 }}
            />
        </View>
      </ScreenWrapper>
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
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
    marginTop: '-10%',
  },
  startTitle: {
    ...theme.typography.display,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  startSubtitle: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    letterSpacing: 0,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
  },
});
