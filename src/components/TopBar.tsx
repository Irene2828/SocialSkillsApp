import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme, FONTS } from '../theme';
import { SettingsModal } from './SettingsModal';
import { GradientIcon } from './GradientIcon';
import { ElectrifiedText } from './ElectrifiedText';
import { useMood, getMoodColors } from '../context/MoodContext';

interface TopBarProps {
  title: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  hideHome?: boolean;
  hideTitle?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ title, onBack, rightComponent, hideHome, hideTitle }) => {
  const navigation = useNavigation<any>();
  const [showSettings, setShowSettings] = useState(false);
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const isRocket = mood === 'rocket';
  const textColor = isRocket ? '#FFFFFF' : theme.colors.text;
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isSmallScreen = width < 375;

  const headerFontSize = isTablet ? 32 : (isSmallScreen ? 18 : 22);

  return (
    <>
      <View style={styles.container}>
        {/* Back button or Home button for flex balancing */}
        <View style={styles.side}>
          {onBack ? (
            <Pressable onPress={onBack} style={{ padding: 8, marginLeft: -8 }}>
              <Ionicons name="arrow-back" size={24} color={textColor} />
            </Pressable>
          ) : null}
        </View>
        
        <View style={{ flex: 1 }} />
        
        <View style={[styles.side, { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'flex-end' }]}>
          {rightComponent}
        </View>
      </View>
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
