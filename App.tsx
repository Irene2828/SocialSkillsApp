import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import ResizeObserver from 'resize-observer-polyfill';
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = ResizeObserver;
}
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { RewardsProvider } from './src/context/RewardsContext';
import { ProgressProvider } from './src/context/ProgressContext';
import { QuizProvider } from './src/context/QuizContext';
import { TasksProvider } from './src/context/TasksContext';
import { FeedbackProvider } from './src/context/FeedbackContext';
import { MoodProvider } from './src/context/MoodContext';
import {
  useFonts,
  InstrumentSans_400Regular,
  InstrumentSans_400Regular_Italic,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSans_700Bold,
} from '@expo-google-fonts/instrument-sans';
import { View, ActivityIndicator } from 'react-native';

const RootNavigator = () => {
  return <AppNavigator />;
};

export default function App() {
  const [fontsLoaded] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_400Regular_Italic,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,
  });

  if (!fontsLoaded) {
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
                  <NavigationContainer>
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
