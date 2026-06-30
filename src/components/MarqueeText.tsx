import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, TextStyle, View } from 'react-native';

interface MarqueeTextProps {
  text: string;
  style?: TextStyle | TextStyle[];
  duration?: number;
}

export const MarqueeText: React.FC<MarqueeTextProps> = ({ text, style, duration = 5000 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (textWidth > containerWidth && containerWidth > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: -textWidth,
            duration: (textWidth / 15) * 1000, // slow speed based on width
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: containerWidth,
            duration: 0,
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      animatedValue.setValue(0);
    }
  }, [textWidth, containerWidth, text]);

  const shouldAnimate = textWidth > containerWidth && containerWidth > 0;

  return (
    <View 
      style={styles.container} 
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEnabled={false}>
        <Animated.View style={{ flexDirection: 'row', transform: [{ translateX: animatedValue }] }}>
          <Text 
            style={[style, { paddingRight: shouldAnimate ? 40 : 0 }]} 
            onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
            numberOfLines={1}
          >
            {text}
          </Text>
          {shouldAnimate && (
            <Text style={[style, { paddingRight: 40 }]} numberOfLines={1}>
              {text}
            </Text>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
