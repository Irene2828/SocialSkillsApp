import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Animated, Easing, AccessibilityInfo, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Button } from '../components/Button';
import { GlobalBackground } from '../components/GlobalBackground';
import { Card } from '../components/Card';
import { useProgress } from '../context/ProgressContext';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { ScalePressable } from '../components/ScalePressable';

const { width, height } = Dimensions.get('window');

const Star = ({ index, reduceMotion }: { index: number, reduceMotion: boolean }) => {
  const opacity = useRef(new Animated.Value(Math.random() * 0.5 + 0.2)).current;
  const size = Math.random() * 2 + 1;
  const left = Math.random() * width;
  const top = Math.random() * (height * 0.8);

  useEffect(() => {
    if (reduceMotion) return;
    const duration = Math.random() * 2000 + 1000;
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: Math.random() * 0.6 + 0.4,
          duration,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(opacity, {
          toValue: Math.random() * 0.3 + 0.1,
          duration,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, [reduceMotion]);

  return (
    <Animated.View style={{
      position: 'absolute',
      left,
      top,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: '#fff',
      opacity,
    }} />
  );
};

const Starfield = ({ reduceMotion }: { reduceMotion: boolean }) => {
  const stars = Array.from({ length: 50 }).map((_, i) => <Star key={i} index={i} reduceMotion={reduceMotion} />);
  return (
    <View style={StyleSheet.absoluteFill} shouldRasterizeIOS={true}>
      {stars}
    </View>
  );
};

const AstronautHero = ({ reduceMotion }: { reduceMotion: boolean }) => {
  const floatX = useRef(new Animated.Value(0)).current;
  const floatY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatX, {
          toValue: 1,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatX, {
          toValue: 0,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

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

  const translateY = floatY.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10]
  });

  const translateX = floatX.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 8]
  });

  const rotateDeg = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg']
  });

  return (
    <Animated.View style={{
      transform: [{ translateX }, { translateY }, { rotate: rotateDeg }],
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
      marginTop: 20
    }}>
      <LinearGradient
        colors={['rgba(65, 105, 225, 0.6)', 'rgba(138, 43, 226, 0.2)']}
        style={{
          width: 140,
          height: 140,
          borderRadius: 70,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.2)'
        }}
      >
         <Ionicons name="rocket" size={70} color="#fff" style={{ transform: [{ rotate: '45deg' }, { translateX: -5 }, { translateY: -5 }] }} />
      </LinearGradient>
    </Animated.View>
  );
};

const GradientText = ({ text, style }: { text: string, style: any }) => {
  return (
    <MaskedView maskElement={<Text style={[style, { backgroundColor: 'transparent' }]}>{text}</Text>}>
      <LinearGradient colors={['#ffffff', '#a8c0ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

const GlassCTA = ({ onPress, reduceMotion }: { onPress: () => void, reduceMotion: boolean }) => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [reduceMotion]);

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7]
  });

  const glowScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05]
  });

  return (
    <View style={{ width: '100%', marginTop: 30, alignItems: 'center' }}>
      <Animated.View style={{
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: '#4169E1',
        borderRadius: theme.borderRadius.full,
        opacity: glowOpacity,
        transform: [{ scale: glowScale }],
      }} />
      <ScalePressable onPress={onPress} style={{
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: theme.borderRadius.full,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <LinearGradient
           colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.0)']}
           style={StyleSheet.absoluteFill}
        />
        <Text style={{ ...theme.typography.heading, fontSize: 18, color: '#fff', letterSpacing: 0.5 }}>
          Get Started
        </Text>
      </ScalePressable>
    </View>
  );
};

