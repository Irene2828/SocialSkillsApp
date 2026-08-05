import React from 'react';
import { View, Pressable, Text, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingActionButton } from './FloatingActionButton';
import { theme, FONTS } from '../theme';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface AppTabBarProps {
  activeRoute?: 'NewQuiz' | 'Tasks' | 'Puzzles' | 'Drawing' | 'None' | string;
  onFabPress?: () => void;
  isFabActive?: boolean;
}

export const AppTabBar = ({ activeRoute = 'None', onFabPress, isFabActive = true }: AppTabBarProps) => {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const isTablet = SCREEN_WIDTH >= 768;
  const navigation = useNavigation<NavigationProp<any>>();

  // Apply same padding logic as everywhere
  const isIPhoneWithNotch = Platform.OS === 'ios' && insets.bottom > 20;
  const footerPaddingBottom = isIPhoneWithNotch ? insets.bottom - 4 : insets.bottom + 8;
  const footerPaddingTop = isTablet ? 12 : 8;
  const footerHeight = (isTablet ? 65 : 55) + footerPaddingBottom;

  const navigateTo = (screen: string) => {
    navigation.navigate('AppTabs', { screen });
  };

  const renderTab = (
    screen: string,
    label: string,
    iconName: keyof typeof Ionicons.glyphMap,
    isActive: boolean
  ) => {
    return (
      <Pressable 
        style={[styles.footerTab, { paddingTop: footerPaddingTop, flexDirection: 'column-reverse' }]} 
        onPress={() => navigateTo(screen)}
      >
        <View style={{ backgroundColor: 'transparent', marginTop: 2 }}>
          <Text style={{ 
            color: '#FFFFFF', 
            fontSize: isTablet ? 12 : 10, 
            fontFamily: isActive ? FONTS.semiBold : FONTS.medium,
            textAlign: 'center',
            letterSpacing: 0.2
          }}>
            {label}
          </Text>
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', overflow: 'visible' }}>
          {isActive && (
            <View style={{
              position: 'absolute',
              top: isTablet ? -11 : -10,
              height: 3,
              width: 36,
              backgroundColor: '#FFFFFF',
              borderRadius: 1.5,
            }} />
          )}
          <Ionicons name={iconName} size={isTablet ? 28 : 24} color="#FFFFFF" style={{ marginBottom: 2 }} />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.customFooter, { height: footerHeight, paddingBottom: footerPaddingBottom }]}>
      {renderTab('NewQuiz', 'Quizes', 'document-text-outline', activeRoute === 'NewQuiz')}
      {renderTab('Tasks', 'Tasks', 'list-outline', activeRoute === 'Tasks')}
      
      {/* Center Floating Action Button */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <FloatingActionButton isActive={isFabActive} onPress={onFabPress} />
      </View>

      {renderTab('Puzzles', 'Puzzles', 'extension-puzzle-outline', activeRoute === 'Puzzles')}
      {renderTab('Drawing', 'Draw', 'color-palette-outline', activeRoute === 'Drawing')}
    </View>
  );
};

const styles = StyleSheet.create({
  customFooter: {
    flexDirection: 'row',
    backgroundColor: '#00CED1',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
