import React from 'react';
import { Platform } from 'react-native';

let NativeDrawingBoard: any;
let WebDrawingBoard: any;

if (Platform.OS === 'web') {
  WebDrawingBoard = require('./DrawingBoardScreenWeb').DrawingBoardScreenWeb;
} else {
  NativeDrawingBoard = require('./DrawingBoardScreenContent').DrawingBoardScreen;
}

export const DrawingBoardScreen = () => {
  if (Platform.OS === 'web') {
    return <WebDrawingBoard />;
  }

  return <NativeDrawingBoard />;
};
