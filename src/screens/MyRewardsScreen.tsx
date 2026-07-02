import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable, TextInput, LayoutAnimation, Platform, UIManager } from 'react-native';

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
import { useFeedback } from '../context/FeedbackContext';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCubesBackground } from '../components/AnimatedCubesBackground';

export const MyRewardsScreen = () => {
  const { coinBalance, rewards, unlockedRewards, addUnlockedReward, toggleRewardFulfilled, deleteReward, updateReward, addReward } = useRewards();
  const { isParentModeUnlocked } = useProgress();
  const { showModal, showToast } = useFeedback();
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
  
  // Add flow
  const [showAddPin, setShowAddPin] = useState(false);
  const [addPin, setAddPin] = useState('');
  const [addTitle, setAddTitle] = useState('');
  const [addCost, setAddCost] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

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
        showModal({ title: 'Incorrect PIN', message: 'Please try again.', type: 'error' });
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
        showModal({ title: 'Incorrect PIN', message: 'Please try again.', type: 'error' });
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
        showModal({ title: 'Incorrect PIN', message: 'Please try again.', type: 'error' });
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
        showModal({ title: 'Incorrect PIN', message: 'Please try again.', type: 'error' });
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
              <Pressable 
                style={styles.closeButton} 
                onPress={() => setRedeemedReward(null)}
              >
                <Ionicons name="close" size={24} color={theme.colors.secondaryText} />
              </Pressable>
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
                    style={{ marginTop: theme.spacing.md }}
                  />
                </View>
              ) : (
                <>
                  <Text style={styles.successCuteCopy}>
                    <Text style={{ ...theme.typography.heading, fontStyle: 'italic' }}>Hey parents!</Text>
                    {'\n\n'}
                    <Text style={{ fontWeight: 'bold' }}>I've just earned {redeemedReward.cost} coins</Text> for my social skills knowledge!
                  </Text>
                  <View style={styles.successRewardRow}>
                    <View style={styles.successIconWrapper}>
                      <Ionicons name={redeemedReward.icon || 'gift-outline'} size={40} color={theme.colors.text} />
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
            <View>
              <RewardList 
                rewards={rewards} 
                onRedeemSuccess={setRedeemedReward}
                onEdit={(reward) => { setRewardToEdit(reward); setShowEditPin(true); }}
                onDelete={(reward) => { setRewardToDelete(reward); setShowDeletePin(true); }}
              />
              <Button 
                title="Add New Reward" 
                onPress={() => setShowAddPin(true)} 
                style={{ marginTop: 16, width: '100%', backgroundColor: '#BEF264' }}
              />
            </View>
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
              <Pressable 
                style={styles.closeButton} 
                onPress={() => {
                  setShowEditForm(false);
                  setRewardToEdit(null);
                }}
              >
                <Ionicons name="close" size={24} color={theme.colors.secondaryText} />
              </Pressable>
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
            <Pressable style={styles.pinCard} onPress={() => {}}>
              <View style={styles.pinContainer}>
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
              </View>
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
            <Pressable style={styles.pinCard} onPress={() => {}}>
              <Pressable 
                style={styles.closeButton} 
                onPress={() => setShowAddForm(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.secondaryText} />
              </Pressable>
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

    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  topSection: {
    marginBottom: theme.spacing.sm,
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
    maxWidth: 500,
    alignItems: 'center',
    padding: theme.spacing.xl,
    paddingTop: 48,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    zIndex: 1000,
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: theme.colors.stroke,
    ...theme.shadows.glow,
  },
  successRewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconWrapper: {
    backgroundColor: theme.colors.successGreenSoft,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
  },
  successRewardLabel: {
    ...theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text,
    marginLeft: 12,
    textTransform: 'capitalize',
  },
  successCuteCopy: {
    ...theme.typography.body,
    fontStyle: 'italic',
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
    padding: theme.spacing.xs,
    ...theme.shadows.soft,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
    opacity: 0.8,
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
  },
  pinCard: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    padding: theme.spacing.xl,
    paddingTop: 48,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    zIndex: 1000,
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: theme.colors.stroke,
    ...theme.shadows.glow,
  },
  editInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
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
    ...theme.typography.caption,
    color: theme.colors.text,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 10,
    padding: theme.spacing.xs,
  },
});
