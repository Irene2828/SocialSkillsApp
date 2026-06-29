import React from 'react';
import { SafeAreaView, StyleSheet, ViewProps, View, ImageBackground } from 'react-native';
import { theme } from '../theme';

interface ScreenWrapperProps extends ViewProps {
  transparent?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style, transparent, ...props }) => {
  return (
    <SafeAreaView style={[styles.safeArea, transparent && { backgroundColor: 'transparent' }]}>
      <View style={[styles.container, style]} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
});
