import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewQuizScreen } from '../screens/NewQuizScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { MyRewardsScreen } from '../screens/MyRewardsScreen';
import { PuzzleScreen } from '../screens/PuzzleScreen';
import { DrawingBoardScreen } from '../screens/DrawingBoardScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CreateQuizFromPhotoScreen } from '../screens/CreateQuizFromPhotoScreen';
import { useMood, getMoodColors } from '../context/MoodContext';
import { theme, FONTS } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AppTabs = () => {
  const insets = useSafeAreaInsets();
  // useWindowDimensions() is reactive — updates on iPad orientation changes
  // (Dimensions.get('window') is a static snapshot taken at module load time)
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isTablet = windowWidth >= 768;
  const isSmallScreen = !isTablet && windowHeight < 700;
  // Tablet: taller bar for comfortable touch targets; small phone: compact bar
  const paddingBottom = Math.max(insets.bottom, isTablet ? 20 : (isSmallScreen ? 8 : 10));
  const height = isTablet
    ? 64 + paddingBottom
    : isSmallScreen
    ? 60 + paddingBottom
    : 68 + Math.round(paddingBottom * 1.2);

  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const isRocket = mood === 'rocket';

  const activeColor = '#FFFFFF';
  const inactiveColor = 'rgba(255, 255, 255, 0.42)';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // Use larger icons on tablet for better legibility and touch targets
          const iconSize = isTablet ? size + 4 : size;
          let iconName: keyof typeof Ionicons.glyphMap = 'help-circle-outline';

          if (route.name === 'NewQuiz') {
            iconName = 'document-text-outline';
          } else if (route.name === 'Tasks') {
            iconName = 'checkmark-done-circle-outline';
          } else if (route.name === 'Puzzles') {
            iconName = 'extension-puzzle-outline';
          } else if (route.name === 'Drawing') {
            iconName = 'color-palette-outline';
          }

          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarLabel: ({ focused, color }) => {
          let label = '';
          if (route.name === 'NewQuiz') label = 'Quizes';
          else if (route.name === 'Tasks') label = 'Tasks';
          else if (route.name === 'Puzzles') label = 'Puzzles';
          else if (route.name === 'Drawing') label = 'Draw';
          return (
            <Text style={{
              fontFamily: focused ? FONTS.semiBold : FONTS.medium,
              // Slightly larger labels on tablet for legibility
              fontSize: isTablet ? 14 : 12,
              lineHeight: isTablet ? 18 : 15,
              color: color,
              marginTop: isTablet ? 5 : 2,
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
          <View style={{ flex: 1, backgroundColor: '#08182B' }} />
        ),
        tabBarStyle: {
          backgroundColor: '#08182B',
          borderTopWidth: 0,
          borderTopColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: height,
          paddingBottom: paddingBottom,
          paddingTop: isTablet ? 10 : (isSmallScreen ? 8 : 10),
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
        options={{ tabBarLabel: 'Quizes' }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksScreen} 
        options={{ tabBarLabel: 'Tasks' }}
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
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AppTabs" component={AppTabs} />
      <Stack.Screen name="CreateQuizFromPhoto" component={CreateQuizFromPhotoScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="MyRewards" component={MyRewardsScreen} />
    </Stack.Navigator>
  );
};
