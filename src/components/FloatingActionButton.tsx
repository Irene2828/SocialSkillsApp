import React, { useEffect, useRef } from 'react';
import { View, Pressable, StyleSheet, DeviceEventEmitter, useWindowDimensions, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, FONTS } from '../theme';

interface FloatingActionButtonProps {
  isActive?: boolean;
  isVisible?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  label?: string;
}

export const FloatingActionButton = ({
  isActive = true,
  isVisible = true,
  onPress,
  accessibilityLabel = "+ Add",
  label = "+ Add",
}: FloatingActionButtonProps) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const isTablet = SCREEN_WIDTH >= 768;

  // Animated values for Passive context transition (scale 0, opacity 0 over 300ms)
  const scaleAnim = useRef(new Animated.Value(isVisible ? 1 : 0)).current;
  const opacityAnim = useRef(new Animated.Value(isVisible ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: isVisible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: isVisible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isVisible, scaleAnim, opacityAnim]);

  const handlePress = () => {
    if (!isVisible) return;
    if (onPress) {
      onPress();
    } else {
      DeviceEventEmitter.emit('FAB_PRESSED');
    }
  };

  const isSave = label.toLowerCase().includes('save');

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          transform: [{ scale: scaleAnim }], 
          opacity: opacityAnim,
          // Hardware acceleration layer hint for WebKit 60fps
          ...(Platform.OS === 'web' ? { willChange: 'transform, opacity' } : {}),
        } as any
      ]}
      pointerEvents={isVisible ? 'auto' : 'none'}
    >
      <Pressable
        onPress={handlePress}
        disabled={!isActive || !isVisible}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={[
          styles.button,
          isActive ? styles.activeButton : styles.inactiveButton,
        ]}
        accessibilityLabel={accessibilityLabel}
      >
        <Ionicons 
          name={isSave ? 'save-outline' : 'add'} 
          size={isSave ? (isTablet ? 32 : 26) : (isTablet ? 42 : 36)} 
          color={isActive ? '#0C4A6E' : 'rgba(255, 255, 255, 0.3)'} 
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    position: 'relative',
    overflow: 'visible',
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 32, // 32px squircle border-radius geometry
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -30,
    borderWidth: 5,
    paddingHorizontal: 4,
  },
  activeButton: {
    backgroundColor: theme.colors.primary, // Premium bright green/yellow
    borderColor: '#00CED1', // Matches tab bar background for cutout effect
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  inactiveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(0, 206, 209, 0.22)', // Dimmed outline when disabled
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontFamily: FONTS.medium,
    fontWeight: '600',
    fontSize: 10.5,
    textAlign: 'center',
    lineHeight: 13,
  }
});
