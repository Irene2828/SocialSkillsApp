import React, { useEffect, useRef } from 'react';
import { Animated, View, Image, StyleSheet } from 'react-native';

interface SpiderMascotProps {
  visible: boolean;
}

export const SpiderMascot: React.FC<SpiderMascotProps> = ({ visible }) => {
  const slideAnim = useRef(new Animated.Value(-800)).current;
  const swingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Drop down animation
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();

      // Swing animation loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(swingAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(swingAnim, {
            toValue: -1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(swingAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      slideAnim.setValue(-800);
      swingAnim.setValue(0);
    }
  }, [visible, slideAnim, swingAnim]);

  if (!visible) return null;

  const rotate = swingAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <Animated.View style={[
      styles.container, 
      { 
        transform: [
          { translateY: slideAnim },
          { rotate: rotate }
        ] 
      }
    ]}>
      <View style={styles.web} />
      <Image 
        source={require('../../assets/mascot_v2_transparent.png')} 
        style={styles.mascot} 
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -20,
    left: -70, // To the left of the text
    alignItems: 'center',
    zIndex: 999,
  },
  web: {
    position: 'absolute',
    bottom: 50,
    width: 1.5,
    height: 1000,
    backgroundColor: 'rgba(30, 58, 138, 0.4)',
    zIndex: 1,
  },
  mascot: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    zIndex: 2,
  }
});
