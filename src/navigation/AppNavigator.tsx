import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewQuizScreen } from '../screens/NewQuizScreen';
import { MyRewardsScreen } from '../screens/MyRewardsScreen';
import { PuzzleScreen } from '../screens/PuzzleScreen';
import { DrawingBoardScreen } from '../screens/DrawingBoardScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CreateQuizFromPhotoScreen } from '../screens/CreateQuizFromPhotoScreen';
import { useMood, getMoodColors } from '../context/MoodContext';
import { theme, FONTS } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AppTabs = () => {
  const insets = useSafeAreaInsets();
  const paddingBottom = Math.max(insets.bottom * 0.75, 10);
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

          if (route.name === 'NewQuiz') {
            iconName = 'home-outline';
          } else if (route.name === 'MyRewards') {
            return <FontAwesome5 name="coins" size={size - 2} color={color} />;
          } else if (route.name === 'Puzzles') {
            iconName = 'extension-puzzle-outline';
          } else if (route.name === 'Drawing') {
            iconName = 'color-palette-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({ focused, color }) => {
          let label = '';
          if (route.name === 'NewQuiz') label = 'Home';
          else if (route.name === 'Puzzles') label = 'Puzzles';
          else if (route.name === 'Drawing') label = 'Draw';
          else if (route.name === 'MyRewards') label = 'Rewards';
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
        name="NewQuiz" 
        component={NewQuizScreen} 
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Puzzles" 
        component={PuzzleScreen} 
        options={{ tabBarLabel: 'Puzzles' }}
      />
      <Tab.Screen 
        name="Drawing" 
        component={DrawingBoardScreen} 
        options={{ tabBarLabel: 'Draw' }}
      />
      <Tab.Screen 
        name="MyRewards" 
        component={MyRewardsScreen} 
        options={{ tabBarLabel: 'Rewards' }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AppTabs" component={AppTabs} />
      <Stack.Screen name="CreateQuizFromPhoto" component={CreateQuizFromPhotoScreen} />
    </Stack.Navigator>
  );
};
