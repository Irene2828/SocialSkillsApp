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
    <Card style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="cash-outline" size={48} color={theme.colors.success} />
      </View>
      <Text style={[styles.balanceText, balance === 0 && { color: theme.colors.success }]}>{balance} Coins</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  iconContainer: {
    marginBottom: theme.spacing.md,
  },
  balanceText: {
    ...theme.typography.heading,
    fontSize: 32,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
});
