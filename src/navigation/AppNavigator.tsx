import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewQuizScreen } from '../screens/NewQuizScreen';
import { MyRewardsScreen } from '../screens/MyRewardsScreen';
import { PuzzleNavigator } from './PuzzleNavigator';
import { HomeScreen } from '../screens/HomeScreen';
import { useMood, getMoodColors } from '../context/MoodContext';
import { theme, FONTS } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  const insets = useSafeAreaInsets();
  const paddingBottom = Math.max(insets.bottom * 0.75, 10); // 50% more than the reduced padding
  const height = 62 + paddingBottom * 1.2;

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
        tabBarLabel: ({ focused, color }) => {
          let label = '';
          if (route.name === 'Home') label = 'Home';
          else if (route.name === 'NewQuiz') label = 'Quiz Library';
          else if (route.name === 'Puzzles') label = 'Activities';
          else if (route.name === 'MyRewards') label = 'My Rewards';
          return (
            <Text style={{
              fontFamily: focused ? FONTS.semiBold : FONTS.medium,
              fontSize: 10,
              color: color,
              marginTop: 4,
              textAlign: 'center'
            }}>
              {label}
            </Text>
          );
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarBackground: () => (
          <LinearGradient
            colors={isRocket ? [moodColors.bg, moodColors.bg] : ['#FFFFFF', '#F0F9FF']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        ),
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: height,
          paddingBottom: paddingBottom * 1.2,
          paddingTop: 10,
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
        component={PuzzleNavigator} 
        options={{ tabBarLabel: 'Activities' }}
      />
      <Tab.Screen 
        name="MyRewards" 
        component={MyRewardsScreen} 
        options={{ tabBarLabel: 'My Rewards' }}
      />
    </Tab.Navigator>
  );
};
