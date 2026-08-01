import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const textColor = '#2A1E5C';
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
        { position: 'relative', overflow: 'hidden' },
        !hideBorder && {
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255, 255, 255, 0.25)',
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.025,
          shadowRadius: 9,
          elevation: 0,
        }
      ]}>
        <LinearGradient
          colors={['rgba(255, 241, 242, 0.45)', 'rgba(243, 232, 255, 0.55)', 'rgba(224, 231, 255, 0.4)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
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
            </Pressable>
          ) : showSettingsAndRewards ? (
            <Pressable onPress={() => navigation.navigate('Home' as never)} style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="home-outline" size={24} color="#2A1E5C" />
            </Pressable>
          ) : null}
        </View>
        
        {/* Right Side: rightComponent OR Coins button */}
        <View style={[styles.side, { alignItems: 'center', justifyContent: 'center' }]}>
          {rightComponent ? rightComponent : showSettingsAndRewards ? (
            <Pressable onPress={() => navigation.navigate('MyRewards' as never)} style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={styles.coinBadge}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.coinText, { color: '#2A1E5C', marginRight: 2 }]}>+</Text>
                  {String(coinBalance).split('').map((char, index) => {
                    return (
                      <Text key={`coin-${index}`} style={[styles.coinText, { color: '#2A1E5C' }]}>
                        {char}
                      </Text>
                    );
                  })}
                </View>
                <FontAwesome5 name="coins" size={16} color="#2A1E5C" style={[styles.coinIcon, { marginLeft: 4 }]} />
              </View>
              <Text style={[styles.headerLabel, { fontSize: isTablet ? 14 : 12, color: '#2A1E5C' }]}>Redeem</Text>
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
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 12,
    marginHorizontal: -10,
    zIndex: 100,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.4)',
  },
  compactContainer: {
    paddingTop: 6,
    paddingBottom: 2,
  },
  noEdgeToEdge: {
    marginHorizontal: 0,
    borderRadius: theme.borderRadius.sm,
    borderBottomWidth: 0,
  },
  side: {
    minWidth: 40,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: 20,
    fontWeight: '500',
    color: '#2A1E5C',
    textAlign: 'center',
    letterSpacing: -0.3,
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
    backgroundColor: 'rgba(224, 251, 252, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowOpacity: 0,
    elevation: 0,
  },
  coinText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.32)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
