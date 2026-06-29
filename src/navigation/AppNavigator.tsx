import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewQuizScreen } from '../screens/NewQuizScreen';
import { MyRewardsScreen } from '../screens/MyRewardsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { DesignReviewScreen } from '../screens/DesignReviewScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  const insets = useSafeAreaInsets();
  const paddingBottom = Math.max(insets.bottom, 12);
  const height = 60 + paddingBottom;

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
          } else if (route.name === 'Review') {
            iconName = focused ? 'brush' : 'brush-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: 'rgba(0, 0, 0, 0.5)',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F3F4F6', // Silver grey
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: height,
          paddingBottom: paddingBottom,
          paddingTop: 8,
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
        name="Review" 
        component={DesignReviewScreen} 
        options={{ tabBarLabel: 'Critique' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};
