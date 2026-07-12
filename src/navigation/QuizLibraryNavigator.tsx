import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QuizMenuScreen } from '../screens/QuizMenuScreen';
import { NewQuizScreen } from '../screens/NewQuizScreen';
import { TasksScreen } from '../screens/TasksScreen';

export type QuizLibraryStackParamList = {
  QuizMenu: undefined;
  QuizLibrary: undefined; // The actual NewQuizScreen
  Tasks: undefined;
};

const Stack = createNativeStackNavigator<QuizLibraryStackParamList>();

export const QuizLibraryNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="QuizMenu" component={QuizMenuScreen} />
      <Stack.Screen name="QuizLibrary" component={NewQuizScreen} />
      <Stack.Screen name="Tasks" component={TasksScreen} />
    </Stack.Navigator>
  );
};
