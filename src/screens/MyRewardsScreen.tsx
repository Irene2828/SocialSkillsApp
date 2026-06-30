import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable, TextInput, Alert, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
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
  const { coinBalance, rewards, unlockedRewards, addUnlockedReward, toggleRewardFulfilled, deleteReward, updateReward } = useRewards();
  const { isParentModeUnlocked } = useProgress();
  const [redeemedReward, setRedeemedReward] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'unlocked'>('available');
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');

  const [showFulfillPin, setShowFulfillPin] = useState(false);
  const [rewardToFulfill, setRewardToFulfill] = useState<string | null>(null);
  const [fulfillPin, setFulfillPin] = useState('');

  // Delete flow
  const [showDeletePin, setShowDeletePin] = useState(false);
  const [rewardToDelete, setRewardToDelete] = useState<any>(null);
  const [deletePin, setDeletePin] = useState('');

  // Edit flow
  const [showEditPin, setShowEditPin] = useState(false);
  const [rewardToEdit, setRewardToEdit] = useState<any>(null);
  const [editPin, setEditPin] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editCost, setEditCost] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [successToast, setSuccessToast] = useState<{ message: string } | null>(null);
  const [highlightFirstItem, setHighlightFirstItem] = useState(false);

  const handleApproveReward = () => {
    setShowPinInput(true);
  };

  const handleFulfillPinChange = (text: string) => {
    const newPin = text.replace(/[^0-9]/g, '');
    setFulfillPin(newPin);

    if (newPin.length === 4) {
      if (newPin === '1111') {
        if (rewardToFulfill) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          toggleRewardFulfilled(rewardToFulfill);
        }
        setShowFulfillPin(false);
        setFulfillPin('');
        setRewardToFulfill(null);
      } else {
        Alert.alert('Incorrect PIN', 'Please try again.');
        setFulfillPin('');
      }
    }
  };

  const handleDeletePinChange = (text: string) => {
    const newPin = text.replace(/[^0-9]/g, '');
    setDeletePin(newPin);

    if (newPin.length === 4) {
      if (newPin === '1111') {
        if (rewardToDelete) {
          deleteReward(rewardToDelete.id);
          setSuccessToast({ message: 'Reward deleted' });
          setTimeout(() => setSuccessToast(null), 3000);
        }
        setShowDeletePin(false);
        setDeletePin('');
        setRewardToDelete(null);
      } else {
        Alert.alert('Incorrect PIN', 'Please try again.');
        setDeletePin('');
      }
    }
  };

  const handleEditPinChange = (text: string) => {
    const newPin = text.replace(/[^0-9]/g, '');
    setEditPin(newPin);

    if (newPin.length === 4) {
      if (newPin === '1111') {
        setShowEditPin(false);
        setEditPin('');
        setEditTitle(rewardToEdit?.title || '');
        setEditCost(String(rewardToEdit?.cost || ''));
        setShowEditForm(true);
      } else {
        Alert.alert('Incorrect PIN', 'Please try again.');
        setEditPin('');
      }
    }
  };

  const handleSaveEdit = () => {
    const costNum = parseInt(editCost, 10);
    if (!editTitle.trim() || isNaN(costNum) || costNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid reward name and a cost greater than 0.');
      return;
    }

    if (rewardToEdit) {
      updateReward(rewardToEdit.id, { title: editTitle.trim(), cost: costNum });
      setSuccessToast({ message: 'Reward updated' });
      setTimeout(() => setSuccessToast(null), 3000);
    }
    setShowEditForm(false);
    setRewardToEdit(null);
    setEditTitle('');
    setEditCost('');
  };

  const handlePinChange = (text: string) => {
    const newPin = text.replace(/[^0-9]/g, '');
    setPin(newPin);

    if (newPin.length === 4) {
      if (newPin === '1111') {
        if (redeemedReward) {
          addUnlockedReward(redeemedReward);
          setHighlightFirstItem(true);
          setTimeout(() => {
            setRedeemedReward(null);
            setShowPinInput(false);
            setPin('');
            setActiveTab('unlocked');
            setTimeout(() => setHighlightFirstItem(false), 4000);
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
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                    autoFocus
                    placeholder="****"
                    autoComplete="new-password"
                    autoCorrect={false}
                    importantForAutofill="no"
                    textContentType="oneTimeCode"
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
                    <Text style={{ fontSize: 24, fontStyle: 'italic', fontWeight: '600' }}>Hey parents!</Text>
                    {'\n\n'}
                    I've just <Text style={{ fontWeight: 'bold' }}>earned {redeemedReward.cost} coins</Text> for my social skills knowledge!
                    {'\n\n'}
                    <Text style={{ fontWeight: 'bold' }}>Here is what I chose to redeem it for:</Text>
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
        <Header title="My Results" style={{ paddingHorizontal: 0, marginTop: 0, marginBottom: 8, paddingBottom: 8 }} />
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
            <RewardList 
              rewards={rewards} 
              onRedeemSuccess={setRedeemedReward}
              onEdit={(reward) => { setRewardToEdit(reward); setShowEditPin(true); }}
              onDelete={(reward) => { setRewardToDelete(reward); setShowDeletePin(true); }}
            />
          ) : (
            <View style={{ marginTop: 8 }}>
              {unlockedRewards.length === 0 ? (
                <Text style={styles.emptyText}>No approved rewards yet.</Text>
              ) : (
                [...unlockedRewards].sort((a, b) => {
                  if (a.isFulfilled === b.isFulfilled) {
                    return b.timestamp - a.timestamp;
                  }
                  return a.isFulfilled ? 1 : -1;
                }).map((ur, index) => (
                  <UnlockedRewardItem 
                    key={ur.id} 
                    reward={ur} 
                    isHighlighted={highlightFirstItem && index === 0}
                    onToggle={(id) => {
                      setRewardToFulfill(id);
                      setShowFulfillPin(true);
                    }} 
                  />
                ))
              )}
            </View>
          )}
        </View>

      </ScrollView>
      {renderSuccessModal()}
      {successToast && (
        <View style={styles.toastWrapper}>
          <View style={styles.receivedChip}>
            <Ionicons name="checkmark-circle" size={18} color={theme.colors.text} style={{ marginRight: 6 }} />
            <Text style={styles.receivedText}>{successToast.message}</Text>
          </View>
        </View>
      )}
      </ScreenWrapper>

      <Modal visible={showFulfillPin} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => {
          setShowFulfillPin(false);
          setFulfillPin('');
          setRewardToFulfill(null);
        }}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.successCard} onPress={() => {}}>
              <View style={styles.pinContainer}>
                <Text style={styles.pinTitle}>Enter Parent PIN to Modify</Text>
                <TextInput
                  style={styles.pinInput}
                  value={fulfillPin}
                  onChangeText={handleFulfillPinChange}
                  keyboardType="number-pad"
                  maxLength={4}
                  autoFocus
                  placeholder="****"
                  autoComplete="off"
                  autoCorrect={false}
                  importantForAutofill="no"
                  textContentType="oneTimeCode"
                />
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Delete PIN Modal */}
      <Modal visible={showDeletePin} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => {
          setShowDeletePin(false);
          setDeletePin('');
          setRewardToDelete(null);
        }}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.pinCard} onPress={() => {}}>
              <View style={styles.pinContainer}>
                <Text style={styles.pinTitle}>Enter Parent PIN to Delete</Text>
                <TextInput
                  style={styles.pinInput}
                  value={deletePin}
                  onChangeText={handleDeletePinChange}
                  keyboardType="number-pad"
                  maxLength={4}
                  autoFocus
                  placeholder="****"
                  autoComplete="off"
                  autoCorrect={false}
                  importantForAutofill="no"
                  textContentType="oneTimeCode"
                />
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Edit PIN Modal */}
      <Modal visible={showEditPin} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => {
          setShowEditPin(false);
          setEditPin('');
          setRewardToEdit(null);
        }}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.pinCard} onPress={() => {}}>
              <View style={styles.pinContainer}>
                <Text style={styles.pinTitle}>Enter Parent PIN to Edit</Text>
                <TextInput
                  style={styles.pinInput}
                  value={editPin}
                  onChangeText={handleEditPinChange}
                  keyboardType="number-pad"
                  maxLength={4}
                  autoFocus
                  placeholder="****"
                  autoComplete="off"
                  autoCorrect={false}
                  importantForAutofill="no"
                  textContentType="oneTimeCode"
                />
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Edit Details Form Modal */}
      <Modal visible={showEditForm} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => {
          setShowEditForm(false);
          setRewardToEdit(null);
        }}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.pinCard} onPress={() => {}}>
              <Text style={styles.pinTitle}>Edit Reward</Text>
              <TextInput
                style={[styles.editInput, { marginBottom: 16 }]}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Reward Name"
              />
              <TextInput
                style={[styles.editInput, { marginBottom: 24 }]}
                value={editCost}
                onChangeText={setEditCost}
                placeholder="Cost"
                keyboardType="numeric"
              />
              <Button
                title="Save Changes"
                onPress={handleSaveEdit}
                style={{ width: '100%', marginBottom: 12 }}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  topSection: {
    marginBottom: 8,
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
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xl,
  },
  successCard: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
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
    backgroundColor: '#E5E7EB',
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
    letterSpacing: 0.15,
  },
  activeTabText: {
    color: theme.colors.text,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  pinCard: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
    borderRadius: 32,
    zIndex: 1000,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    ...theme.shadows.soft,
  },
  editInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.md,
    ...theme.typography.body,
    backgroundColor: theme.colors.white,
  },
  toastWrapper: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10000,
  },
  receivedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.soft,
  },
  receivedText: {
    ...theme.typography.button,
    fontSize: 14,
    color: theme.colors.text,
  },
});
