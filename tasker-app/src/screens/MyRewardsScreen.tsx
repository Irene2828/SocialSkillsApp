import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable, TextInput, Animated } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { CoinBalanceCard } from '../components/CoinBalanceCard';
import { RewardList } from '../components/RewardList';
import { UnlockedRewardItem } from '../components/UnlockedRewardItem';
import { Button } from '../components/Button';
import { useRewards } from '../context/RewardsContext';
import { useFeedback } from '../context/FeedbackContext';
import { theme, FONTS } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { GlobalBackground } from '../components/GlobalBackground';
import { TopBar } from '../components/TopBar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TaskerStackParamList } from '../navigation/types';

export const MyRewardsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<TaskerStackParamList>>();
  const { coinBalance, deductCoins, rewards, unlockedRewards, addUnlockedReward, toggleRewardFulfilled, deleteReward, updateReward, addReward, deleteUnlockedReward, restoreUnlockedReward, restoreReward } = useRewards();
  const { showModal, showToast } = useFeedback();

  const [showUndo, setShowUndo] = useState(false);
  const [undoState, setUndoState] = useState<{ type: 'delete' | 'fulfill' | 'delete-custom'; itemId: string } | null>(null);
  const [deletedUnlockedStack, setDeletedUnlockedStack] = useState<any[]>([]);
  const [deletedCustomStack, setDeletedCustomStack] = useState<any[]>([]);
  const undoTimeoutRef = useRef<any>(null);

  const handleDeleteUnlocked = (id: string) => {
    const item = unlockedRewards.find(r => r.id === id);
    if (item) {
      deleteUnlockedReward(id);
    }
  };

  const handleDeleteReward = (reward: any) => {
    deleteReward(reward.id);
    setDeletedCustomStack(prev => [reward, ...prev]);
    setUndoState({ type: 'delete-custom', itemId: reward.id });
    setShowUndo(true);

    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }

    undoTimeoutRef.current = setTimeout(() => {
      setShowUndo(false);
      setDeletedCustomStack([]);
      setUndoState(null);
    }, 5000);
  };

  const handleToggleFulfilled = (id: string) => {
    const item = unlockedRewards.find(r => r.id === id);
    if (item) {
      toggleRewardFulfilled(id);
    }
  };

  const handleUndoAction = () => {
    if (undoState) {
      if (undoState.type === 'delete') {
        if (deletedUnlockedStack.length > 0) {
          const [lastDeleted, ...remaining] = deletedUnlockedStack;
          restoreUnlockedReward(lastDeleted);
          setDeletedUnlockedStack(remaining);
        }
      } else if (undoState.type === 'delete-custom') {
        if (deletedCustomStack.length > 0) {
          const [lastDeleted, ...remaining] = deletedCustomStack;
          restoreReward(lastDeleted);
          setDeletedCustomStack(remaining);
        }
      } else if (undoState.type === 'fulfill') {
        toggleRewardFulfilled(undoState.itemId);
      }
      setShowUndo(false);
      setUndoState(null);
      setDeletedUnlockedStack([]);
      setDeletedCustomStack([]);
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
    }
  };

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  const [redeemedReward, setRedeemedReward] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'unlocked'>('available');
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');

  const [rewardToEdit, setRewardToEdit] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCost, setEditCost] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);

  const [addTitle, setAddTitle] = useState('');
  const [addCost, setAddCost] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [highlightFirstItem, setHighlightFirstItem] = useState(false);
  const [showResetPin, setShowResetPin] = useState(false);
  const [resetPin, setResetPin] = useState('');

  const handleResetPinChange = (text: string) => {
    const newPin = text.replace(/[^0-9]/g, '');
    setResetPin(newPin);

    if (newPin.length === 4) {
      if (newPin === '1111') {
        deductCoins(coinBalance);
        setShowResetPin(false);
        setResetPin('');
        showToast({ message: 'Points reset to 0' });
      } else {
        triggerShake();
        setResetPin('');
      }
    }
  };

  const handleSaveAdd = () => {
    const costNum = parseInt(addCost, 10);
    if (!addTitle.trim() || isNaN(costNum) || costNum <= 0) {
      showModal({ title: 'Invalid Input', message: 'Please enter a valid reward name and a cost greater than 0.', type: 'error' });
      return;
    }

    addReward({ title: addTitle.trim(), cost: costNum });
    showToast({ message: 'Reward added!' });

    setShowAddForm(false);
    setAddTitle('');
    setAddCost('');
  };

  const handleSaveEdit = () => {
    const costNum = parseInt(editCost, 10);
    if (!editTitle.trim() || isNaN(costNum) || costNum <= 0) {
      showModal({ title: 'Invalid Input', message: 'Please enter a valid reward name and a cost greater than 0.', type: 'error' });
      return;
    }

    if (rewardToEdit) {
      updateReward(rewardToEdit.id, { title: editTitle.trim(), cost: costNum });
      showToast({ message: 'Reward updated' });
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
        triggerShake();
        setPin('');
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <GlobalBackground />
      <ScreenWrapper transparent>
        <TopBar
          title="Rewards"
          onBack={() => navigation.goBack()}
        />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.topSection}>
            <CoinBalanceCard balance={coinBalance} onReset={() => setShowResetPin(true)} />
          </View>

          <View style={{ paddingHorizontal: 12 }}>
            <View style={styles.tabContainer}>
              <Pressable
                style={[styles.tab, activeTab === 'available' && styles.activeTab]}
                onPress={() => setActiveTab('available')}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'available' && styles.activeTabText
                ]}>
                  All
                </Text>
              </Pressable>

              <Pressable
                style={[styles.tab, activeTab === 'unlocked' && styles.activeTab]}
                onPress={() => setActiveTab('unlocked')}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'unlocked' && styles.activeTabText
                ]}>
                  Redeemed ({unlockedRewards.length})
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.bentoSection}>
            {activeTab === 'available' ? (
              <RewardList
                rewards={rewards}
                onRedeemSuccess={setRedeemedReward}
                onEdit={(reward) => {
                  setRewardToEdit(reward);
                  setEditTitle(reward.title);
                  setEditCost(String(reward.cost));
                  setShowEditForm(true);
                }}
                onDelete={(reward) => {
                  handleDeleteReward(reward);
                }}
              />
            ) : (
              <View style={{ marginTop: 8 }}>
                {unlockedRewards.length === 0 ? (
                  <Text style={styles.emptyText}>No redeemed rewards yet.</Text>
                ) : (
                  [...unlockedRewards].sort((a, b) => {
                    if (a.isFulfilled === b.isFulfilled) {
                      return b.timestamp - a.timestamp;
                    }
                    return a.isFulfilled ? 1 : -1;
                  }).map((reward) => (
                    <UnlockedRewardItem
                      key={reward.id}
                      reward={reward}
                      isHighlighted={highlightFirstItem && unlockedRewards[0]?.id === reward.id}
                      onToggle={handleToggleFulfilled}
                      onDelete={handleDeleteUnlocked}
                    />
                  ))
                )}
              </View>
            )}
          </View>

          <View style={{ alignItems: 'center', marginTop: theme.spacing.xl, marginBottom: theme.spacing.lg, paddingHorizontal: theme.spacing.xl }}>
            <Text style={{
              ...theme.typography.body,
              fontFamily: FONTS.medium,
              fontWeight: '500',
              color: theme.colors.secondaryText,
              textAlign: 'center',
              letterSpacing: 0.6,
              marginBottom: theme.spacing.md,
            }}>
              Add a new reward to the list.
            </Text>

            <Button
              title="Add New Reward"
              iconName="add-circle-outline"
              onPress={() => setShowAddForm(true)}
              style={{
                paddingHorizontal: 36,
                paddingVertical: 12,
                minHeight: 0,
              }}
              textStyle={{
                fontFamily: FONTS.medium,
                fontWeight: '500',
                fontSize: 16,
                letterSpacing: 0.4,
              }}
            />
          </View>
        </ScrollView>
      </ScreenWrapper>

      {redeemedReward && (
        <Modal transparent visible animationType="fade">
          <Pressable style={{ flex: 1 }} onPress={() => setRedeemedReward(null)}>
            <View style={styles.modalOverlay}>
              <Pressable style={styles.dialogCard} onPress={(e: any) => e.stopPropagation?.()}>
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
                      placeholderTextColor={theme.colors.secondaryText}
                    />
                  </View>
                ) : (
                  <>
                    <Text style={styles.dialogTitle}>Reward Unlocked!</Text>
                    <Text style={styles.dialogSub}>{redeemedReward.title}</Text>
                    <Button
                      title="Approve Reward"
                      onPress={() => setShowPinInput(true)}
                      style={{ width: '100%', marginTop: theme.spacing.md }}
                      variant="primary"
                    />
                  </>
                )}
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      )}

      <Modal visible={showResetPin} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => { setShowResetPin(false); setResetPin(''); }}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.dialogCard} onPress={(e: any) => e.stopPropagation?.()}>
              <Animated.View style={[styles.pinContainer, { transform: [{ translateX: shakeAnim }] }]}>
                <Text style={styles.pinTitle}>Enter Parent PIN to Reset Coins</Text>
                <TextInput
                  style={styles.pinInput}
                  value={resetPin}
                  onChangeText={handleResetPinChange}
                  keyboardType="number-pad"
                  maxLength={4}
                  autoFocus
                  placeholder="****"
                  placeholderTextColor={theme.colors.secondaryText}
                />
              </Animated.View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={showEditForm} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => { setShowEditForm(false); setRewardToEdit(null); }}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.dialogCard} onPress={(e: any) => e.stopPropagation?.()}>
              <Text style={styles.dialogTitle}>Edit Reward</Text>
              <TextInput
                style={[styles.input, { marginBottom: theme.spacing.md }]}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Reward Name"
                placeholderTextColor={theme.colors.secondaryText}
              />
              <TextInput
                style={[styles.input, { marginBottom: theme.spacing.lg }]}
                value={editCost}
                onChangeText={setEditCost}
                placeholder="Cost"
                placeholderTextColor={theme.colors.secondaryText}
                keyboardType="numeric"
              />
              <Button
                title="Save Changes"
                onPress={handleSaveEdit}
                style={{ width: '100%', marginBottom: theme.spacing.md }}
              />
              <Button
                title="Cancel"
                onPress={() => { setShowEditForm(false); setRewardToEdit(null); }}
                variant="secondary"
                style={{ width: '100%' }}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={showAddForm} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => setShowAddForm(false)}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.dialogCard} onPress={(e: any) => e.stopPropagation?.()}>
              <Text style={styles.dialogTitle}>Add New Reward</Text>
              <TextInput
                style={[styles.input, { marginBottom: theme.spacing.md }]}
                value={addTitle}
                onChangeText={setAddTitle}
                placeholder="Reward Name"
                placeholderTextColor={theme.colors.secondaryText}
              />
              <TextInput
                style={[styles.input, { marginBottom: theme.spacing.lg }]}
                value={addCost}
                onChangeText={setAddCost}
                placeholder="Cost"
                placeholderTextColor={theme.colors.secondaryText}
                keyboardType="numeric"
              />
              <Button
                title="Save Reward"
                onPress={handleSaveAdd}
                style={{ width: '100%', marginBottom: theme.spacing.md }}
              />
              <Button
                title="Cancel"
                onPress={() => setShowAddForm(false)}
                variant="secondary"
                style={{ width: '100%' }}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {showUndo && (
        <View style={styles.undoToastWrapper}>
          <View style={styles.undoToastChip}>
            <Text style={styles.undoToastText}>
              {undoState?.type === 'fulfill' ? 'Reward marked as received' : 'Reward deleted'}
            </Text>
            <Pressable onPress={handleUndoAction} style={styles.undoButton}>
              <Text style={styles.undoButtonText}>Undo</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 95,
  },
  topSection: {
    marginBottom: 20,
    paddingHorizontal: 12,
    marginTop: 20,
  },
  bentoSection: {
    paddingHorizontal: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 450,
    alignItems: 'center',
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.neutralGrey,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
  },
  dialogTitle: {
    ...theme.typography.heading,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  dialogSub: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  pinContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  pinTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.text,
  },
  pinInput: {
    width: 140,
    height: 56,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    borderRadius: theme.borderRadius.md,
    fontSize: 28,
    textAlign: 'center',
    letterSpacing: 8,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    backgroundColor: theme.colors.neutralGrey,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: theme.colors.stroke,
  },
  tabText: {
    ...theme.typography.body,
    fontFamily: FONTS.medium,
    fontWeight: '500',
    color: theme.colors.secondaryText,
    fontSize: 16,
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
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    ...theme.typography.body,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  undoToastWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10000,
  },
  undoToastChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutralGrey,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'space-between',
    width: '90%',
    maxWidth: 400,
  },
  undoToastText: {
    ...theme.typography.button,
    color: theme.colors.text,
    fontSize: 14,
  },
  undoButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
  },
  undoButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MyRewardsScreen;
