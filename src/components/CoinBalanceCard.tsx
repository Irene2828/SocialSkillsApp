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
        <View style={styles.waveBackground} />
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            {/* Using a star in a circle to mimic the 3D coin */}
            <View style={styles.coinBadge}>
              <Ionicons name="star" size={40} color={theme.colors.white} />
            </View>
          </View>
          <Text style={styles.balanceNumber}>{balance}</Text>
          <Text style={styles.balanceLabel}>Coins</Text>
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
  waveBackground: {
    position: 'absolute',
    bottom: -50,
    left: -20,
    right: -20,
    height: 120,
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 100, // Creates a soft curve at the bottom
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingTop: 40,
    zIndex: 1,
  },
  iconContainer: {
    marginBottom: theme.spacing.md,
  },
  coinBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.success, // Yellow/Gold
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.glow,
    shadowColor: theme.colors.success,
  },
  balanceNumber: {
    ...theme.typography.heading,
    fontSize: 64,
    color: theme.colors.primary,
    lineHeight: 70,
  },
  balanceLabel: {
    ...theme.typography.heading,
    fontSize: 20,
    color: theme.colors.primary,
    fontWeight: '500',
  },
});
