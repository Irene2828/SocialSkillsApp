import React from 'react';
import { View, Platform } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

interface GradientIconProps {
  iconFamily: 'Ionicons' | 'FontAwesome5';
  name: string;
  size: number;
  style?: any;
}

export const GradientIcon = ({ iconFamily, name, size, style }: GradientIconProps) => {
  if (Platform.OS === 'web') {
    return (
      <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
        {iconFamily === 'FontAwesome5' ? (
          <FontAwesome5 name={name as any} size={size} color="#0EA5E9" />
        ) : (
          <Ionicons name={name as any} size={size} color="#0EA5E9" />
        )}
      </View>
    );
  }

  return (
    <MaskedView
      style={[{ width: size, height: size }, style]}
      maskElement={
        <View style={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', width: size, height: size }}>
          {iconFamily === 'FontAwesome5' ? (
            <FontAwesome5 name={name as any} size={size} color="white" />
          ) : (
            <Ionicons name={name as any} size={size} color="white" />
          )}
        </View>
      }
    >
      <LinearGradient
        colors={['#38BDF8', '#1E3A8A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      />
    </MaskedView>
  );
};
