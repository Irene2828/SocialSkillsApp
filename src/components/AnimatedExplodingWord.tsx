import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, StyleProp, TextStyle, Easing } from 'react-native';

interface AnimatedExplodingWordProps {
  word: string;
  style?: StyleProp<TextStyle>;
}

export const AnimatedExplodingWord: React.FC<AnimatedExplodingWordProps> = ({ word, style }) => {
  const letters = word.split('');
  
  // Create an animated value for each letter
  const animations = useRef(letters.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Reset animations
    animations.forEach(anim => anim.setValue(0));

    const anims = animations.map((anim, index) => {
      return Animated.timing(anim, {
        toValue: 1,
        duration: 800, // slower, more premium duration
        delay: index * 60, // slightly more staggered
        easing: Easing.bezier(0.25, 0.1, 0.25, 1), // smooth Apple-like easing
        useNativeDriver: true,
      });
    });

    Animated.parallel(anims).start();
  }, [word]);

  return (
    <View style={styles.container}>
      {letters.map((letter, index) => {
        const translateY = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [15, 0],
        });

        const opacity = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });
        
        const scale = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        });

        return (
          <Animated.Text
            key={index}
            style={[
              style,
              {
                opacity,
                transform: [
                  { translateY },
                  { scale }
                ],
              },
            ]}
          >
            {letter}
          </Animated.Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
