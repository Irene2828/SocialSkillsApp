import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewQuizScreen } from '../screens/NewQuizScreen';
import { MyRewardsScreen } from '../screens/MyRewardsScreen';
import { PuzzleScreen } from '../screens/PuzzleScreen';
import { HomeScreen } from '../screens/HomeScreen';
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

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'NewQuiz') {
            iconName = 'bulb-outline';
          } else if (route.name === 'MyRewards') {
            return <FontAwesome5 name="coins" size={size - 2} color={color} />;
          } else if (route.name === 'Puzzles') {
            iconName = 'extension-puzzle-outline';
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
          width: '100%',
        },
        tabBarItemStyle: {
          flex: 1,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="NewQuiz" 
        component={NewQuizScreen} 
        options={{ tabBarLabel: 'Quiz Library' }}
      />
      <Tab.Screen 
        name="Puzzles" 
        component={PuzzleScreen} 
        options={{ tabBarLabel: 'Puzzles' }}
      />
      <Tab.Screen 
        name="MyRewards" 
        component={MyRewardsScreen} 
        options={{ tabBarLabel: 'My Rewards' }}
      />
    </Tab.Navigator>
  );
};
