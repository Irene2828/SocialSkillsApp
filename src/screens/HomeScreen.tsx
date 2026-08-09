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

// ShatterText3D is lazy-loaded on web only to prevent Three.js crashing on native
let ShatterText3D: any = null;
if (Platform.OS === 'web') {
  try {
    ShatterText3D = require('../components/ShatterText3D').ShatterText3D;
  } catch (e) {
    console.log('ShatterText3D failed to load:', e);
  }
}

// Kept AstronautHero

const AstronautHero = ({ reduceMotion, touchDisplacement }: { reduceMotion: boolean, touchDisplacement: Animated.ValueXY }) => {
  const { width, height } = useWindowDimensions();
  const floatX = useRef(new Animated.Value(0)).current;
  const floatY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const dragXY = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const isDragging = useRef(false);

  const animateRandomly = () => {
    if (reduceMotion || isDragging.current) return;
    
    // Pick random target covering most of the screen
    const targetX = (Math.random() - 0.5) * (width * 0.7);
    const targetY = (Math.random() - 0.5) * (height * 0.6);
    const durationX = 7000 + Math.random() * 5000;
    const durationY = 7000 + Math.random() * 5000;

    Animated.timing(floatX, {
      toValue: targetX,
      duration: durationX,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      // Loop recursively when X finishes, provided we aren't dragging
      if (finished && !isDragging.current) animateRandomly();
    });

    Animated.timing(floatY, {
      toValue: targetY,
      duration: durationY,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isDragging.current = true;
        floatX.stopAnimation();
        floatY.stopAnimation();
        dragXY.extractOffset();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: dragXY.x, dy: dragXY.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        isDragging.current = false;
        dragXY.flattenOffset();
        animateRandomly();
      }
    })
  ).current;

  useEffect(() => {
    animateRandomly();

    Animated.loop(
      Animated.sequence([
        Animated.timing(rotate, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

  }, [reduceMotion]);

  const rotateDeg = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-8deg', '8deg']
  });

  return (
    <Animated.View 
      {...panResponder.panHandlers}
      style={{
        width: 90, height: 90, zIndex: 10, marginBottom: 20,
        transform: [
          { translateX: floatX },
          { translateY: floatY },
          { translateX: touchDisplacement.x },
          { translateY: touchDisplacement.y },
          { rotate: rotateDeg }
        ],
        alignItems: 'center',
        justifyContent: 'center',
        // @ts-ignore
        touchAction: 'none'
      }}
    >
      <Animated.View style={{
        transform: [
          { translateX: dragXY.x },
          { translateY: dragXY.y }
        ],
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Image 
          source={require('../../assets/mascot_v2_transparent.png')} 
          style={{ width: 110, height: 110, resizeMode: 'contain', zIndex: 10 }} 
          pointerEvents="none"
          draggable={false}
        />
      </Animated.View>
    </Animated.View>
  );
};

// Physics System & Cosmic Canvas (Native Animated implementation)
const PARTICLE_COUNT = 60;
const SHOCKWAVE_COUNT = 5;
const PARTICLE_COLORS = ['#00f2fe', '#4facfe', '#ffd166', '#ffffff', '#c084fc', '#38bdf8'];

export interface CosmicPhysicsRef {
  triggerTouchDown: (x: number, y: number) => void;
  triggerTouchMove: (x: number, y: number) => void;
}

const CosmicCanvas = React.forwardRef<CosmicPhysicsRef, { reduceMotion: boolean }>(({ reduceMotion }, ref) => {
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      animX: new Animated.Value(0),
      animY: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(1),
      active: false,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      baseRadius: Math.random() * 3 + 2,
    }))
  ).current;

  const shockwaves = useRef(
    Array.from({ length: SHOCKWAVE_COUNT }, () => ({
      animX: new Animated.Value(0),
      animY: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.1),
      active: false,
      maxRadius: 100,
    }))
  ).current;

  const spawnParticle = (cx: number, cy: number, isMove = false) => {
    const p = particles.find(pt => !pt.active);
    if (!p) return;

    p.active = true;
    p.animX.stopAnimation();
    p.animY.stopAnimation();
    p.opacity.stopAnimation();
    p.scale.stopAnimation();

    const startX = cx - p.baseRadius;
    const startY = cy - p.baseRadius;

    const angle = Math.random() * Math.PI * 2;
    const distance = isMove ? (Math.random() * 45 + 15) : (Math.random() * 90 + 30);
    const duration = isMove ? (Math.random() * 500 + 700) : (Math.random() * 800 + 900);
    const startScale = isMove ? (Math.random() * 0.6 + 0.6) : (Math.random() * 0.8 + 0.8);

    const endX = startX + Math.cos(angle) * distance;
    const endY = startY + Math.sin(angle) * distance;

    p.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    p.animX.setValue(startX);
    p.animY.setValue(startY);
    p.opacity.setValue(0.9);
    p.scale.setValue(startScale);

    Animated.parallel([
      Animated.timing(p.animX, { toValue: endX, duration, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(p.animY, { toValue: endY, duration, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(p.opacity, { toValue: 0, duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(p.scale, { toValue: 0.1, duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start(() => {
      p.active = false;
    });
  };

  const lastMoveTime = useRef(0);

  React.useImperativeHandle(ref, () => ({
    triggerTouchDown: (cx: number, cy: number) => {
      if (reduceMotion) return;

      // Spawn Shockwave
      const sw = shockwaves.find(s => !s.active);
      if (sw) {
        sw.active = true;
        sw.animX.stopAnimation();
        sw.animY.stopAnimation();
        sw.opacity.stopAnimation();
        sw.scale.stopAnimation();

        sw.animX.setValue(cx - sw.maxRadius);
        sw.animY.setValue(cy - sw.maxRadius);
        sw.scale.setValue(0.1);
        sw.opacity.setValue(0.7);

        Animated.parallel([
          Animated.timing(sw.scale, { toValue: 1.2, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(sw.opacity, { toValue: 0, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start(() => { sw.active = false; });
      }

      // Burst 18 particles blowing outward
      for (let i = 0; i < 18; i++) {
        spawnParticle(cx, cy, false);
      }
    },
    triggerTouchMove: (cx: number, cy: number) => {
      if (reduceMotion) return;
      
      const now = Date.now();
      // Throttle particle spawning heavily on native to prevent bridge OOM crashes (max ~20fps)
      if (now - lastMoveTime.current > 45) {
        spawnParticle(cx, cy, true);
        spawnParticle(cx, cy, true);
        lastMoveTime.current = now;
      }
    }
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {shockwaves.map((sw, i) => (
        <Animated.View
          key={`sw-${i}`}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: sw.maxRadius * 2,
            height: sw.maxRadius * 2,
            borderRadius: sw.maxRadius,
            borderWidth: 2,
            borderColor: '#38bdf8',
            shadowColor: '#38bdf8',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 8,
            transform: [
              { translateX: sw.animX },
              { translateY: sw.animY },
              { scale: sw.scale }
            ],
            opacity: sw.opacity,
          }}
        />
      ))}
      {particles.map((p, i) => (
        <Animated.View
          key={`p-${i}`}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: p.baseRadius * 2,
            height: p.baseRadius * 2,
            borderRadius: p.baseRadius,
            backgroundColor: p.color,
            shadowColor: p.color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: 5,
            transform: [
              { translateX: p.animX },
              { translateY: p.animY },
              { scale: p.scale }
            ],
            opacity: p.opacity,
          }}
        />
      ))}
    </View>
  );
});

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

  const [reduceMotion, setReduceMotion] = useState(false);
  const [isShattered, setIsShattered] = useState(false);
  const [webGLFailed, setWebGLFailed] = useState(false);
  const touchDisplacement = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const cosmicRef = useRef<CosmicPhysicsRef>(null);

  const lastPushTime = useRef(0);

  const extractCoords = (evt: any) => {
    const ne = evt?.nativeEvent || {};
    const x = ne.locationX ?? ne.pageX;
    const y = ne.locationY ?? ne.pageY;
    if (typeof x !== 'number' || typeof y !== 'number' || !isFinite(x) || !isFinite(y)) {
      return null;
    }
    return { x, y };
  };

  const handlePointerDown = (evt: any) => {
    const coords = extractCoords(evt);
    if (!coords) return;
    cosmicRef.current?.triggerTouchDown(coords.x, coords.y);
    applyElasticPush(coords.x, coords.y);
    lastPushTime.current = Date.now();
  };

  const handlePointerMove = (evt: any) => {
    const coords = extractCoords(evt);
    if (!coords) return;
    cosmicRef.current?.triggerTouchMove(coords.x, coords.y);
    
    const now = Date.now();
    if (now - lastPushTime.current > 40) { // throttle spring updates
      applyElasticPush(coords.x, coords.y);
      lastPushTime.current = now;
    }
  };

  const handlePointerUp = () => {
    touchDisplacement.stopAnimation();
    Animated.spring(touchDisplacement, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Simple responder - only reacts to direct touches, doesn't steal from children
  const handleResponderGrant = (evt: any) => {
    handlePointerDown(evt);
  };
  const handleResponderMove = (evt: any) => {
    handlePointerMove(evt);
  };

  const applyElasticPush = (tx: number, ty: number) => {
    if (reduceMotion) return;
    const astronautCenterX = width / 2;
    const astronautCenterY = 150; // Approx based on top:-110 and layout
    
    const dx = astronautCenterX - tx;
    const dy = astronautCenterY - ty;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const maxRadius = 150;
    if (dist < maxRadius) {
      const force = (1 - dist / maxRadius) * 15; // Max 15px push
      const pushX = (dx / dist) * force;
      const pushY = (dy / dist) * force;
      
      touchDisplacement.stopAnimation();
      Animated.spring(touchDisplacement, {
        toValue: { x: pushX, y: pushY },
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    } else {
      touchDisplacement.stopAnimation();
      Animated.spring(touchDisplacement, {
        toValue: { x: 0, y: 0 },
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
    });
  }, []);

  const insets = useSafeAreaInsets();
  const footerPaddingBottom = (Math.max(insets.bottom, isTablet ? 20 : (isSmallScreen ? 8 : 10)) / 2) * 0.5;
  const footerHeight = isTablet
    ? 64 + footerPaddingBottom
    : isSmallScreen
    ? 60 + footerPaddingBottom
    : 68 + Math.round(footerPaddingBottom * 1.2);
  const footerPaddingTop = isTablet ? 5 : (isSmallScreen ? 4 : 5);

  return (
    <View 
      style={{ flex: 1, overflow: 'hidden', backgroundColor: '#0b0f19' }}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleResponderGrant}
      onResponderMove={handleResponderMove}
      onResponderRelease={handlePointerUp}
      onResponderTerminate={handlePointerUp}
    >
      <GlobalBackground showClouds dimmed={false} />
      
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <CosmicCanvas ref={cosmicRef} reduceMotion={reduceMotion} />
      </View>

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

        <View style={styles.startContainer} pointerEvents="box-none">
          <View style={[styles.startContent, isSmallScreen && { marginBottom: theme.spacing.xl }]} pointerEvents="box-none">
            <AstronautHero reduceMotion={reduceMotion} touchDisplacement={touchDisplacement} />
            {/* Title - always visible, shatter only on web */}
            <View style={{ width: '100%', alignItems: 'center', position: 'relative' }}>
              <Pressable
                onPress={() => {
                  if (Platform.OS === 'web') {
                    setIsShattered(prev => !prev);
                  }
                }}
                style={{ alignItems: 'center' }}
              >
                <View style={{ opacity: (isShattered && !webGLFailed && Platform.OS === 'web') ? 0 : 1, alignItems: 'center' }}>
                  <ElectrifiedText text="Smart" style={[styles.startTitle, { fontFamily: FONTS.medium, fontWeight: '500', color: titleColor, marginBottom: -2 }]} startIndex={0} totalLetters={13} />
                  <ElectrifiedText text="Explorer" style={[styles.startTitle, { fontFamily: FONTS.medium, fontWeight: '500', color: titleColor }]} startIndex={5} totalLetters={13} />
                </View>
              </Pressable>
              {Platform.OS === 'web' && ShatterText3D && (
                <ShatterText3D isShattered={isShattered} onError={() => setWebGLFailed(true)} />
              )}
            </View>
          </View>

          <View style={{ transform: [{ translateY: isTablet ? -20 : -15 }], width: '100%', alignItems: 'center' }} pointerEvents="box-none">
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
    fontSize: 46,
    lineHeight: 56,
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
    maxWidth: 510,
    alignSelf: 'center',
    paddingHorizontal: 80,
    minWidth: 260,
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
