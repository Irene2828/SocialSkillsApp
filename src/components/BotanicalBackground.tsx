import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export const BotanicalBackground = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">

      <Ionicons 
        name="leaf-outline" 
        size={240} 
        color="#B2CCB4" 
        style={[styles.icon, { top: -60, right: -60, transform: [{ rotate: '45deg' }], opacity: 0.2 }]} 
      />
      <Ionicons 
        name="leaf-outline" 
        size={180} 
        color="#B2CCB4" 
        style={[styles.icon, { bottom: -40, left: -40, transform: [{ rotate: '-135deg' }], opacity: 0.15 }]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
  }
});
