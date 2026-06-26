import React from 'react';
import { SafeAreaView, StyleSheet, ViewProps, View, ImageBackground } from 'react-native';
import { theme } from '../theme';

export const ScreenWrapper: React.FC<ViewProps> = ({ children, style, ...props }) => {
  return (
    <ImageBackground 
      source={require('../../assets/scandi_bg_pattern.png')} 
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, style]} {...props}>
          {children}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
});
