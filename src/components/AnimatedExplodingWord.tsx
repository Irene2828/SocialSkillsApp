import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, StyleProp, TextStyle, Easing, useWindowDimensions } from 'react-native';

interface AnimatedExplodingWordProps {
  word: string;
  style?: StyleProp<TextStyle>;
}

export const AnimatedExplodingWord: React.FC<AnimatedExplodingWordProps> = ({ word, style }) => {
  const letters = word.split('');
  const { width } = useWindowDimensions();

  // Each letter gets its own animated value
  const animations = useRef(letters.map(() => new Animated.Value(0))).current;
  // Track each letter's measured x position so we can compute offset from top-left
  const positions = useRef<number[]>(letters.map(() => 0));
  const containerRef = useRef<View>(null);

  useEffect(() => {
    animations.forEach(anim => anim.setValue(0));

    // Stagger each letter so they land one by one
    const anims = animations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 700,
        delay: index * 90,
        easing: Easing.bezier(0.16, 1, 0.3, 1), // smooth spring-like ease out
        useNativeDriver: true,
      })
    );

    Animated.parallel(anims).start();
  }, [word]);

  return (
    <View ref={containerRef} style={styles.container}>
      {letters.map((letter, index) => {
        // Each letter starts at the top-left of the screen relative to its final position.
        // We use a large negative offset pointing toward top-left.
        // The further right the letter is in the word, the further left it needs to travel.
        // We approximate: letter at index `i` sits roughly i * ~28px from the start of the word.
        // Starting position is top-left of screen, so translateX ≈ -(letterX from left edge of word + word's x from screen left)
        // Since we don't know exact position at render time, we use a proportional estimate.
        const estimatedLetterOffsetX = index * 26; // rough px offset within the word
        // We want all letters to come from roughly (0,0) of the screen viewport.
        // The word is centered, so it starts ~width/2 - wordWidth/2 from the left.
        // wordWidth ≈ letters.length * 26
        const wordStart = width / 2 - (letters.length * 26) / 2;
        const absoluteLetterX = wordStart + estimatedLetterOffsetX;
        const startTranslateX = -absoluteLetterX; // how far left to go to reach x=0
        const startTranslateY = -300; // start well above the screen

        const translateX = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [startTranslateX, 0],
        });

        const translateY = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [startTranslateY, 0],
        });

        const opacity = animations[index].interpolate({
          inputRange: [0, 0.15, 1],
          outputRange: [0, 1, 1],
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
