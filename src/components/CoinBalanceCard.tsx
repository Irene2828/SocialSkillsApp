import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { FontAwesome5 } from '@expo/vector-icons';

interface CoinBalanceCardProps {
  balance: number;
}

export const CoinBalanceCard: React.FC<CoinBalanceCardProps> = ({ balance }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.content}>
          <View style={styles.balanceRow}>
            <FontAwesome5 
              name="coins" 
              size={34} 
              color={theme.colors.primary} 
              style={{ 
                marginRight: theme.spacing.md,
                textShadowColor: '#9CA3AF',
                textShadowOffset: { width: -0.5, height: 0.5 },
                textShadowRadius: 1 
              }} 
            />
            <Text 
              style={styles.balanceNumber}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {balance}
            </Text>
            <Text style={styles.balanceLabel}>Coins</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.bannerSubtitle}>Use your coins to unlock fun rewards for a reward of your choice!</Text>
          </View>
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
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    position: 'relative',
    minHeight: 120,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
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
    fontSize: 16,
    fontStyle: 'italic',
    color: theme.colors.secondaryText,
    textAlign: 'center',
    marginBottom: 4,
  },
});
