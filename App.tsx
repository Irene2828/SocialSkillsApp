import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import 'intersection-observer';
import ResizeObserver from 'resize-observer-polyfill';
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = ResizeObserver;
}
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { RootAppBackground } from './src/components/RootAppBackground';
import { RewardsProvider } from './src/context/RewardsContext';
import { ProgressProvider } from './src/context/ProgressContext';
import { QuizProvider } from './src/context/QuizContext';
import { TasksProvider } from './src/context/TasksContext';
import { FeedbackProvider } from './src/context/FeedbackContext';
import { MoodProvider } from './src/context/MoodContext';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';
import {
  Nunito_400Regular,
  Nunito_400Regular_Italic,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { View, ActivityIndicator } from 'react-native';

const RootNavigator = () => {
  return <AppNavigator />;
};

const TransparentTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

import { Asset } from 'expo-asset';

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Nunito_400Regular,
    Nunito_400Regular_Italic,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  const [assetsLoaded, setAssetsLoaded] = React.useState(false);

  React.useEffect(() => {
    async function loadAssets() {
      try {
        await Asset.loadAsync([
          require('./assets/home_bg_dark_mobile.png'),
          require('./assets/home_bg_dark_tablet.png'),
          require('./assets/home_bg_light_mobile.png'),
          require('./assets/home_bg_light_tablet.png'),
        ]);
      } catch (e) {
        console.warn('Failed to load assets', e);
      } finally {
        setAssetsLoaded(true);
      }
    }
    loadAssets();
  }, []);

  if (!fontsLoaded || !assetsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F1F3' }}>
        <ActivityIndicator size="large" color="#BEF264" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <FeedbackProvider>
        <MoodProvider>
          <ProgressProvider>
            <RewardsProvider>
              <TasksProvider>
                <QuizProvider>
                  <RootAppBackground />
                  <NavigationContainer theme={TransparentTheme}>
                    <RootNavigator />
                    <StatusBar style="auto" />
                  </NavigationContainer>
                </QuizProvider>
              </TasksProvider>
            </RewardsProvider>
          </ProgressProvider>
        </MoodProvider>
      </FeedbackProvider>
    </SafeAreaProvider>
  );
}
