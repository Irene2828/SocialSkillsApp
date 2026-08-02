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

          return (
            <Ionicons name={iconName} size={iconSize} color={color} style={{ marginTop: 2 }} />
          );
        },
        tabBarLabel: ({ focused, color }) => {
          let label = '';
          if (route.name === 'NewQuiz') label = 'Quizes';
          else if (route.name === 'Tasks') label = 'Tasks';
          else if (route.name === 'Puzzles') label = 'Puzzles';
          else if (route.name === 'Drawing') label = 'Draw';
          return (
            <View style={{
              backgroundColor: focused ? 'rgba(255, 255, 255, 0.24)' : 'transparent',
              paddingHorizontal: 14,
              paddingVertical: 4,
              borderRadius: 12,
              marginBottom: 2,
            }}>
              <Text style={{
                fontFamily: focused ? FONTS.semiBold : FONTS.medium,
                // Slightly larger labels on tablet for legibility
                fontSize: isTablet ? 13 : 11,
                color: color,
                textAlign: 'center'
              }}>
                {label}
              </Text>
            </View>
          );
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,

        tabBarStyle: {
          backgroundColor: '#00CED1',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.45)',
          elevation: 0,
          shadowOpacity: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: height,
          paddingBottom: paddingBottom,
          paddingTop: isTablet ? 5 : (isSmallScreen ? 4 : 5),
          width: '100%',
        },
        tabBarItemStyle: {
          flex: 1,
          flexDirection: 'column-reverse',
          alignItems: 'center',
          justifyContent: 'center',
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
