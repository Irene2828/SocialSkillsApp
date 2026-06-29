import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface CoinBalanceCardProps {
  balance: number;
}

export const CoinBalanceCard: React.FC<CoinBalanceCardProps> = ({ balance }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.content}>
          <View style={styles.balanceRow}>
            <Text 
              style={styles.balanceNumber}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {balance}
            </Text>
            <Text style={styles.balanceLabel}>Coins</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.soft,
    position: 'relative',
    minHeight: 220,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingTop: 40,
    zIndex: 1,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  balanceNumber: {
    ...theme.typography.heading,
    fontSize: 64,
    color: theme.colors.primary,
    lineHeight: 70,
  },
  balanceLabel: {
    ...theme.typography.heading,
    fontSize: 24,
    color: theme.colors.primary,
    fontWeight: '500',
    marginLeft: theme.spacing.sm,
  },
});
