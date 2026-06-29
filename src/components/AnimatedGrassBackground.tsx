import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const BLADE_COUNT = 45;
const GRASS_COLORS = ['#A3E635', '#BEF264', '#84CC16', '#D9F99D']; // Various shades of lime green

export const AnimatedGrassBackground: React.FC = () => {
  // Breathing sky animation
  const skyAnim = useRef(new Animated.Value(0)).current;

  // Grass blades state
  const [blades] = useState(() => {
    return Array.from({ length: BLADE_COUNT }).map((_, i) => ({
      id: i,
      x: Math.random() * width,
      width: Math.random() * 8 + 4, // 4 to 12
      height: Math.random() * 80 + 60, // 60 to 140
      color: GRASS_COLORS[Math.floor(Math.random() * GRASS_COLORS.length)],
      delay: Math.random() * 2000,
      duration: Math.random() * 2000 + 3000, // 3s to 5s
      swayRange: Math.random() * 15 + 5, // 5 to 20 degrees
      animValue: new Animated.Value(0),
    }));
  });

  useEffect(() => {
    // Start sky breathing
    Animated.loop(
      Animated.sequence([
        Animated.timing(skyAnim, { toValue: 1, duration: 6000, useNativeDriver: false }),
        Animated.timing(skyAnim, { toValue: 0, duration: 6000, useNativeDriver: false })
      ])
    ).start();

    // Start grass swaying
    const animations = blades.map(b =>
      Animated.sequence([
        Animated.delay(b.delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(b.animValue, { toValue: 1, duration: b.duration, useNativeDriver: true }),
            Animated.timing(b.animValue, { toValue: -1, duration: b.duration * 1.2, useNativeDriver: true }),
            Animated.timing(b.animValue, { toValue: 0, duration: b.duration * 0.8, useNativeDriver: true }),
          ])
        )
      ])
    );
    Animated.parallel(animations).start();
  }, [blades, skyAnim]);

  const skyColor1 = skyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F7F7F9', '#ECFCCB'] // Very light grey to very soft lime
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Animated Sky Background */}
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: skyColor1 }]} />
      
      {/* Soft gradient overlay for the sky */}
      <LinearGradient
        colors={['rgba(255,255,255,0.8)', 'rgba(236,252,203,0.1)']}
        style={StyleSheet.absoluteFill}
      />

      {/* Ground/hill */}
      <View style={styles.ground} />

      {/* Grass blades */}
      <View style={styles.grassContainer}>
        {blades.map(b => {
          const rotate = b.animValue.interpolate({
            inputRange: [-1, 1],
            outputRange: [`-${b.swayRange}deg`, `${b.swayRange}deg`]
          });

          return (
            <Animated.View
              key={b.id}
              style={[
                styles.bladeWrapper,
                {
                  left: b.x,
                  height: b.height * 2, // Double height for bottom rotation anchor
                  width: b.width,
                  bottom: -b.height, // Shift down so the center (anchor) is at the ground
                  transform: [{ rotate }]
                }
              ]}
            >
              <View 
                style={[
                  styles.blade, 
                  { 
                    height: b.height, 
                    backgroundColor: b.color,
                    borderTopLeftRadius: b.width / 2,
                    borderTopRightRadius: b.width / 2,
                  }
                ]} 
              />
              {/* Bottom half is empty to act as the rotation anchor */}
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1, // Keep behind all UI content
    overflow: 'hidden',
  },
  ground: {
    position: 'absolute',
    bottom: -50,
    left: -50,
    right: -50,
    height: 120,
    backgroundColor: '#BEF264', // Soft lime ground
    borderTopLeftRadius: 300,
    borderTopRightRadius: 300,
    opacity: 0.3,
  },
  grassContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  bladeWrapper: {
    position: 'absolute',
    justifyContent: 'flex-start', // Grass blade is at the top of the wrapper
  },
  blade: {
    width: '100%',
  }
});
