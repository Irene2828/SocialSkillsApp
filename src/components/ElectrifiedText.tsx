import React, { useRef, useEffect } from 'react';
import { View, Animated, Easing } from 'react-native';

interface ElectrifiedTextProps {
  text: string;
  style: any;
  startIndex?: number;
  totalLetters?: number;
  animated?: boolean;
}

export const ElectrifiedText = ({ text, style, startIndex = 0, totalLetters = 13, animated = true }: ElectrifiedTextProps) => {
  const anim = useRef(new Animated.Value(animated ? 0 : 2)).current;

  useEffect(() => {
    if (!animated) return;
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
  }, [anim, animated]);

  const gradientColors = [
    '#38BDF8', '#0EA5E9', '#0284C7', '#0369A1', '#075985',
    '#0C4A6E', '#1E3A8A', '#1E40AF', '#1D4ED8', '#2563EB',
    '#3B82F6', '#60A5FA', '#93C5FD'
  ];

  return (
    <View style={{ flexDirection: 'row' }}>
      {text.split('').map((char, index) => {
        const center = (startIndex + index) / totalLetters;
        const spread = 0.15; // 15% of the text glows at once
        const staticGradientColor = gradientColors[startIndex + index] || '#1E3A8A';

        const color = anim.interpolate({
          inputRange: [
            -1, // Dummy to ensure strictly increasing
            center - spread, center, center + spread,
            1.5, 2
          ],
          outputRange: [
            style.color || '#1E3A8A', 
            style.color || '#1E3A8A', '#38BDF8', style.color || '#1E3A8A',
            style.color || '#1E3A8A', staticGradientColor
          ],
          extrapolate: 'clamp',
        });
        
        const shadowColor = anim.interpolate({
          inputRange: [
            -1,
            center - spread, center, center + spread,
            1.5, 2
          ],
          outputRange: [
            'rgba(56, 189, 248, 0)',
            'rgba(56, 189, 248, 0)', 'rgba(56, 189, 248, 0.8)', 'rgba(56, 189, 248, 0)',
            'rgba(56, 189, 248, 0)', 'rgba(56, 189, 248, 0)', // No shadow in static mode
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
                textShadowColor: shadowColor,
                textShadowRadius: 8,
                textShadowOffset: { width: 0, height: 0 },
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
