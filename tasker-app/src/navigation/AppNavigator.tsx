import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TasksScreen } from '../screens/TasksScreen';
import { MyRewardsScreen } from '../screens/MyRewardsScreen';
import { TaskerStackParamList } from './types';

const Stack = createNativeStackNavigator<TaskerStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Tasks"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Tasks" component={TasksScreen} />
      <Stack.Screen name="MyRewards" component={MyRewardsScreen} />
    </Stack.Navigator>
  );
};
