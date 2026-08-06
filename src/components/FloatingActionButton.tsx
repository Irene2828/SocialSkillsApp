import React from 'react';
import { View, Pressable, Text, StyleSheet, DeviceEventEmitter } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Defs, Path, Text as SvgText, TextPath } from 'react-native-svg';
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
          <Svg width={90} height={45} viewBox="0 0 90 45" style={{ overflow: 'visible' }}>
            <Defs>
              <Path id="curve" d="M 6,42 A 39,39 0 0,1 84,42" />
            </Defs>
            <SvgText fill="#FFFFFF" fontSize="9" fontWeight="800" letterSpacing="0.8">
              <TextPath href="#curve" startOffset="50%" textAnchor="middle">
                {label.toUpperCase()}
              </TextPath>
            </SvgText>
          </Svg>
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
    top: -46, // sits right over the top curve of the FAB circle
    width: 90,
    height: 45,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
});
