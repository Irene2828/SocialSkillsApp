import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export const CelestialBackground = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">

      <Ionicons 
        name="moon-outline" 
        size={200} 
        color="#CDBEE6" 
        style={[styles.icon, { top: -30, right: -40, transform: [{ rotate: '-20deg' }], opacity: 0.25 }]} 
      />
      <Ionicons 
        name="star-outline" 
        size={60} 
        color="#CDBEE6" 
        style={[styles.icon, { top: 180, right: 60, opacity: 0.2 }]} 
      />
      <Ionicons 
        name="sparkles-outline" 
        size={140} 
        color="#CDBEE6" 
        style={[styles.icon, { bottom: -20, left: -20, opacity: 0.15 }]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
  }
});
