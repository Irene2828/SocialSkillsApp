import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme, FONTS } from '../theme';
import { SettingsModal } from './SettingsModal';
import { GradientIcon } from './GradientIcon';
import { ElectrifiedText } from './ElectrifiedText';
import { useMood, getMoodColors } from '../context/MoodContext';
import { useRewards } from '../context/RewardsContext';
import { FontAwesome5 } from '@expo/vector-icons';

interface TopBarProps {
  title: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  hideHome?: boolean;
  hideTitle?: boolean;
  showSettingsAndRewards?: boolean;
  hideBorder?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ title, onBack, rightComponent, hideHome, hideTitle, showSettingsAndRewards, hideBorder }) => {
  const navigation = useNavigation<any>();
  const { coinBalance } = useRewards();
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
      <View style={[styles.container, { position: 'relative' }, hideBorder && { borderBottomWidth: 0 }]}>
        {/* Center: Title (absolutely positioned for perfect centering) */}
        <View style={styles.titleContainer} pointerEvents="none">
          {!hideTitle && (
            <Text style={[styles.title, isRocket && { color: '#FFFFFF' }]} numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>

        <View style={styles.side}>
          {onBack ? (
            <Pressable onPress={onBack} style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="arrow-back" size={24} color={textColor} />
              <Text style={[styles.headerLabel, { fontSize: isTablet ? 14 : 12 }]}>Back</Text>
            </Pressable>
          ) : showSettingsAndRewards ? (
            <Pressable onPress={() => navigation.navigate('Home' as never)} style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="home-outline" size={24} color={'#38BDF8'} />
              <Text style={[styles.headerLabel, { fontSize: isTablet ? 14 : 12 }]}>Home</Text>
            </Pressable>
          ) : null}
        </View>
        
        {/* Right Side: rightComponent OR Coins button */}
        <View style={[styles.side, { alignItems: 'center', justifyContent: 'center' }]}>
          {rightComponent ? rightComponent : showSettingsAndRewards ? (
            <Pressable onPress={() => navigation.navigate('MyRewards' as never)} style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={styles.coinBadge}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.coinText, { color: isRocket ? '#FFFFFF' : '#38BDF8', marginRight: 2 }]}>+</Text>
                  {String(coinBalance).split('').map((char, index) => {
                    const gradientColors = ['#38BDF8', '#0EA5E9', '#0284C7', '#0369A1', '#075985', '#0C4A6E'];
                    const color = isRocket ? '#FFFFFF' : gradientColors[Math.min(index + 1, gradientColors.length - 1)];
                    return (
                      <Text key={`coin-${index}`} style={[styles.coinText, { color }]}>
                        {char}
                      </Text>
                    );
                  })}
                </View>
                <FontAwesome5 name="coins" size={16} color={isRocket ? '#FFFFFF' : '#38BDF8'} style={[styles.coinIcon, { marginLeft: 4 }]} />
              </View>
              <Text style={[styles.headerLabel, { fontSize: isTablet ? 14 : 12 }]}>Redeem</Text>
            </Pressable>
          ) : null}
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
    height: 72,
    width: '100%',
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
    marginBottom: 0, // No space under stroke
    backgroundColor: '#FFFFFF', // Required for shadow to be visible on web/iOS
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  side: {
    minWidth: 40,
    height: '100%',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: 20,
    color: theme.colors.text,
    textAlign: 'center',
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    marginHorizontal: 80,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    ...theme.shadows.soft,
  },
  coinText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: '#D97706',
  },
  coinIcon: {
    marginTop: 1,
  },
  headerLabel: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: theme.colors.secondaryText,
    marginTop: 4,
    textAlign: 'center',
  },
});
