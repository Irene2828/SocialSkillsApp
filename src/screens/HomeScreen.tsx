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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const subtitleColor = '#0C4A6E';
  const [showSettings, setShowSettings] = useState(false);


  const insets = useSafeAreaInsets();
  const footerPaddingBottom = Math.max(insets.bottom, isTablet ? 12 : 8);
  const footerHeight = isTablet ? 64 + footerPaddingBottom : isSmallScreen ? 60 + footerPaddingBottom : 68 + Math.round(footerPaddingBottom * 1.2);
  const footerPaddingTop = isTablet ? 5 : (isSmallScreen ? 4 : 5);

  return (
    <View style={{ flex: 1 }}>
      <GlobalBackground showClouds />
      <ScreenWrapper transparent>
        <TopBar 
          title="" 
          hideHome 
          hideTitle 
          hideBorder
          noEdgeToEdge
          rightComponent={
            <Pressable 
              onPress={() => setShowSettings(true)} 
              style={{ 
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                borderWidth: 1.2,
                borderColor: 'rgba(255, 255, 255, 0.4)',
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: 4
              }}
            >
              <Ionicons name="options-outline" size={20} color="#FFFFFF" />
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
              style={[styles.startSubtitle, { color: subtitleColor, textAlign: 'center', fontFamily: FONTS.medium, fontWeight: '500' }, isSmallScreen && { paddingHorizontal: 12 }]}
            >
              Turn your knowledge{'\n'}into cool rewards!
            </Text>

            <Button
              title="START"
              iconName="rocket-outline"
              onPress={() => navigation.navigate('AppTabs')}
              style={styles.actionButton}
              textStyle={{ fontFamily: FONTS.medium, fontWeight: '500', fontSize: 17, letterSpacing: 0.8 }}
            />
        </View>
      </ScreenWrapper>

      <View style={[styles.customFooter, { height: footerHeight, paddingBottom: footerPaddingBottom }]}>
        <Pressable style={[styles.footerTab, { paddingTop: footerPaddingTop }]} onPress={() => navigation.navigate('AppTabs', { screen: 'NewQuiz' })}>
          <Ionicons name="document-text-outline" size={isTablet ? 28 : 24} color="#FFFFFF" />
          <Text style={[styles.footerTabText, { fontSize: isTablet ? 14 : 12, lineHeight: isTablet ? 18 : 15, marginTop: isTablet ? 5 : 2 }]}>Quizes</Text>
        </Pressable>
        <Pressable style={[styles.footerTab, { paddingTop: footerPaddingTop }]} onPress={() => navigation.navigate('AppTabs', { screen: 'Tasks' })}>
          <Ionicons name="checkmark-done-circle-outline" size={isTablet ? 28 : 24} color="#FFFFFF" />
          <Text style={[styles.footerTabText, { fontSize: isTablet ? 14 : 12, lineHeight: isTablet ? 18 : 15, marginTop: isTablet ? 5 : 2 }]}>Tasks</Text>
        </Pressable>
        <Pressable style={[styles.footerTab, { paddingTop: footerPaddingTop }]} onPress={() => navigation.navigate('AppTabs', { screen: 'Puzzles' })}>
          <Ionicons name="extension-puzzle-outline" size={isTablet ? 28 : 24} color="#FFFFFF" />
          <Text style={[styles.footerTabText, { fontSize: isTablet ? 14 : 12, lineHeight: isTablet ? 18 : 15, marginTop: isTablet ? 5 : 2 }]}>Puzzles</Text>
        </Pressable>
        <Pressable style={[styles.footerTab, { paddingTop: footerPaddingTop }]} onPress={() => navigation.navigate('AppTabs', { screen: 'Drawing' })}>
          <Ionicons name="color-palette-outline" size={isTablet ? 28 : 24} color="#FFFFFF" />
          <Text style={[styles.footerTabText, { fontSize: isTablet ? 14 : 12, lineHeight: isTablet ? 18 : 15, marginTop: isTablet ? 5 : 2 }]}>Draw</Text>
        </Pressable>
      </View>

      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
    paddingBottom: 40,
  },
  startContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
    marginTop: '-10%',
  },
  startTitle: {
    ...theme.typography.display,
    fontSize: 55,
    lineHeight: 66,
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
  customFooter: {
    flexDirection: 'row',
    height: 72,
    backgroundColor: '#00CED1',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
    width: '100%',
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  footerTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 8,
  },
  footerTabText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: 0.8,
  },
});
