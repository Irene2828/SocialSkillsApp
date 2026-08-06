import React from 'react';
import { View, Pressable, StyleSheet, DeviceEventEmitter } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface FloatingActionButtonProps {
  isActive?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const FloatingActionButton = ({
  isActive = false,
  onPress,
  accessibilityLabel = "Add New",
  iconName = "add",
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
          color={isActive ? '#0C4A6E' : 'rgba(255, 255, 255, 0.4)'}
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
    borderColor: '#00CED1', // Matches tab bar background for cutout effect
  },
  activeButton: {
    backgroundColor: theme.colors.primary, // Premium bright green/yellow
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  inactiveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 5,
    borderColor: '#00CED1',
    shadowOpacity: 0,
    elevation: 0,
  },
});
