import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { NewQuizScreen } from '../screens/NewQuizScreen';
import { MyRewardsScreen } from '../screens/MyRewardsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-circle-outline';

          if (route.name === 'NewQuiz') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          } else if (route.name === 'MyRewards') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#7A437A', // Plum purple to match the screenshot
          borderTopColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
          height: 60, // slightly taller for breathing room
          paddingBottom: 8,
        },
      })}
    >
      <Tab.Screen 
        name="NewQuiz" 
        component={NewQuizScreen} 
        options={{ tabBarLabel: 'New Quiz' }}
      />
      <Tab.Screen 
        name="MyRewards" 
        component={MyRewardsScreen} 
        options={{ tabBarLabel: 'My Rewards' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};
