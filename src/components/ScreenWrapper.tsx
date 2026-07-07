import React from 'react';
import { SafeAreaView, StyleSheet, ViewProps, View, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

interface ScreenWrapperProps extends ViewProps {
  transparent?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style, transparent, ...props }) => {
  return (
    <LinearGradient
      colors={transparent ? ['transparent', 'transparent', 'transparent'] : ['#FFFFFF', '#E0F2FE', '#FFFFFF']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
        <View style={[styles.container, style]} {...props}>
          {children}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xs,
    paddingBottom: 0,
  },
});
