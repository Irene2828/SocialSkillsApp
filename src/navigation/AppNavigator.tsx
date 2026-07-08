import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewQuizScreen } from '../screens/NewQuizScreen';
import { MyRewardsScreen } from '../screens/MyRewardsScreen';
import { PuzzleScreen } from '../screens/PuzzleScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { useMood, getMoodColors } from '../context/MoodContext';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  const insets = useSafeAreaInsets();
  const paddingBottom = Math.max(insets.bottom * 0.75, 10); // 50% more than the reduced padding
  const height = 54 + paddingBottom;

  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const isRocket = mood === 'rocket';

  const footerBgColor = isRocket ? moodColors.bg : 'rgba(186, 230, 253, 0.4)';
  const activeColor = isRocket ? '#FFFFFF' : theme.colors.text;
  const inactiveColor = isRocket ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.5)';

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
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: footerBgColor,
          borderTopWidth: isRocket ? 0 : 1,
          borderTopColor: isRocket ? 'transparent' : '#BAE6FD',
          borderLeftWidth: isRocket ? 0 : 1,
          borderRightWidth: isRocket ? 0 : 1,
          borderLeftColor: isRocket ? 'transparent' : '#BAE6FD',
          borderRightColor: isRocket ? 'transparent' : '#BAE6FD',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          elevation: 0,
          shadowOpacity: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: height + 8,
          paddingBottom: paddingBottom,
          paddingTop: 12,
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
