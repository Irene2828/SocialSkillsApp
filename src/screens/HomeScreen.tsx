import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Easing, useWindowDimensions, Pressable, Image, AccessibilityInfo, Dimensions, PanResponder, Platform } from 'react-native';
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
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { ScalePressable } from '../components/ScalePressable';
import { SpaceTouchCanvas } from '../components/SpaceTouchCanvas';
import { ConstellationTracerOverlay } from '../components/ConstellationTracerOverlay';
import { LogBox } from 'react-native';

// Suppress WebGL warnings globally (LogBox for native, window handler for web)
LogBox.ignoreLogs(['THREE.WebGLRenderer', 'Error creating WebGL context', 'Promise Rejection']);
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  const origOnError = window.onerror;
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes?.('WebGL') || String(event.reason).includes('WebGL')) {
      event.preventDefault();
    }
  });
}

// WebGL 3D text removed to improve stability
// Kept AstronautHero

// Dead CosmicCanvas + AstronautHero removed — replaced by SpaceTouchCanvas.

// Removed GradientText and GlassCTA

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
  const { height, width } = useWindowDimensions();
  const isSmallScreen = height < 700;
  const isTablet = width >= 768;
  
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const titleColor = '#FFFFFF';
  const subtitleColor = '#FFFFFF';
  const [showSettings, setShowSettings] = useState(false);
  const [showZenMode, setShowZenMode] = useState(false);

  const [isShattered, setIsShattered] = useState(false);
  const [webGLFailed, setWebGLFailed] = useState(false);

  const insets = useSafeAreaInsets();
  const footerPaddingBottom = (Math.max(insets.bottom, isTablet ? 20 : (isSmallScreen ? 8 : 10)) / 2) * 0.5;
  const footerHeight = isTablet
    ? 64 + footerPaddingBottom
    : isSmallScreen
    ? 60 + footerPaddingBottom
    : 68 + Math.round(footerPaddingBottom * 1.2);
  const footerPaddingTop = isTablet ? 5 : (isSmallScreen ? 4 : 5);
  return (
    <View style={{ flex: 1, overflow: 'hidden', backgroundColor: '#0b0f19' }}>
      <GlobalBackground showClouds dimmed={false} />
      <SpaceTouchCanvas />

      { !showZenMode && (
      <ScreenWrapper transparent>
        <TopBar 
          title="" 
          hideHome 
          hideTitle 
          hideBorder
          noEdgeToEdge
        />

        <View style={styles.startContainer} pointerEvents="box-none">
          <View style={[styles.startContent, isSmallScreen && { marginBottom: theme.spacing.xl }]} pointerEvents="box-none">

            {/* Title - always visible, shatter only on web */}
            <View style={{
              width: '100%',
              alignItems: 'center',
              position: 'relative',
              // @ts-ignore — force own compositing layer to prevent WebKit canvas flicker
              willChange: 'transform',
            }}>
              <Pressable
                onPress={() => {
                  if (Platform.OS === 'web') {
                    setIsShattered(prev => !prev);
                  }
                }}
                style={{
                  alignItems: 'center',
                  // @ts-ignore — web-only CSS interaction lock
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                }}
              >
                <View style={{
                  opacity: (isShattered && !webGLFailed && Platform.OS === 'web') ? 0 : 1,
                  alignItems: 'center',
                  transform: [{ translateX: 0 }],  // triggers GPU layer promotion on RN web
                  // @ts-ignore — web-only: force compositing layer to prevent canvas z-fighting flicker
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                }}>
                  <ElectrifiedText text="Smart" style={[styles.startTitle, { fontFamily: FONTS.medium, fontWeight: '500', color: titleColor, marginBottom: -2 }]} startIndex={0} totalLetters={13} />
                  <ElectrifiedText text="Explorer" style={[styles.startTitle, { fontFamily: FONTS.medium, fontWeight: '500', color: titleColor }]} startIndex={5} totalLetters={13} />
                </View>
              </Pressable>
            </View>
          </View>

          <View style={{ transform: [{ translateY: isTablet ? 30 : 20 }], width: '100%', alignItems: 'center' }} pointerEvents="box-none">
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
        </View>
      </ScreenWrapper>
      )}

      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
      {showZenMode && <ConstellationTracerOverlay onClose={() => setShowZenMode(false)} />}
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
    fontSize: 46,
    lineHeight: 56,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  startSubtitle: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    letterSpacing: 0.4,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    width: '80%',
    maxWidth: 408,
    alignSelf: 'center',
    paddingHorizontal: 64,
    minWidth: 208,
    paddingVertical: 13, // 20% shorter than default 16
    minHeight: 0,        // allow paddingVertical to control height
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
