import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView, Animated, Switch, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useRewards } from '../context/RewardsContext';
import { Button } from './Button';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { isRewardsModeOn, setIsRewardsModeOn, parentsPin, setParentsPin } = useRewards();
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // Local state for pin before saving
  const [localPin, setLocalPin] = useState(parentsPin);

  React.useEffect(() => {
    if (visible) {
      setLocalPin(parentsPin);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim, parentsPin]);

  if (!visible) return null;

  const handleSavePin = () => {
    setParentsPin(localPin);
    // You could also add a toast here for "Saved"
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={theme.colors.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: theme.spacing.xxl }}>
            
            {/* Rewards Mode Toggle */}
            <View style={styles.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>Rewards Mode</Text>
                <Text style={styles.settingDescription}>When ON, quizzes grant coins.</Text>
              </View>
              <Switch
                value={isRewardsModeOn}
                onValueChange={setIsRewardsModeOn}
                trackColor={{ false: '#D1D5DB', true: theme.colors.primary }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            {/* Parents Pin */}
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>Parents' PIN</Text>
              <Text style={styles.settingDescription}>Set a PIN to lock settings or edit modes in the future.</Text>
              
              <View style={styles.pinRow}>
                <TextInput
                  style={styles.pinInput}
                  value={localPin}
                  onChangeText={setLocalPin}
                  placeholder="Enter PIN"
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={6}
                />
                <Button 
                  title="Save"
                  onPress={handleSavePin}
                  style={{ paddingHorizontal: theme.spacing.lg }}
                />
              </View>
            </View>

          </ScrollView>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.xl,
    paddingTop: 60,
  },
  headerTitle: {
    ...theme.typography.heading,
    fontSize: 28,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.stroke,
    marginBottom: theme.spacing.lg,
  },
  settingSection: {
    paddingVertical: theme.spacing.md,
  },
  settingLabel: {
    ...theme.typography.body,
    fontWeight: '700',
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.md,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  pinInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: theme.colors.stroke,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    fontSize: 18,
  }
});
