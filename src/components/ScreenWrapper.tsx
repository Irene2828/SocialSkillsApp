import React from 'react';
import { SafeAreaView, StyleSheet, ViewProps, View } from 'react-native';
import { theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

export const ScreenWrapper: React.FC<ViewProps> = ({ children, style, ...props }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient 
        colors={['#FFFFFF', theme.colors.background]} 
        style={styles.gradient}
      >
        <View style={[styles.container, style]} {...props}>
          {children}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
});
