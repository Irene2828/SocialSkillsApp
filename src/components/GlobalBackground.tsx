import React from 'react';
import { Image, View, StyleSheet, useWindowDimensions } from 'react-native';
import { useMood, getMoodColors } from '../context/MoodContext';
import { AnimatedCloudsBackground } from './AnimatedCloudsBackground';

interface GlobalBackgroundProps {
  showClouds?: boolean;
}

export const GlobalBackground: React.FC<GlobalBackgroundProps> = ({ showClouds = false }) => {
  const { mood } = useMood();
  const { width } = useWindowDimensions();
  
  const moodColors = getMoodColors(mood);
  const isDark = moodColors.isDark;
  const isTablet = width > 768;

  const getBgSource = () => {
    if (isDark) {
      return isTablet 
        ? require('../../assets/home_bg_dark_tablet.png') 
        : require('../../assets/home_bg_dark_mobile.png');
    } else {
      return isTablet 
        ? require('../../assets/home_bg_light_tablet.png') 
        : require('../../assets/home_bg_light_mobile.png');
    }
  };

  return (
    <View style={styles.container} pointerEvents="none">
      <Image
        source={getBgSource()}
        style={styles.pattern}
      />
      <AnimatedCloudsBackground />
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
    opacity: 1,
    resizeMode: 'cover',
  },
});
