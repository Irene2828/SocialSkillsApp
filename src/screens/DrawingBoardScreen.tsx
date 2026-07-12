import React, { Component, ReactNode } from 'react';
import { Platform, View, ActivityIndicator, Text } from 'react-native';
// @ts-ignore
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { theme } from '../theme';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: theme.colors.background }}>
          <Text style={{ ...theme.typography.heading, fontSize: 20, marginBottom: 12, textAlign: 'center' }}>
            Browser Not Supported
          </Text>
          <Text style={{ ...theme.typography.body, textAlign: 'center', color: theme.colors.secondaryText }}>
            The drawing board requires a newer web browser. Please try on a more recent device or use the native iOS app!
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

let NativeDrawingBoard: any;
if (Platform.OS !== 'web') {
  NativeDrawingBoard = require('./DrawingBoardScreenContent').DrawingBoardScreen;
}

export const DrawingBoardScreen = () => {
  if (Platform.OS === 'web') {
    const isOldIOS = typeof navigator !== 'undefined' && /iP(ad|hone|od).*OS (11|12|13|14)_/.test(navigator.userAgent);
    
    if (isOldIOS) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: theme.colors.background }}>
          <Text style={{ ...theme.typography.heading, fontSize: 20, marginBottom: 12, textAlign: 'center' }}>
            Browser Not Supported
          </Text>
          <Text style={{ ...theme.typography.body, textAlign: 'center', color: theme.colors.secondaryText }}>
            The drawing board requires a newer web browser. Please try on a more recent device or use the native iOS app!
          </Text>
        </View>
      );
    }

    return (
      <ErrorBoundary>
        <WithSkiaWeb
          opts={{ locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/canvaskit-wasm@0.41.0/bin/full/${file}` }}
          getComponent={() => import('./DrawingBoardScreenContent')}
          fallback={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#BEF264" />
            </View>
          }
        />
      </ErrorBoundary>
    );
  }

  return <NativeDrawingBoard />;
};
