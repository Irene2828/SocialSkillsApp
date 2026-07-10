import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';

export const CorrectAnswerSpaceman: React.FC = () => {
  const jumpAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(jumpAnim, {
          toValue: -20, // Jump up 20 pixels
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(jumpAnim, {
          toValue: 0, // Fall back down
          duration: 300,
          useNativeDriver: true,
        }),
        // Add a small pause at the bottom before jumping again
        Animated.timing(jumpAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        })
      ]),
      { iterations: 4 }
    ).start();
  }, [jumpAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.spacemanContainer, { transform: [{ translateY: jumpAnim }] }]}>
        <View style={styles.thread} />
        <Image 
          source={require('../../assets/mascot_v2_transparent.png')} 
          style={styles.spaceman}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: -10, // Pull the text closer to the spaceman
    marginTop: -40, // Start higher up to account for thread
    overflow: 'visible',
    zIndex: 10,
  },
  spacemanContainer: {
    alignItems: 'center',
  },
  thread: {
    width: 2,
    height: 80, // Taller thread
    backgroundColor: '#94a3b8', // subtle gray thread
  },
  spaceman: {
    width: 60, // Make it slightly larger since he's happy!
    height: 60,
    marginTop: -5,
  }
});
