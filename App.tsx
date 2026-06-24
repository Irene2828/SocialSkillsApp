import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { RewardsProvider } from './src/context/RewardsContext';
import { ProgressProvider } from './src/context/ProgressContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <RewardsProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </RewardsProvider>
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
