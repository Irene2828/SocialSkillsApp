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

    // Create staggering falling/exploding animations
    const anims = animations.map((anim, index) => {
      return Animated.timing(anim, {
        toValue: 1,
        duration: 400, // fast landing
        delay: index * 50, // one by one fast
        easing: Easing.out(Easing.back(1.5)), // gives a slight bounce when landing
        useNativeDriver: true,
      });
    });

    // Start staggered animation
    Animated.stagger(40, anims).start();
  }, [word]);

  return (
    <View style={styles.container}>
      {letters.map((letter, index) => {
        // Random starting positions from top left
        // To make it look like "particles in space", give them large negative X and Y offsets
        // and large rotations
        
        // We use pseudo-random but deterministic based on index so it looks same every time
        const randomX = -150 - (index * 30); 
        const randomY = -200 - (index * 40);
        const randomRot = (index % 2 === 0 ? 1 : -1) * (180 + index * 45);

        const translateX = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [randomX, 0],
        });

        const translateY = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [randomY, 0],
        });

        const rotate = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [`${randomRot}deg`, '0deg'],
        });

        const opacity = animations[index].interpolate({
          inputRange: [0, 0.2, 1],
          outputRange: [0, 1, 1],
        });
        
        const scale = animations[index].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.1, 1.2, 1],
        });

        return (
          <Animated.Text
            key={index}
            style={[
              style,
              {
                opacity,
                transform: [
                  { translateX },
                  { translateY },
                  { rotate },
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
