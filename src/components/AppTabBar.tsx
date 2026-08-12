import React, { useEffect, useRef } from 'react';
import { View, Pressable, Text, StyleSheet, useWindowDimensions, Platform, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingActionButton } from './FloatingActionButton';
import { theme, FONTS } from '../theme';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { NavigationUIContext } from '../context/NavigationContext';

interface AppTabBarProps {
  activeRoute?: 'NewQuiz' | 'Tasks' | 'Puzzles' | 'Drawing' | 'None' | string;
  navContext?: NavigationUIContext;
  onFabPress?: () => void;
  isFabActive?: boolean;
}

export const AppTabBar = ({ 
  activeRoute = 'None', 
  navContext = 'Default',
  onFabPress, 
  isFabActive = true 
}: AppTabBarProps) => {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const isTablet = SCREEN_WIDTH >= 768;
  const navigation = useNavigation<NavigationProp<any>>();

  const isIPhoneWithNotch = Platform.OS === 'ios' && insets.bottom > 20;
  const footerPaddingBottom = isIPhoneWithNotch ? insets.bottom - 4 : insets.bottom + 8;
  const footerPaddingTop = isTablet ? 12 : 8;
  const footerHeight = (isTablet ? 65 : 55) + footerPaddingBottom;

  // 1. Immersive State: Full Footer Hide via slide down (translateY(100%)) over 400ms using cubic-bezier(0.32, 0.72, 0, 1)
  const isImmersive = navContext === 'Immersive';
  const slideAnim = useRef(new Animated.Value(isImmersive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isImmersive ? 1 : 0,
      duration: 400,
      easing: Easing.bezier(0.32, 0.72, 0, 1),
      useNativeDriver: true,
    }).start();
  }, [isImmersive, slideAnim]);

  // 2. Passive State: Floating Button Disappearance & Auto-Balancing Grid
  const isPassive = navContext === 'Passive';
  const centerFabWidthAnim = useRef(new Animated.Value(isPassive ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(centerFabWidthAnim, {
      toValue: isPassive ? 0 : 1,
      duration: 300,
      easing: Easing.bezier(0.32, 0.72, 0, 1),
      useNativeDriver: false, // Flex width animation
    }).start();
  }, [isPassive, centerFabWidthAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, footerHeight + 40],
  });

  const centerFlex = centerFabWidthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.0001, 1],
  });

  const navigateTo = (screen: string) => {
    navigation.navigate('AppTabs', { screen });
  };

  const renderTab = (
    screen: string,
    label: string,
    iconName: keyof typeof Ionicons.glyphMap,
    isActive: boolean,
    onPressOverride?: () => void
  ) => {
    return (
      <Pressable 
        style={[styles.footerTab, { paddingTop: footerPaddingTop, flexDirection: 'column' }]} 
        onPress={() => onPressOverride ? onPressOverride() : navigateTo(screen)}
      >
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
          <Ionicons name={iconName} size={isTablet ? 28 : 24} color="#FFFFFF" />
        </View>
        <View style={{ backgroundColor: 'transparent' }}>
          <Text style={{ 
            color: '#FFFFFF', 
            fontSize: isTablet ? 14 : 12, 
            fontFamily: FONTS.medium,
            lineHeight: isTablet ? 18 : 15,
            textAlign: 'center',
            letterSpacing: 0.8,
            marginTop: 2
          }}>
            {label}
          </Text>
        </View>
      </Pressable>
    );
  };

  const fabLabel = activeRoute === 'Drawing' ? 'Save' : '+ Add';

  return (
    <Animated.View 
      style={[
        styles.customFooter, 
        { 
          height: footerHeight, 
          paddingBottom: footerPaddingBottom,
          transform: [{ translateY }],
          // Will-change hint for 60fps WebKit performance
          ...(Platform.OS === 'web' ? { willChange: 'transform' } : {}),
        } as any
      ]}
      pointerEvents={isImmersive ? 'none' : 'auto'}
    >
      {renderTab('NewQuiz', 'Learn', 'document-text-outline', activeRoute === 'NewQuiz')}
      {renderTab('Tasks', 'Do', 'list-outline', activeRoute === 'Tasks')}
      
      {/* Center Floating Action Button Container with fluid auto-balancing grid movement */}
      <Animated.View style={{ flex: centerFlex, alignItems: 'center', justifyContent: 'center', overflow: 'visible', zIndex: 10 }}>
        <FloatingActionButton 
          isActive={isFabActive && !isPassive} 
          isVisible={!isPassive}
          onPress={onFabPress} 
          label={fabLabel}
        />
      </Animated.View>

      {renderTab('Puzzles', 'Play', 'extension-puzzle-outline', activeRoute === 'Puzzles')}
      {renderTab('MyRewards', 'Redeem', 'gift-outline', activeRoute === 'MyRewards')}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  customFooter: {
    flexDirection: 'row',
    backgroundColor: 'rgba(12, 74, 110, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'visible',
    zIndex: 99,
  },
  footerTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46, // Maintain touch-target height requirements (46px - 52px)
  }
});
