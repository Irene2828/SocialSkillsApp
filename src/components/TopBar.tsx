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
  compact?: boolean;
  noEdgeToEdge?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ title, onBack, rightComponent, hideHome, hideTitle, showSettingsAndRewards, hideBorder, compact, noEdgeToEdge }) => {
  const navigation = useNavigation<any>();
  const { coinBalance } = useRewards();
  const [showSettings, setShowSettings] = useState(false);
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const isRocket = mood === 'rocket';
  const textColor = '#FFFFFF';
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isSmallScreen = width < 375;

  const headerFontSize = isTablet ? 32 : (isSmallScreen ? 18 : 22);



  return (
    <>
      <View style={[
        styles.container, 
        compact && styles.compactContainer,
        noEdgeToEdge && styles.noEdgeToEdge,
      ]}>
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
            <Pressable onPress={onBack} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="arrow-back" size={24} color={isRocket ? '#FFFFFF' : '#0C4A6E'} />
            </Pressable>
          ) : showSettingsAndRewards ? (
            <Pressable onPress={() => navigation.navigate('Home' as never)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="home-outline" size={24} color={isRocket ? '#FFFFFF' : '#0C4A6E'} />
            </Pressable>
          ) : null}
        </View>
        
        {/* Right Side: rightComponent OR Coins button */}
        <View style={[styles.side, { alignItems: 'center', justifyContent: 'center' }]}>
          {rightComponent ? rightComponent : showSettingsAndRewards ? (
            <Pressable 
              onPress={() => navigation.navigate('MyRewards' as never)} 
              style={{ 
                alignItems: 'center', 
                justifyContent: 'center',
                borderWidth: 1.2,
                borderColor: isRocket ? 'rgba(255, 255, 255, 0.45)' : 'rgba(12, 74, 110, 0.45)',
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <View style={styles.coinBadge}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.coinText, { color: isRocket ? '#FFFFFF' : '#0C4A6E', marginRight: 2 }]}>+</Text>
                  {String(coinBalance).split('').map((char, index) => {
                    return (
                      <Text key={`coin-${index}`} style={[styles.coinText, { color: isRocket ? '#FFFFFF' : '#0C4A6E' }]}>
                        {char}
                      </Text>
                    );
                  })}
                </View>
                <FontAwesome5 name="coins" size={12} color={isRocket ? '#FFFFFF' : '#0C4A6E'} style={[styles.coinIcon, { marginLeft: 4 }]} />
              </View>
              <Text 
                style={{ 
                  fontFamily: FONTS.medium,
                  fontSize: isTablet ? 14 : 12,
                  lineHeight: isTablet ? 18 : 15,
                  color: isRocket ? '#FFFFFF' : '#0C4A6E',
                  marginTop: -2,
                  textAlign: 'center'
                }}
              >
                Redeem
              </Text>
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
    paddingHorizontal: 12, // theme.spacing.lg
    paddingTop: 12,
    paddingBottom: 12,
    marginHorizontal: 0, // removed hack
    zIndex: 100,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.45)',
  },
  compactContainer: {
    paddingTop: 6,
    paddingBottom: 2,
    marginBottom: theme.spacing.sm,
  },
  noEdgeToEdge: {
    marginHorizontal: 0,
    borderBottomWidth: 0,
  },
  side: {
    minWidth: 40,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: 20,
    fontWeight: '500',
    color: '#0C4A6E',
    textAlign: 'center',
    letterSpacing: 0.4,
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
    marginBottom: 2,
  },
  coinText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: '#FFFFFF',
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
