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
          let label = '';

          if (route.name === 'NewQuiz') {
            iconName = 'document-text-outline';
            label = 'Quizes';
          } else if (route.name === 'Tasks') {
            iconName = 'checkmark-done-circle-outline';
            label = 'Tasks';
          } else if (route.name === 'Puzzles') {
            iconName = 'extension-puzzle-outline';
            label = 'Puzzles';
          } else if (route.name === 'Drawing') {
            iconName = 'color-palette-outline';
            label = 'Draw';
          }

          // Curved text rendering logic
          const chars = label.split('');
          const arcAngle = 100;
          const startAngle = -arcAngle / 2;
          const step = chars.length > 1 ? arcAngle / (chars.length - 1) : 0;

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', overflow: 'visible', paddingTop: 10 }}>
              {/* Curved label over the top of the icon */}
              <View style={{
                position: 'absolute',
                width: 70,
                height: 70,
                alignItems: 'center',
                justifyContent: 'center',
                top: 4,
              }}>
                {chars.map((char, index) => {
                  const angle = startAngle + index * step;
                  return (
                    <Text
                      key={index}
                      style={{
                        position: 'absolute',
                        color: color,
                        fontSize: 9,
                        fontFamily: focused ? FONTS.semiBold : FONTS.medium,
                        fontWeight: focused ? '600' : '500',
                        transform: [
                          { rotate: `${angle}deg` },
                          { translateY: -22 },
                        ],
                      }}
                    >
                      {char}
                    </Text>
                  );
                })}
              </View>

              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                borderWidth: 1.2,
                borderColor: 'rgba(255, 255, 255, 0.4)',
                alignItems: 'center', 
                justifyContent: 'center',
                marginTop: 12
              }}>
                <Ionicons name={iconName} size={iconSize} color={color} />
              </View>
            </View>
          );
        },
        tabBarLabel: () => null,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,

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
