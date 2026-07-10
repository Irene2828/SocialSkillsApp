import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PuzzleScreen } from '../screens/PuzzleScreen';
import { PuzzleMenuScreen } from '../screens/PuzzleMenuScreen';
import { DrawingBoardScreen } from '../screens/DrawingBoardScreen';

export type PuzzleStackParamList = {
  PuzzleMenu: undefined;
  PuzzleGame: undefined;
  DrawingBoard: undefined;
};

const Stack = createNativeStackNavigator<PuzzleStackParamList>();

export const PuzzleNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="PuzzleMenu" component={PuzzleMenuScreen} />
      <Stack.Screen name="PuzzleGame" component={PuzzleScreen} />
      <Stack.Screen name="DrawingBoard" component={DrawingBoardScreen} />
    </Stack.Navigator>
  );
};
