import React from 'react';
import { View, Pressable, Text, StyleSheet, DeviceEventEmitter } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, FONTS } from '../theme';

interface FloatingActionButtonProps {
  isActive?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  label?: string;
}

export const FloatingActionButton = ({
  isActive = false,
  onPress,
  accessibilityLabel = "Add New",
  iconName = "add",
  label,
}: FloatingActionButtonProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      DeviceEventEmitter.emit('FAB_PRESSED');
    }
  };

  return (
    <View style={styles.container}>
      {isActive && label && (
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{label}</Text>
        </View>
      )}
      <Pressable
        onPress={handlePress}
        disabled={!isActive}
        style={[
          styles.button,
          isActive ? styles.activeButton : styles.inactiveButton,
        ]}
        accessibilityLabel={accessibilityLabel}
      >
        <Ionicons
          name={iconName}
          size={28}
          color={isActive ? '#0C4A6E' : 'rgba(255, 255, 255, 0.3)'}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    position: 'relative',
    overflow: 'visible',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -24,
    borderWidth: 5,
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
  labelContainer: {
    position: 'absolute',
    top: -55,
    backgroundColor: 'rgba(0, 206, 209, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 1000,
  },
  labelText: {
    color: '#FFFFFF',
    fontFamily: FONTS.medium,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
