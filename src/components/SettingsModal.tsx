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
    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(2, 8, 18, 0.72)', zIndex: 9999, elevation: 9999, justifyContent: 'center', alignItems: 'center' }]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={styles.modalCard}>
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
              trackColor={{ false: 'rgba(255, 255, 255, 0.14)', true: theme.colors.primary }}
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
                placeholderTextColor="rgba(255,255,255,0.44)"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={6}
              />
              <Button 
                title="Save Settings"
                onPress={handleSavePin}
                style={{ width: '100%', marginTop: theme.spacing.md }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalCard: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: 'rgba(255, 255, 255, 0.075)',
    borderRadius: theme.borderRadius.md,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    shadowOpacity: 0,
    elevation: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.heading,
    fontSize: 24,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  scrollContent: {
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
    fontWeight: '600',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.md,
  },
  pinRow: {
    flexDirection: 'column',
  },
  pinInput: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text,
  }
});
