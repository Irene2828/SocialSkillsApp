import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { useMood } from '../context/MoodContext';
import { BotanicalBackground } from './BotanicalBackground';
import { CelestialBackground } from './CelestialBackground';
import { AstronautBackground } from './AstronautBackground';
import { RocketBackground } from './RocketBackground';
import { AnimatedCubesBackground } from './AnimatedCubesBackground';
import { LinearGradient } from 'expo-linear-gradient';

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

  return (
    <View style={styles.container} pointerEvents="none">
      <LinearGradient
        colors={['#14D2A4', '#00CED1', '#0EA5E9']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />
      <Image
        source={require('../../assets/space_bg.png')}
        style={styles.pattern}
      />
      {renderMood()}
      {showCubes && <AnimatedCubesBackground />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    minHeight: '100%',
    backgroundColor: '#00CED1',
  },
  pattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.12,
    resizeMode: 'cover',
  },
});
