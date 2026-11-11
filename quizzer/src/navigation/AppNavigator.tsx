import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NewQuizScreen } from '../screens/NewQuizScreen';
import { CreateQuizFromPhotoScreen } from '../screens/CreateQuizFromPhotoScreen';
import { MyRewardsScreen } from '../screens/MyRewardsScreen';
import { QuizMenuScreen } from '../screens/QuizMenuScreen';
import { QuizzerStackParamList } from './types';

const Stack = createNativeStackNavigator<QuizzerStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="QuizLibrary"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="QuizLibrary" component={NewQuizScreen} />
      <Stack.Screen name="QuizMenu" component={QuizMenuScreen} />
      <Stack.Screen name="CreateQuizFromPhoto" component={CreateQuizFromPhotoScreen} />
      <Stack.Screen name="MyRewards" component={MyRewardsScreen} />
    </Stack.Navigator>
  );
};
