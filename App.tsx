import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { RewardsProvider } from './src/context/RewardsContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <RewardsProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </RewardsProvider>
    </SafeAreaProvider>
  );
}
