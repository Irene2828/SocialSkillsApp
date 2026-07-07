import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, FONTS } from '../theme';
import { SettingsModal } from './SettingsModal';
import { useMood, getMoodColors } from '../context/MoodContext';

interface TopBarProps {
  title: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({ title, onBack, rightComponent }) => {
  const [showSettings, setShowSettings] = useState(false);
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const isRocket = mood === 'rocket';
  const textColor = isRocket ? '#FFFFFF' : theme.colors.text;

  return (
    <>
      <View style={styles.container}>
        {/* Back button or empty view for flex balancing */}
        <View style={styles.side}>
          {onBack && (
            <Pressable onPress={onBack} style={{ padding: 8, marginLeft: -8 }}>
              <Ionicons name="arrow-back" size={24} color={textColor} />
            </Pressable>
          )}
        </View>
        
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        
        <View style={[styles.side, { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'flex-end' }]}>
          {rightComponent}
          <Pressable onPress={() => setShowSettings(true)} style={{ padding: 8 }}>
            <Ionicons name="options-outline" size={24} color={textColor} />
          </Pressable>
        </View>
      </View>
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 8,
    width: '100%',
    zIndex: 100,
  },
  side: {
    minWidth: 40,
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: 20,
    color: theme.colors.text,
    textAlign: 'center',
    flex: 1,
  },
});
