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
            <Ionicons name="refresh-outline" size={20} color={theme.colors.secondaryText} />
          </Pressable>
        )}
        <View style={styles.content}>
          <Text style={styles.earnedText}>You've earned:</Text>
          <View style={styles.balanceRow}>
            <FontAwesome5
              name="coins"
              size={36}
              color={theme.colors.text}
              style={{ marginRight: 12, marginTop: 4 }}
            />
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.balanceNumber}>
                {balance}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginLeft: theme.spacing.sm }}>
              <Text style={styles.balanceLabel}>
                Coins
              </Text>
            </View>
          </View>
          <Text style={styles.subtitleText}>{"When you have enough - redeem them\nfor a reward of your choice"}</Text>
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
    backgroundColor: theme.colors.neutralGrey,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: 12,
  },
  earnedText: {
    ...theme.typography.body,
    fontFamily: FONTS.medium,
    fontWeight: '500',
    fontSize: 16,
    color: theme.colors.secondaryText,
    letterSpacing: 0.8,
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
    color: theme.colors.text,
    lineHeight: 60,
  },
  balanceLabel: {
    ...theme.typography.heading,
    fontFamily: FONTS.regular,
    fontSize: 24,
    color: theme.colors.secondaryText,
    fontWeight: '400',
    marginLeft: theme.spacing.sm,
  },
  subtitleText: {
    fontFamily: FONTS.regular,
    fontWeight: '400',
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginTop: 12,
    textAlign: 'center',
  },
});
