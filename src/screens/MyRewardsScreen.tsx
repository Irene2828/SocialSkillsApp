import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable, TextInput, LayoutAnimation, Platform, UIManager, Animated } from 'react-native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { CoinBalanceCard } from '../components/CoinBalanceCard';
import { RewardList } from '../components/RewardList';
import { RewardCard } from '../components/RewardCard';
import { ElectrifiedText } from '../components/ElectrifiedText';
import { UnlockedRewardItem } from '../components/UnlockedRewardItem';
import { AddRewardForm } from '../components/AddRewardForm';
import { GoldenDust } from '../components/GoldenDust';
import { SilverDust } from '../components/SilverDust';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useRewards } from '../context/RewardsContext';
import { useProgress } from '../context/ProgressContext';
import { useFeedback } from '../context/FeedbackContext';
import { theme, FONTS } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { GlobalBackground } from '../components/GlobalBackground';
import { TopBar } from '../components/TopBar';
import { useMood, getMoodColors } from '../context/MoodContext';

export const MyRewardsScreen = () => {
  const { coinBalance, deductCoins, rewards, unlockedRewards, addUnlockedReward, toggleRewardFulfilled, deleteReward, updateReward, addReward, deleteUnlockedReward, restoreUnlockedReward, restoreReward } = useRewards();
  const { isParentModeUnlocked } = useProgress();
  const { showModal, showToast } = useFeedback();
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const isDark = moodColors.isDark;
  const subTextColor = isDark ? 'rgba(255,255,255,0.7)' : theme.colors.secondaryText;

  const [showUndo, setShowUndo] = useState(false);
  const [undoState, setUndoState] = useState<{ type: 'delete' | 'fulfill' | 'delete-custom'; itemId: string } | null>(null);
  const [deletedUnlockedStack, setDeletedUnlockedStack] = useState<any[]>([]);
  const [deletedCustomStack, setDeletedCustomStack] = useState<any[]>([]);
  const undoTimeoutRef = React.useRef<any>(null);

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

          if (remaining.length > 0) {
            if (undoTimeoutRef.current) {
              clearTimeout(undoTimeoutRef.current);
            }
            undoTimeoutRef.current = setTimeout(() => {
              setShowUndo(false);
              setDeletedUnlockedStack([]);
              setUndoState(null);
            }, 5000);
            return;
          }
        }
      } else if (undoState.type === 'delete-custom') {
        if (deletedCustomStack.length > 0) {
          const [lastDeleted, ...remaining] = deletedCustomStack;
          restoreReward(lastDeleted);
          setDeletedCustomStack(remaining);

          if (remaining.length > 0) {
            if (undoTimeoutRef.current) {
              clearTimeout(undoTimeoutRef.current);
            }
            undoTimeoutRef.current = setTimeout(() => {
              setShowUndo(false);
              setDeletedCustomStack([]);
              setUndoState(null);
            }, 5000);
            return;
          }
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

  const shakeAnim = React.useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };
  const [redeemedReward, setRedeemedReward] = useState<any>(null);

  const [editingRewardId, setEditingRewardId] = useState<string | null>(null);
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
  
  // Add flow
  const [showAddPin, setShowAddPin] = useState(false);
  const [addPin, setAddPin] = useState('');
  const [addTitle, setAddTitle] = useState('');
  const [addCost, setAddCost] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [highlightFirstItem, setHighlightFirstItem] = useState(false);

  // Reset Balance flow
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
        showModal({ title: 'Incorrect PIN', message: 'Please try again.', type: 'error' });
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
          showToast({ message: 'Reward deleted' });
        }
        setShowDeletePin(false);
        setDeletePin('');
        setRewardToDelete(null);
      } else {
        triggerShake();
        setDeletePin('');
      }
    }
  };

  const handleAddPinChange = (text: string) => {
    const newPin = text.replace(/[^0-9]/g, '');
    setAddPin(newPin);

    if (newPin.length === 4) {
      if (newPin === '1111') {
        setShowAddPin(false);
        setAddPin('');
        setShowAddForm(true);
      } else {
        triggerShake();
        setAddPin('');
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
        triggerShake();
        setEditPin('');
      }
    }
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
                </View>
              ) : (
                <>
                  <View style={styles.successTitleContainer}>
                    <Text style={styles.successTitleNormal}>Reward </Text>
                    <View style={styles.underlinedWordContainer}>
                      <Text style={styles.successTitleHighlighted}>Unlocked</Text>
                      <View style={styles.brushUnderline} />
                    </View>
                    <Text style={styles.successTitleNormal}>!</Text>
                  </View>
                  
                  <View style={styles.successRewardRow}>
                    <View style={styles.successIconWrapper}>
                      <Ionicons name={redeemedReward.icon || 'gift-outline'} size={24} color={theme.colors.text} />
                    </View>
                    <Text style={styles.successRewardLabel} numberOfLines={1} adjustsFontSizeToFit>{redeemedReward.title}</Text>
                  </View>

                  <View style={styles.successCopyBox}>
                    <Text style={styles.successCuteCopy}>
                      Ask a parent to approve this reward for you.
                    </Text>
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
    <View style={{ flex: 1, backgroundColor: isDark ? moodColors.bg : theme.colors.background }}>
      <GlobalBackground />
      <ScreenWrapper transparent>
        <TopBar title="" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Top Section: Stack Layout (Focus on balance and adding) */}
        {/* Results Header Removed */}
        <View style={styles.topSection}>
          <CoinBalanceCard balance={coinBalance} onReset={() => setShowResetPin(true)} />
        </View>

        {/* Bottom Section: Tabs and Lists */}
        <View style={[styles.tabContainer, isDark && { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)', shadowOpacity: 0 }]}>
          <Pressable 
            style={[styles.tab, { borderRightWidth: 1, borderRightColor: '#BAE6FD' }, activeTab === 'available' && { backgroundColor: '#F0F9FF' }]} 
            onPress={() => setActiveTab('available')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {activeTab === 'available' ? (
                <ElectrifiedText animated={false} text="All Rewards" style={[styles.tabText, { fontFamily: FONTS.semiBold, fontWeight: '500', fontSize: 18, letterSpacing: 0.2, lineHeight: 26 }]} startIndex={0} totalLetters={11} />
              ) : (
                <Text style={[styles.tabText, { color: subTextColor, fontSize: 18, lineHeight: 26 }]}>All Rewards</Text>
              )}
            </View>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'unlocked' && { backgroundColor: '#F0F9FF' }]} 
            onPress={() => setActiveTab('unlocked')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {activeTab === 'unlocked' ? (
                <ElectrifiedText animated={false} text="Unlocked" style={[styles.tabText, { fontFamily: FONTS.semiBold, fontWeight: '500', fontSize: 18, letterSpacing: 0.2, lineHeight: 26 }]} startIndex={0} totalLetters={8} />
              ) : (
                <Text style={[styles.tabText, { color: subTextColor, fontSize: 18, lineHeight: 26 }]}>Unlocked</Text>
              )}
            </View>
          </Pressable>
        </View>

        <View style={styles.bentoSection}>
          {activeTab === 'available' ? (
            <View>
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
              <View style={{ width: '100%', marginTop: 24, paddingHorizontal: theme.spacing.xl }}>
                <Button 
                  title="Add New Reward" 
                  iconName="gift-outline"
                  onPress={() => setShowAddPin(true)} 
                  style={{ marginBottom: 12, width: '100%', backgroundColor: '#BEF264' }}
                />
              </View>
            </View>
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

      </ScrollView>
      {renderSuccessModal()}
      </ScreenWrapper>

      {/* Reset Balance PIN Modal */}
      <Modal visible={showResetPin} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => {
          setShowResetPin(false);
          setResetPin('');
        }}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.successCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
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
                  autoComplete="off"
                  autoCorrect={false}
                  importantForAutofill="no"
                />
              </Animated.View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={showFulfillPin} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => {
          setShowFulfillPin(false);
          setFulfillPin('');
          setRewardToFulfill(null);
        }}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.successCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Animated.View style={[styles.pinContainer, { transform: [{ translateX: shakeAnim }] }]}>
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
              </Animated.View>
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
            <Pressable style={styles.pinCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Animated.View style={[styles.pinContainer, { transform: [{ translateX: shakeAnim }] }]}>
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
              </Animated.View>
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
            <Pressable style={styles.pinCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Animated.View style={[styles.pinContainer, { transform: [{ translateX: shakeAnim }] }]}>
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
              </Animated.View>
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
            <Pressable style={styles.pinCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>

              <Text style={styles.pinTitle}>Edit Reward</Text>
              <TextInput
                style={[styles.editInput, { marginBottom: theme.spacing.md }]}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Reward Name"
              />
              <TextInput
                style={[styles.editInput, { marginBottom: theme.spacing.lg }]}
                value={editCost}
                onChangeText={setEditCost}
                placeholder="Cost"
                keyboardType="numeric"
              />
              <Button
                title="Save Changes"
                onPress={handleSaveEdit}
                style={{ width: '100%', marginBottom: theme.spacing.md }}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Add PIN Modal */}
      <Modal visible={showAddPin} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => {
          setShowAddPin(false);
          setAddPin('');
        }}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.pinCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Animated.View style={[styles.pinContainer, { transform: [{ translateX: shakeAnim }] }]}>
                <Text style={styles.pinTitle}>Enter Parent PIN to Add</Text>
                <TextInput
                  style={styles.pinInput}
                  value={addPin}
                  onChangeText={handleAddPinChange}
                  keyboardType="number-pad"
                  maxLength={4}
                  autoFocus
                  placeholder="****"
                  autoComplete="off"
                  autoCorrect={false}
                  importantForAutofill="no"
                  textContentType="oneTimeCode"
                />
              </Animated.View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Add Details Form Modal */}
      <Modal visible={showAddForm} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => {
          setShowAddForm(false);
        }}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.pinCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>

              <Text style={styles.pinTitle}>Add New Reward</Text>
              <TextInput
                style={[styles.editInput, { marginBottom: theme.spacing.md }]}
                value={addTitle}
                onChangeText={setAddTitle}
                placeholder="Reward Name"
              />
              <TextInput
                style={[styles.editInput, { marginBottom: theme.spacing.lg }]}
                value={addCost}
                onChangeText={setAddCost}
                placeholder="Cost"
                keyboardType="numeric"
              />
              <Button
                title="Save Reward"
                onPress={handleSaveAdd}
                style={{ width: '100%', marginBottom: theme.spacing.md }}
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
    paddingBottom: 160,
  },
  topSection: {
    marginBottom: 20, // Doubled from theme.spacing.sm (10)
  },
  bannerContainer: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    ...theme.typography.body,
    fontWeight: '600',
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
    borderRadius: theme.borderRadius.sm,
    
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  successCard: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    borderRadius: 0,
    overflow: 'hidden',
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  successRewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  successIconWrapper: {
    backgroundColor: theme.colors.successGreenSoft,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  successRewardLabel: {
    ...theme.typography.body,
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: 0.5,
    textAlign: 'center',
    color: theme.colors.text,
    marginLeft: 12,
    textTransform: 'capitalize',
  },
  successTitleNormal: {
    ...theme.typography.subheading,
    color: theme.colors.text,
  },
  successTitleHighlighted: {
    ...theme.typography.subheading,
    color: theme.colors.text,
  },
  underlinedWordContainer: {
    position: 'relative',
  },
  celebrationIcon: {
    fontSize: 22,
  },
  successTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  brushUnderline: {
    position: 'absolute',
    bottom: -4,
    left: '2%',
    right: '2%',
    height: 5.5,
    backgroundColor: '#BEF264',
    borderRadius: 4,
    transform: [{ rotate: '-1.5deg' }],
    zIndex: -1,
  },
  successCopyBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.colors.stroke,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  successCuteCopy: {
    ...theme.typography.heading,
    fontFamily: FONTS.regular,
    fontSize: 19,
    fontWeight: '400',
    lineHeight: 26,
    letterSpacing: 0.2,
    color: '#111827',
    textAlign: 'center',
  },
  approveButton: {
    marginTop: theme.spacing.md,
    width: '100%',
  },
  pinContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  pinTitle: {
    ...theme.typography.body,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.text,
  },
  pinInput: {
    width: 120,
    height: 60,
    borderWidth: 2,
    
    borderRadius: theme.borderRadius.md,
    fontSize: 32,
    textAlign: 'center',
    letterSpacing: 8,
    backgroundColor: theme.colors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: 0,
    padding: 0,
    marginHorizontal: -theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    ...theme.shadows.soft,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: 'rgba(186, 230, 253, 0.4)',
    borderColor: '#BAE6FD',
    borderWidth: 2,
  },
  tabText: {
    ...theme.typography.button,
    fontFamily: FONTS.medium,
    fontWeight: '500',
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
  },
  pinCard: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    zIndex: 1000,
    backgroundColor: theme.colors.white,
  },
  editInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    
    borderRadius: theme.borderRadius.sm,
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
  toastChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.soft,
  },
  toastText: {
    ...theme.typography.button,
    color: theme.colors.text,
    fontSize: 14,
  },
  undoToastWrapper: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10000,
  },
  undoToastChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'space-between',
    width: '90%',
    maxWidth: 400,
  },
  undoToastText: {
    ...theme.typography.button,
    color: theme.colors.white,
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
    fontWeight: '700',
  },
});
