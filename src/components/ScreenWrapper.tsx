import React from 'react';
import { SafeAreaView, StyleSheet, ViewProps, View, ImageBackground } from 'react-native';
import { theme } from '../theme';

export const ScreenWrapper: React.FC<ViewProps> = ({ children, style, ...props }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
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
