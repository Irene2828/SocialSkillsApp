import React from 'react';
import { Image, View, StyleSheet, useWindowDimensions } from 'react-native';
import { useMood, getMoodColors } from '../context/MoodContext';
import { AnimatedCloudsBackground } from './AnimatedCloudsBackground';
import { BlurView } from 'expo-blur';

interface GlobalBackgroundProps {
  showClouds?: boolean;
  dimmed?: boolean;
}

export const GlobalBackground: React.FC<GlobalBackgroundProps> = ({ showClouds = true, dimmed = true }) => {
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
    <View style={[styles.container, { backgroundColor: isDark ? '#0b0f19' : '#e0f2fe' }]} pointerEvents="none">
      <Image
        source={getBgSource()}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      {dimmed && (
        <>
          <BlurView 
            intensity={20} 
            tint={isDark ? "dark" : "light"}
            style={StyleSheet.absoluteFill} 
          />
          <View 
            style={[
              StyleSheet.absoluteFill, 
              { backgroundColor: isDark ? 'rgba(11, 15, 25, 0.40)' : 'rgba(224, 242, 254, 0.40)' }
            ]} 
          />
        </>
      )}
      {showClouds && <AnimatedCloudsBackground />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
});

