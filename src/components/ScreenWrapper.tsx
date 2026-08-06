import React from 'react';
import { StyleSheet, ViewProps, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

interface ScreenWrapperProps extends ViewProps {
  transparent?: boolean;
  disableSafeAreaTop?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style, transparent, disableSafeAreaTop, ...props }) => {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView 
        style={[styles.safeArea, { backgroundColor: 'transparent' }]}
        edges={disableSafeAreaTop ? ['bottom', 'left', 'right'] : undefined}
      >
        <View style={[styles.container, disableSafeAreaTop && { paddingTop: 0 }, style]} {...props}>
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
});
