import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable, TextInput, Alert } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { CoinBalanceCard } from '../components/CoinBalanceCard';
import { RewardList } from '../components/RewardList';
import { UnlockedRewardItem } from '../components/UnlockedRewardItem';
import { AddRewardForm } from '../components/AddRewardForm';
import { GoldenDust } from '../components/GoldenDust';
import { SilverDust } from '../components/SilverDust';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useRewards } from '../context/RewardsContext';
import { useProgress } from '../context/ProgressContext';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCubesBackground } from '../components/AnimatedCubesBackground';

export const MyRewardsScreen = () => {
  const { coinBalance, rewards, unlockedRewards, addUnlockedReward, toggleRewardFulfilled } = useRewards();
  const { isParentModeUnlocked } = useProgress();
  const [redeemedReward, setRedeemedReward] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'unlocked'>('available');
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');

  const handleApproveReward = () => {
    setShowPinInput(true);
  };

  const handlePinChange = (text: string) => {
    const newPin = text.replace(/[^0-9]/g, '');
    setPin(newPin);

    if (newPin.length === 4) {
      if (newPin === '1111') {
        if (redeemedReward) {
          addUnlockedReward(redeemedReward);
          setTimeout(() => {
            setRedeemedReward(null);
            setShowPinInput(false);
            setPin('');
            setActiveTab('unlocked');
          }, 500);
        }
      } else {
        Alert.alert('Incorrect PIN', 'Please try again.');
        setPin('');
      }
    }
  };

  const renderSuccessModal = () => {
    if (!redeemedReward) return null;
    return (
      <Modal transparent visible animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => setRedeemedReward(null)}>
          <View style={styles.modalOverlay}>
            <SilverDust />
            <Pressable style={styles.successCard} onPress={() => {}}>
              {showPinInput ? (
                <View style={styles.pinContainer}>
                  <Text style={styles.pinTitle}>Enter Parent PIN</Text>
                  <TextInput
                    style={styles.pinInput}
                    value={pin}
                    onChangeText={handlePinChange}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    autoFocus
                    placeholder="****"
                  />
                  <Button 
                    title="Cancel" 
                    onPress={() => {
                      setShowPinInput(false);
                      setPin('');
                    }} 
                    variant="outline"
                    style={{ marginTop: 16 }}
                  />
                </View>
              ) : (
                <>
                  <Text style={styles.successCuteCopy}>
                    <Text style={{ backgroundColor: theme.colors.primary }}>Hey parents!</Text>
                    {'\n\n'}
                    I've just <Text style={{ fontWeight: 'bold' }}>earned {redeemedReward.cost} coins</Text> for my social skills knowledge!
                    {'\n\n'}
                    Here's what I redeem it for:
                  </Text>
                  <View style={styles.successRewardRow}>
                    <View style={styles.successIconWrapper}>
                      <Ionicons name={redeemedReward.icon || 'gift'} size={40} color="#4B5563" />
                    </View>
                    <Text style={styles.successRewardLabel}>{redeemedReward.title}</Text>
                  </View>

                  <Button 
                    title="Approve Reward" 
                    onPress={handleApproveReward} 
                    style={styles.approveButton}
                    variant="primary"
                  />
                </>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedCubesBackground />
      <ScreenWrapper transparent>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Top Section: Stack Layout (Focus on balance and adding) */}
        <View style={styles.topSection}>
          <CoinBalanceCard balance={coinBalance} />
          {isParentModeUnlocked && <AddRewardForm />}
        </View>

        {/* Bottom Section: Tabs and Lists */}
        <View style={styles.tabContainer}>
          <Pressable 
            style={[styles.tab, activeTab === 'available' && styles.activeTab]} 
            onPress={() => setActiveTab('available')}
          >
            <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>All Rewards</Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'unlocked' && styles.activeTab]} 
            onPress={() => setActiveTab('unlocked')}
          >
            <Text style={[styles.tabText, activeTab === 'unlocked' && styles.activeTabText]}>Approved</Text>
          </Pressable>
        </View>

        <View style={styles.bentoSection}>
          {activeTab === 'available' ? (
            <RewardList rewards={rewards} onRedeemSuccess={setRedeemedReward} />
          ) : (
            <View style={{ marginTop: 8 }}>
              {unlockedRewards.length === 0 ? (
                <Text style={styles.emptyText}>No approved rewards yet.</Text>
              ) : (
                unlockedRewards.map(ur => (
                  <UnlockedRewardItem 
                    key={ur.id} 
                    reward={ur} 
                    onToggle={toggleRewardFulfilled} 
                  />
                ))
              )}
            </View>
          )}
        </View>

      </ScrollView>
      {renderSuccessModal()}
      </ScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  topSection: {
    marginBottom: theme.spacing.lg,
  },
  bannerContainer: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    ...theme.typography.heading,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  bannerSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.secondaryText,
  },
  bentoSection: {
    // Removed padding to allow full width on small screens
  },
  helpButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  successCard: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    padding: theme.spacing.xxl,
    borderRadius: 32,
    zIndex: 1000,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    ...theme.shadows.soft,
  },
  successRewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconWrapper: {
    backgroundColor: 'rgba(190, 242, 100, 0.8)',
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
  successRewardLabel: {
    ...theme.typography.heading,
    fontSize: 20,
    color: '#4B5563',
    marginLeft: 12,
    textTransform: 'capitalize',
  },
  successCuteCopy: {
    ...theme.typography.body,
    fontStyle: 'italic',
    fontSize: 20,
    lineHeight: 28,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  approveButton: {
    marginTop: 32,
    width: '100%',
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  pinContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  pinTitle: {
    ...theme.typography.heading,
    fontSize: 20,
    marginBottom: 24,
  },
  pinInput: {
    width: 120,
    height: 60,
    borderWidth: 2,
    borderColor: theme.colors.stroke,
    borderRadius: theme.borderRadius.md,
    fontSize: 32,
    textAlign: 'center',
    letterSpacing: 8,
    backgroundColor: theme.colors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.full,
    padding: 4,
    ...theme.shadows.soft,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
  },
  activeTab: {
    backgroundColor: '#F3F4F6', // Matches footer color
  },
  tabText: {
    ...theme.typography.button,
    color: theme.colors.secondaryText,
  },
  activeTabText: {
    color: theme.colors.text,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  }
});
