import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
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
  const navigation = useNavigation<NavigationProp<any>>();
  const { coinBalance } = useRewards();
  const [showSettings, setShowSettings] = useState(false);
  const { mood } = useMood();
  const gradientColors = [
    '#38BDF8', '#0EA5E9', '#0284C7', '#0369A1', '#075985',
    '#0C4A6E', '#1E3A8A', '#1E40AF', '#1D4ED8', '#2563EB',
    '#3B82F6', '#60A5FA', '#93C5FD'
  ];
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
            <View style={{ alignItems: 'center', width: '100%' }}>
              <Text 
                style={[styles.title, isRocket && { color: '#FFFFFF' }]} 
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
              >
                {title}
              </Text>
              <Svg width="50%" height={8} viewBox="0 0 100 8" preserveAspectRatio="none" style={{ marginTop: 2 }}>
                <Path
                  d="M2,3.5 Q25,0.5 50,4 T98,2.5 Q50,7.5 2,3.5"
                  fill="#0C4A6E"
                />
              </Svg>
            </View>
          )}
        </View>

        <View style={styles.side}>
          {onBack ? (
            <Pressable 
              onPress={onBack} 
              style={{ 
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                borderWidth: 1.2,
                borderColor: 'rgba(255, 255, 255, 0.4)',
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </Pressable>
          ) : showSettingsAndRewards ? (
            <Pressable 
              onPress={() => navigation.navigate('Home' as never)} 
              style={{ 
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                borderWidth: 1.2,
                borderColor: 'rgba(255, 255, 255, 0.4)',
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Ionicons name="home-outline" size={20} color="#FFFFFF" />
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
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                borderWidth: 1.2,
                borderColor: 'rgba(255, 255, 255, 0.4)',
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 4,
              }}
            >
              <View style={styles.coinBadge}>
                <Text style={[styles.coinText, { color: '#0C4A6E', letterSpacing: 0.8 }]}>
                  +{coinBalance}
                </Text>
                <FontAwesome5 name="coins" size={12} color="#0C4A6E" style={[styles.coinIcon, { marginLeft: 6 }]} />
              </View>
              <Text 
                style={{ 
                  fontFamily: FONTS.medium,
                  fontSize: isTablet ? 14 : 12,
                  lineHeight: isTablet ? 18 : 15,
                  color: '#FFFFFF',
                  marginTop: -2,
                  textAlign: 'center',
                  letterSpacing: 0.8,
                }}
              >
                Rewards
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
    marginBottom: 0,
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
    color: '#FFFFFF',
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
