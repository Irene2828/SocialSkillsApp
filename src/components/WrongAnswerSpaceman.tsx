import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';

export const WrongAnswerSpaceman: React.FC = () => {
  const swingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(swingAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(swingAnim, {
          toValue: -1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(swingAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [swingAnim]);

  const spin = swingAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-15deg', '15deg']
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pendulum, { transform: [{ rotate: spin }] }]}>
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
    marginTop: -20, // Start higher up
    overflow: 'visible',
    zIndex: 10,
  },
  pendulum: {
    alignItems: 'center',
    // The default transform origin is the center of the element.
    // By making the thread long or the container tall, the center is higher up.
    // To make it swing from the top, we could offset it, but a simple rotate with a top thread looks fine.
  },
  thread: {
    width: 2,
    height: 40,
    backgroundColor: '#94a3b8', // subtle gray thread
  },
  spaceman: {
    width: 50,
    height: 50,
    marginTop: -5, // overlap slightly with thread
  }
});
