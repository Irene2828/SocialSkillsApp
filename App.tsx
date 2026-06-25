import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { RewardsProvider } from './src/context/RewardsContext';
import { ProgressProvider, useProgress } from './src/context/ProgressContext';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { DesignReviewScreen } from './src/screens/DesignReviewScreen';

const RootNavigator = () => {
  const { hasOnboarded } = useProgress();

  if (!hasOnboarded) {
    return <OnboardingScreen />;
  }

  return <AppNavigator />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <RewardsProvider>
          <NavigationContainer>
            <DesignReviewScreen />
            <StatusBar style="auto" />
          </NavigationContainer>
        </RewardsProvider>
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