export const OnboardingScreen = () => {
  const { setChildProfile, setOnboarded } = useProgress();
  const [step, setStep] = useState(1);
  const [reduceMotion, setReduceMotion] = useState(false);
  const backgroundDrift = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
      if (!enabled) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(backgroundDrift, {
              toValue: { x: 8, y: -8 },
              duration: 8000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(backgroundDrift, {
              toValue: { x: -8, y: 8 },
              duration: 8000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(backgroundDrift, {
              toValue: { x: 0, y: 0 },
              duration: 8000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    });
  }, []);

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [avatar, setAvatar] = useState<string>('person');

  const avatars = ['person', 'rocket', 'star', 'planet'];

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    }
  };

  const handleFinish = async () => {
    // Save profile and mark onboarded
    const finalName = name.trim() || 'Explorer';
    const finalAge = age || 7;
    await setChildProfile(finalName, finalAge);
    // You could also save avatar to context if needed, but keeping it simple for MVP
    await setOnboarded();
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      {/* Layer 2: Starfield */}
      <Starfield reduceMotion={reduceMotion} />
      
      {/* Layers 1 & 3: Background Drift & Hero Content */}
      <Animated.View style={{ 
        flex: 1, 
        width: '100%',
        alignItems: 'center', 
        justifyContent: 'center',
        transform: [{ translateX: backgroundDrift.x }, { translateY: backgroundDrift.y }] 
      }}>
        <AstronautHero reduceMotion={reduceMotion} />
        
        <View style={{ marginBottom: theme.spacing.md }}>
          <GradientText text="Smart Explorer" style={{ ...theme.typography.heading, fontSize: 36, textAlign: 'center', letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10 }} />
        </View>
        
        <Text style={styles.subtitle}>Helping kids build strong social skills through simple daily practice.</Text>
        
        <GlassCTA onPress={handleNext} reduceMotion={reduceMotion} />
      </Animated.View>
    </View>
  );

  const renderStep2 = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollStepContainer}>
      <Text style={styles.title}>Who is playing?</Text>
      
      <Text style={styles.label}>Child's Name</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g. Alex"
        value={name}
        onChangeText={setName}
        maxLength={15}
        placeholderTextColor={theme.colors.secondaryText}
      />

      <Text style={styles.label}>Age</Text>
      <View style={styles.row}>
        {[5, 6, 7, 8, 9, 10].map(a => (
          <ScalePressable 
            key={a} 
            onPress={() => setAge(a)}
            style={[styles.ageButton, age === a && styles.ageButtonActive]}
          >
            <Text style={[styles.ageText, age === a && styles.ageTextActive]}>{a}</Text>
          </ScalePressable>
        ))}
      </View>

      <Text style={styles.label}>Choose an Avatar</Text>
      <View style={styles.row}>
        {avatars.map(icon => (
          <ScalePressable 
            key={icon}
            onPress={() => setAvatar(icon)}
            style={[styles.avatarButton, avatar === icon && styles.avatarButtonActive]}
          >
            <Ionicons 
              name={icon as any} 
              size={32} 
              color={avatar === icon ? theme.colors.white : theme.colors.primary} 
            />
          </ScalePressable>
        ))}
      </View>

      <View style={styles.spacer} />
      <Button 
        title="Continue" 
        onPress={handleNext} 
        style={styles.button} 
        disabled={name.trim().length === 0 || age === null}
      />
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollStepContainer}>
      <Ionicons name="shield-checkmark-outline" size={60} color={theme.colors.success} style={styles.icon} />
      <Text style={styles.title}>For the Parents</Text>
      
      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="bulb-outline" size={24} color={theme.colors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Quizzes</Text>
            <Text style={styles.infoDesc}>Daily learning tools to spark conversations.</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={24} color={theme.colors.accent} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Coins</Text>
            <Text style={styles.infoDesc}>Children earn coins to redeem real-life rewards you set.</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="settings-outline" size={24} color={theme.colors.secondaryText} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Parent Controls</Text>
            <Text style={styles.infoDesc}>Manage limits and rewards safely in the Settings tab.</Text>
          </View>
        </View>
      </Card>

      <View style={styles.spacer} />
      <Button title="Continue as Parent" onPress={handleNext} style={styles.button} variant="secondary" />
    </ScrollView>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Ionicons name="rocket-outline" size={80} color={theme.colors.primary} style={styles.icon} />
      <Text style={styles.title}>All Set!</Text>
      <Text style={styles.subtitle}>You are ready to start building great social skills.</Text>
      <View style={styles.spacer} />
      <Button title="Start First Quiz" onPress={handleFinish} style={styles.button} />
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <GlobalBackground />
      <ScreenWrapper transparent>
        <View style={styles.container}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </View>
      </ScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.xl,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollStepContainer: {
    flexGrow: 1,
    paddingVertical: theme.spacing.xl,
  },
  icon: {
    marginBottom: theme.spacing.lg,
    alignSelf: 'center',
  },
  title: {
    ...theme.typography.heading,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.body,
    fontSize: 16,
    textAlign: 'center',
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.xl,
  },
  spacer: {
    flex: 1,
    minHeight: theme.spacing.xl,
  },
  button: {
    width: '100%',
  },
  label: {
    ...theme.typography.heading,
    fontSize: 18,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    fontSize: 18, // Placed after spread to override
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // gap is not supported in flexbox/flex-wrap on iOS 12.5.
    // Each button child uses marginRight + marginBottom instead.
  },
  ageButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    // Replaces gap removed from 'row' for iOS 12.5 compatibility
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  ageButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  ageText: {
    ...theme.typography.heading,
    color: theme.colors.text,
  },
  ageTextActive: {
    color: theme.colors.white,
  },
  avatarButton: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    // Replaces gap removed from 'row' for iOS 12.5 compatibility
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  avatarButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  infoCard: {
    marginTop: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  infoTextContainer: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  infoTitle: {
    ...theme.typography.heading,
    fontSize: 18,
  },
  infoDesc: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    marginTop: 4,
  },
});
