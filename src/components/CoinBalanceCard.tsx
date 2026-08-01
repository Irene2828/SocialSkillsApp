import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme, FONTS } from '../theme';
import { Card } from './Card';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

interface CoinBalanceCardProps {
  balance: number;
  onReset?: () => void;
}

export const CoinBalanceCard: React.FC<CoinBalanceCardProps> = ({ balance, onReset }) => {
  return (
    <View style={styles.cardContainer}>
      <Card style={styles.card}>
        {onReset && (
          <Pressable 
            onPress={onReset}
            style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, padding: 4 }}
          >
            <Ionicons name="refresh-outline" size={20} color="#2A1E5C" style={{ opacity: 0.8 }} />
          </Pressable>
        )}
        <View style={styles.content}>
          <Text style={styles.earnedText}>You've earned:</Text>
          <View style={styles.balanceRow}>
            <FontAwesome5 
              name="coins" 
              size={34} 
              color="#2A1E5C" 
              style={{ marginRight: 12, marginTop: 4 }}
            />
            <View style={{ flexDirection: 'row' }}>
              {balance.toString().split('').map((char, index) => (
                <Text 
                  key={`num-${index}`}
                  style={[
                    styles.balanceNumber, 
                    { color: '#2A1E5C' }
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
                    { color: '#2A1E5C' }
                  ]}
                >
                  {char}
                </Text>
              ))}
            </View>
          </View>
          <Text style={styles.subtitleText}>Redeem coins for rewards of your choice anytime!</Text>
        </View>
      </Card>
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
    fontFamily: FONTS.medium,
    fontWeight: '500',
    color: '#2A1E5C',
    letterSpacing: 0,
    marginBottom: theme.spacing.xs,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  balanceNumber: {
    ...theme.typography.heading,
    fontFamily: FONTS.regular,
    fontSize: 54,
    fontWeight: '400',
    color: '#2A1E5C',
    lineHeight: 60,
  },
  balanceLabel: {
    ...theme.typography.heading,
    fontFamily: FONTS.regular,
    fontSize: 24,
    color: '#2A1E5C',
    fontWeight: '400',
    marginLeft: theme.spacing.sm,
  },
  subtitleText: {
    ...theme.typography.caption,
    color: 'rgba(42, 30, 92, 0.7)',
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
