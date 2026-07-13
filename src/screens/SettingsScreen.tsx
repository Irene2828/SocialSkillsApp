import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TextInput } from 'react-native';
import { theme } from '../theme';
import { useRewards } from '../context/RewardsContext';
import { Button } from '../components/Button';
import { ScreenWrapper } from '../components/ScreenWrapper';

export const SettingsScreen = () => {
  const { isRewardsModeOn, setIsRewardsModeOn, parentsPin, setParentsPin } = useRewards();
  const [localPin, setLocalPin] = useState(parentsPin);

  const handleSavePin = () => {
    setParentsPin(localPin);
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
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
              style={{ width: '100%', marginTop: theme.spacing.md }}
            />
          </View>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.xl,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.heading,
    fontSize: 28,
    color: theme.colors.text,
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
    flexDirection: 'column',
  },
  pinInput: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: theme.colors.stroke,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    fontSize: 18,
  }
});
