import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export const RocketBackground = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">

      <Ionicons 
        name="rocket-outline" 
        size={200} 
        color="#CBD5E1" 
        style={[styles.icon, { top: -20, right: -40, transform: [{ rotate: '45deg' }], opacity: 0.25 }]} 
      />
      <Ionicons 
        name="cloud-outline" 
        size={140} 
        color="#CBD5E1" 
        style={[styles.icon, { bottom: 60, left: -30, opacity: 0.2 }]} 
      />
      <Ionicons 
        name="cloud-outline" 
        size={100} 
        color="#CBD5E1" 
        style={[styles.icon, { bottom: -20, left: 80, opacity: 0.15 }]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
  }
});
