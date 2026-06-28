import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { RewardsProvider } from './src/context/RewardsContext';
import { ProgressProvider, useProgress } from './src/context/ProgressContext';
const RootNavigator = () => {
  return <AppNavigator />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <RewardsProvider>
          <NavigationContainer>
            {/* <DesignReviewScreen /> */}
            <RootNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </RewardsProvider>
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
