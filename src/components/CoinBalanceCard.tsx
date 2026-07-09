import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { FontAwesome5 } from '@expo/vector-icons';
import { useMood, getMoodColors } from '../context/MoodContext';

interface CoinBalanceCardProps {
  balance: number;
}

export const CoinBalanceCard: React.FC<CoinBalanceCardProps> = ({ balance }) => {
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const isRocket = mood === 'rocket';

  const glassStyle = isRocket ? {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 0.1,
  } : {};

  const glassTextShadow = isRocket ? {
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  } : {};

  const gradientColors = [
    '#38BDF8', '#0EA5E9', '#0284C7', '#0369A1', '#075985',
    '#0C4A6E', '#1E3A8A', '#1E40AF', '#1D4ED8', '#2563EB',
    '#3B82F6', '#60A5FA', '#93C5FD'
  ];

  return (
    <View style={styles.cardContainer}>
      <View style={[styles.card, glassStyle]}>
        <View style={styles.content}>
          <Text style={[styles.earnedText, isRocket && { color: 'rgba(255, 255, 255, 0.75)' }, isRocket && glassTextShadow]}>You've earned:</Text>
          <View style={styles.balanceRow}>
            <FontAwesome5 
              name="coins" 
              size={34} 
              color={isRocket ? '#FFFFFF' : gradientColors[0]} 
              style={{ marginRight: 12, marginTop: 4, textShadowColor: isRocket ? 'rgba(0,0,0,0.4)' : undefined, textShadowRadius: isRocket ? 2 : undefined, textShadowOffset: isRocket ? {width:0, height:1} : undefined }}
            />
            <View style={{ flexDirection: 'row' }}>
              {balance.toString().split('').map((char, index) => (
                <Text 
                  key={`num-${index}`}
                  style={[
                    styles.balanceNumber, 
                    isRocket && glassTextShadow, 
                    { color: isRocket ? '#FFFFFF' : gradientColors[Math.min(2 + index, gradientColors.length - 1)] }
                  ]}
                >
                  {char}
                </Text>
              ))}
            </View>
            <View style={{ flexDirection: 'row', marginLeft: theme.spacing.sm }}>
              {"Coins".split('').map((char, index) => (
                <Text 
                  key={`coin-${index}`}
                  style={[
                    styles.balanceLabel, 
                    { marginLeft: 0 },
                    isRocket && glassTextShadow, 
                    { color: isRocket ? '#FFFFFF' : gradientColors[Math.min(2 + balance.toString().length + 1 + index, gradientColors.length - 1)] }
                  ]}
                >
                  {char}
                </Text>
              ))}
            </View>
          </View>
          <Text style={[styles.subtitleText, isRocket && { color: 'rgba(255, 255, 255, 0.7)' }, isRocket && glassTextShadow]}>Redeem points for rewards of your choice anytime!</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 8,
    alignItems: 'center',
    width: '100%',
  },
  card: {
    width: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.soft,
    borderWidth: 2,
    borderColor: theme.colors.stroke,
    position: 'relative',
    minHeight: 120,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  earnedText: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    letterSpacing: 0.1,
    marginBottom: theme.spacing.xs,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  balanceNumber: {
    ...theme.typography.heading,
    fontFamily: 'InstrumentSans_500Medium',
    fontSize: 54,
    fontWeight: '500',
    color: theme.colors.text,
    lineHeight: 60,
  },
  balanceLabel: {
    ...theme.typography.heading,
    fontFamily: 'InstrumentSans_500Medium',
    fontSize: 24,
    color: theme.colors.text,
    fontWeight: '500',
    marginLeft: theme.spacing.sm,
  },
  subtitleText: {
    ...theme.typography.caption,
    color: theme.colors.secondaryText,
    marginTop: 12,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  bannerTitle: {
    ...theme.typography.heading,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
  },
  bannerSubtitle: {
    ...theme.typography.body,
    fontSize: 17,
    fontStyle: 'italic',
    color: theme.colors.secondaryText,
    textAlign: 'center',
    marginBottom: 4,
  },
});
