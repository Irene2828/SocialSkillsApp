import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export const AstronautBackground = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">

      <Ionicons 
        name="planet-outline" 
        size={220} 
        color="#D6C4DC" 
        style={[styles.icon, { top: -50, right: -60, transform: [{ rotate: '15deg' }], opacity: 0.25 }]} 
      />
      <Ionicons 
        name="body-outline" 
        size={180} 
        color="#D6C4DC" 
        style={[styles.icon, { bottom: -20, left: -40, opacity: 0.2 }]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
  }
});
