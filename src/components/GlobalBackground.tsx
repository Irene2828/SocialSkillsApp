import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useMood, getMoodColors } from '../context/MoodContext';
import { BotanicalBackground } from './BotanicalBackground';
import { CelestialBackground } from './CelestialBackground';
import { AstronautBackground } from './AstronautBackground';
import { RocketBackground } from './RocketBackground';
import { AnimatedCubesBackground } from './AnimatedCubesBackground';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

interface GlobalBackgroundProps {
  showCubes?: boolean;
}

export const GlobalBackground: React.FC<GlobalBackgroundProps> = ({ showCubes = false }) => {
  const { mood } = useMood();

  const renderMood = () => {
    switch (mood) {
      case 'celestial':
        return <CelestialBackground />;
      case 'astronaut':
        return <AstronautBackground />;
      case 'rocket':
        return <RocketBackground />;
      case 'none':
        return null;
      case 'botanical':
      default:
        return <BotanicalBackground />;
    }
  };

  const moodColors = getMoodColors(mood);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {!moodColors.isDark && (
        <LinearGradient
          colors={['#FFFFFF', '#F0F9FF', '#FFFFFF']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      {renderMood()}
      {showCubes && <AnimatedCubesBackground />}
    </View>
  );
};
