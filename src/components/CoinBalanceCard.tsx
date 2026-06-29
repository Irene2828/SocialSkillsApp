import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../theme';
import { FontAwesome5 } from '@expo/vector-icons';

interface CoinBalanceCardProps {
  balance: number;
}

export const CoinBalanceCard: React.FC<CoinBalanceCardProps> = ({ balance }) => {
  const maxVisualCoins = 15;
  const coinsToRender = Math.min(balance, maxVisualCoins);
  
  // Array of animated values for each coin
  const coinAnims = useRef(
    Array.from({ length: maxVisualCoins }).map(() => new Animated.Value(-200))
  ).current;

  const jarScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (balance > 0) {
      Animated.sequence([
        Animated.timing(jarScale, { toValue: 1.05, duration: 150, useNativeDriver: true }),
        Animated.spring(jarScale, { toValue: 1, friction: 3, useNativeDriver: true })
      ]).start();
    }

    const animations = coinAnims.slice(0, coinsToRender).map((anim, index) => {
      return Animated.spring(anim, {
        toValue: 0,
        friction: 5,
        tension: 40,
        useNativeDriver: true
      });
    });

    Animated.stagger(100, animations).start();
  }, [balance]);

  const getCoinStyle = (index: number) => {
    const cols = 4;
    const row = Math.floor(index / cols);
    const col = index % cols;
    const jitterX = (index * 13) % 15 - 7;
    const jitterY = (index * 17) % 15 - 7;

    return {
      position: 'absolute' as const,
      bottom: 10 + (row * 12) + jitterY,
      left: 18 + (col * 22) + jitterX,
    };
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.content}>
          
          <Animated.View style={[styles.jarWrapper, { transform: [{ scale: jarScale }] }]}>
            <View style={styles.jarLip} />
            <View style={styles.jarNeck} />
            <View style={styles.jarBody}>
              {Array.from({ length: coinsToRender }).map((_, i) => (
                <Animated.View 
                  key={i} 
                  style={[
                    getCoinStyle(i),
                    { transform: [{ translateY: coinAnims[i] }] }
                  ]}
                >
                  <FontAwesome5 name="coins" size={24} color={theme.colors.success} />
                </Animated.View>
              ))}
            </View>
          </Animated.View>

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
    paddingTop: 30,
    zIndex: 1,
  },
  jarWrapper: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  jarLip: {
    width: 80,
    height: 12,
    backgroundColor: 'rgba(200, 220, 240, 0.9)',
    borderRadius: 6,
    zIndex: 2,
    borderWidth: 2,
    borderColor: 'rgba(180, 200, 230, 0.8)',
  },
  jarNeck: {
    width: 70,
    height: 15,
    backgroundColor: 'rgba(230, 240, 255, 0.4)',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: 'rgba(200, 220, 240, 0.8)',
  },
  jarBody: {
    width: 130,
    height: 140,
    backgroundColor: 'rgba(230, 240, 255, 0.3)',
    borderWidth: 4,
    borderColor: 'rgba(200, 220, 240, 0.8)',
    borderTopWidth: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  balanceNumber: {
    ...theme.typography.heading,
    fontSize: 54,
    color: theme.colors.primary,
    lineHeight: 60,
  },
  balanceLabel: {
    ...theme.typography.heading,
    fontSize: 22,
    color: theme.colors.primary,
    fontWeight: '500',
    marginLeft: theme.spacing.sm,
  },
});
