import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewQuizScreen } from '../screens/NewQuizScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { MyRewardsScreen } from '../screens/MyRewardsScreen';
import { PuzzleScreen } from '../screens/PuzzleScreen';
import { DrawingBoardScreen } from '../screens/DrawingBoardScreen';
import { AppTabBar } from '../components/AppTabBar';
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
  const paddingBottom = (Math.max(insets.bottom, isTablet ? 20 : (isSmallScreen ? 8 : 10)) / 2) * 0.5;
  const height = isTablet
    ? 64 + paddingBottom
    : isSmallScreen
    ? 60 + paddingBottom
    : 68 + Math.round(paddingBottom * 1.2);

  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const isRocket = mood === 'rocket';

  const activeColor = '#FFFFFF';
  const inactiveColor = '#FFFFFF';

  return (
    <Tab.Navigator
      tabBar={(props) => <AppTabBar activeRoute={props.state.routes[props.state.index].name} isFabActive={true} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen 
        name="NewQuiz" 
        component={NewQuizScreen} 
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
      />
      <Tab.Screen 
        name="Puzzles" 
        component={PuzzleScreen} 
      />
      <Tab.Screen 
        name="Drawing" 
        component={DrawingBoardScreen} 
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
