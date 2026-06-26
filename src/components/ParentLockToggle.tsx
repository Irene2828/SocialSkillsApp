import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TextInput } from 'react-native';
import { Card } from './Card';
import { Button } from './Button';
import { useProgress } from '../context/ProgressContext';
import { theme } from '../theme';

export const ParentLockToggle: React.FC = () => {
  const { isParentModeUnlocked, parentPin, setParentPin, unlockParentMode, lockParentMode } = useProgress();
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinEntry, setPinEntry] = useState('');
  const [error, setError] = useState('');

  const handleToggle = (value: boolean) => {
    if (value) {
      if (parentPin) {
        setShowPinInput(true);
      } else {
        // No PIN set, so entering setup mode
        setShowPinInput(true);
      }
    } else {
      lockParentMode();
      setShowPinInput(false);
      setPinEntry('');
      setError('');
    }
  };

  const handleSubmitPin = () => {
    if (!parentPin) {
      if (pinEntry.length >= 4) {
        setParentPin(pinEntry);
        unlockParentMode(pinEntry);
        setShowPinInput(false);
        setPinEntry('');
        setError('');
      } else {
        setError('PIN must be at least 4 digits');
      }
    } else {
      const success = unlockParentMode(pinEntry);
      if (success) {
        setShowPinInput(false);
        setPinEntry('');
        setError('');
      } else {
        setError('Incorrect PIN');
      }
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Settings Mode</Text>
          <Text style={styles.description}>Unlock settings and reward editing</Text>
        </View>
        <Switch
          value={isParentModeUnlocked || showPinInput}
          onValueChange={handleToggle}
          trackColor={{ false: theme.colors.neutralGrey, true: theme.colors.primary }}
        />
      </View>

      {showPinInput && !isParentModeUnlocked && (
        <View style={styles.pinContainer}>
          <Text style={styles.pinLabel}>
            {parentPin ? 'Enter PIN to unlock' : 'Create a new PIN (4+ digits)'}
          </Text>
          <TextInput
            style={styles.input}
            value={pinEntry}
            onChangeText={setPinEntry}
            keyboardType="number-pad"
            secureTextEntry
            placeholder="****"
            maxLength={8}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.buttonRow}>
            <Button 
              title="Cancel" 
              variant="secondary" 
              onPress={() => {
                setShowPinInput(false);
                setPinEntry('');
                setError('');
              }} 
              style={styles.cancelButton}
            />
            <Button 
              title="Submit" 
              onPress={handleSubmitPin} 
              style={styles.submitButton}
            />
          </View>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  title: {
    ...theme.typography.heading,
    fontSize: 18,
    marginBottom: theme.spacing.xs,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
  },
  pinContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutralGrey,
  },
  pinLabel: {
    ...theme.typography.body,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.neutralGrey,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    fontSize: 18,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    textAlign: 'center',
  },
  errorText: {
    color: theme.colors.secondaryText, // using neutral fallback instead of red
    marginBottom: theme.spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: theme.spacing.sm,
    minWidth: 100,
  },
  submitButton: {
    minWidth: 100,
  },
});
