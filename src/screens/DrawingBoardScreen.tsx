import React from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
// @ts-ignore
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

let NativeDrawingBoard: any;
if (Platform.OS !== 'web') {
  NativeDrawingBoard = require('./DrawingBoardScreenContent').DrawingBoardScreen;
}

export const DrawingBoardScreen = () => {
  if (Platform.OS === 'web') {
    return (
      <WithSkiaWeb
        getComponent={() => import('./DrawingBoardScreenContent')}
        fallback={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#BEF264" />
          </View>
        }
      />
    );
  }

  return <NativeDrawingBoard />;
};
