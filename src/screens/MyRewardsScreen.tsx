import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { CoinBalanceCard } from '../components/CoinBalanceCard';
import { RewardList } from '../components/RewardList';
import { AddRewardForm } from '../components/AddRewardForm';
import { useRewards } from '../context/RewardsContext';
import { useProgress } from '../context/ProgressContext';
import { theme } from '../theme';

export const MyRewardsScreen = () => {
  const { coinBalance, rewards } = useRewards();
  const { isParentModeUnlocked } = useProgress();

  return (
    <ScreenWrapper>
      <Header title="My Rewards" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Top Section: Stack Layout (Focus on balance and adding) */}
        <View style={styles.topSection}>
          <CoinBalanceCard balance={coinBalance} />
          {isParentModeUnlocked && <AddRewardForm />}
        </View>

        {/* Bottom Section: Bento Grid (Choice mode for redemption) */}
        <View style={styles.bentoSection}>
          <RewardList rewards={rewards} />
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  topSection: {
    marginBottom: theme.spacing.lg,
  },
  bentoSection: {
    // Container for the Bento grid elements
  },
});
