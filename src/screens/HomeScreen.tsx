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
import { ShatterText3D } from '../components/ShatterText3D';

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
          { translateX: Animated.add(Animated.add(floatX, touchDisplacement.x), dragXY.x) }, 
          { translateY: Animated.add(Animated.add(floatY, touchDisplacement.y), dragXY.y) }, 
          { rotate: rotateDeg }
        ],
        alignItems: 'center',
        justifyContent: 'center',
        // @ts-ignore
        touchAction: 'none'
      }}
    >
      <Image 
        source={require('../../assets/mascot_v2_transparent.png')} 
        style={{ width: 110, height: 110, resizeMode: 'contain', zIndex: 10 }} 
        pointerEvents="none"
        draggable={false}
      />
    </Animated.View>
  );
};

// Physics System & Cosmic Canvas (Native Animated implementation)
const PARTICLE_COUNT = 50;
const SHOCKWAVE_COUNT = 5;
const PARTICLE_COLORS = ['#00f2fe', '#4facfe', '#ffd166'];

export interface CosmicPhysicsRef {
  triggerTouchDown: (x: number, y: number) => void;
  triggerTouchMove: (x: number, y: number) => void;
}

const CosmicCanvas = React.forwardRef<CosmicPhysicsRef, { reduceMotion: boolean }>(({ reduceMotion }, ref) => {
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      tx: new Animated.Value(0),
      ty: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(1),
      active: false,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      baseRadius: Math.random() * 3 + 2,
    }))
  ).current;

  const shockwaves = useRef(
    Array.from({ length: SHOCKWAVE_COUNT }, () => ({
      tx: new Animated.Value(0),
      ty: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.1),
      active: false,
      maxRadius: Math.random() * 50 + 100,
    }))
  ).current;

  React.useImperativeHandle(ref, () => ({
    triggerTouchDown: (cx: number, cy: number) => {
      if (reduceMotion) return;

      // Spawn Shockwave
      const sw = shockwaves.find(s => !s.active);
      if (sw) {
        sw.active = true;
        sw.tx.setValue(cx);
        sw.ty.setValue(cy);
        sw.scale.setValue(0.1);
        sw.opacity.setValue(0.6);

        Animated.parallel([
          Animated.timing(sw.scale, { toValue: 1, duration: 1200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(sw.opacity, { toValue: 0, duration: 1200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start(() => { sw.active = false; });
      }

      // Spawn Particles
      let spawned = 0;
      for (let i = 0; i < particles.length && spawned < 20; i++) {
        const p = particles[i];
        if (!p.active) {
          p.active = true;
          spawned++;

          p.tx.setValue(cx);
          p.ty.setValue(cy);
          p.opacity.setValue(1);
          p.scale.setValue(1);

          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 80 + 40; // 40-120px explosion
          const duration = Math.random() * 800 + 1000; // 1000-1800ms

          Animated.parallel([
            Animated.timing(p.tx, { toValue: cx + Math.cos(angle) * distance, duration, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(p.ty, { toValue: cy + Math.sin(angle) * distance, duration, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(p.opacity, { toValue: 0, duration, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(p.scale, { toValue: 0, duration, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          ]).start(() => { p.active = false; });
        }
      }
    },
    triggerTouchMove: (cx: number, cy: number) => {
      if (reduceMotion || Math.random() > 0.3) return;

      let spawned = 0;
      for (let i = 0; i < particles.length && spawned < 2; i++) {
        const p = particles[i];
        if (!p.active) {
          p.active = true;
          spawned++;

          p.tx.setValue(cx);
          p.ty.setValue(cy);
          p.opacity.setValue(0.8);
          p.scale.setValue(0.8);

          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 30 + 10;
          const duration = Math.random() * 600 + 800; // 800-1400ms

          Animated.parallel([
            Animated.timing(p.tx, { toValue: cx + Math.cos(angle) * distance, duration, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(p.ty, { toValue: cy + Math.sin(angle) * distance, duration, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(p.opacity, { toValue: 0, duration, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(p.scale, { toValue: 0, duration, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          ]).start(() => { p.active = false; });
        }
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
            width: sw.maxRadius * 2,
            height: sw.maxRadius * 2,
            borderRadius: sw.maxRadius,
            borderWidth: 2,
            borderColor: '#4facfe',
            transform: [
              { translateX: Animated.subtract(sw.tx, sw.maxRadius) },
              { translateY: Animated.subtract(sw.ty, sw.maxRadius) },
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
            width: p.baseRadius * 2,
            height: p.baseRadius * 2,
            borderRadius: p.baseRadius,
            backgroundColor: p.color,
            shadowColor: p.color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            transform: [
              { translateX: Animated.subtract(p.tx, p.baseRadius) },
              { translateY: Animated.subtract(p.ty, p.baseRadius) },
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

  const handlePointerDown = (evt: any) => {
    const { locationX, locationY } = evt.nativeEvent;
    cosmicRef.current?.triggerTouchDown(locationX, locationY);
    applyElasticPush(locationX, locationY);
  };

  const handlePointerMove = (evt: any) => {
    const { locationX, locationY } = evt.nativeEvent;
    cosmicRef.current?.triggerTouchMove(locationX, locationY);
    applyElasticPush(locationX, locationY);
  };

  const handlePointerUp = () => {
    Animated.spring(touchDisplacement, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
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
      
      Animated.spring(touchDisplacement, {
        toValue: { x: pushX, y: pushY },
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    } else {
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
      onResponderGrant={handlePointerDown}
      onResponderMove={handlePointerMove}
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
            <Pressable 
              onPress={() => {
                if (Platform.OS === 'web') {
                  setIsShattered(prev => !prev);
                }
              }}
              style={{ width: '100%', alignItems: 'center', position: 'relative' }}
            >
              <View style={{ opacity: (isShattered && !webGLFailed && Platform.OS === 'web') ? 0 : 1, alignItems: 'center' }}>
                <ElectrifiedText text="Smart" style={[styles.startTitle, { fontFamily: FONTS.medium, fontWeight: '500', color: titleColor, marginBottom: -2 }]} startIndex={0} totalLetters={13} />
                <ElectrifiedText text="Explorer" style={[styles.startTitle, { fontFamily: FONTS.medium, fontWeight: '500', color: titleColor }]} startIndex={5} totalLetters={13} />
              </View>
              {Platform.OS === 'web' && (
                <ShatterText3D isShattered={isShattered} onError={() => setWebGLFailed(true)} />
              )}
            </Pressable>
          </View>

          <View style={{ transform: [{ translateY: isTablet ? 70 : 50 }], width: '100%', alignItems: 'center' }} pointerEvents="box-none">
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
    paddingHorizontal: 80, // Force button to be significantly wider
    minWidth: 260,
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
