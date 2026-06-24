import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { theme } from '../theme';

export const SettingsScreen = () => {
  return (
    <ScreenWrapper>
      <Header title="Settings" />
      <View style={styles.content}>
        <Text style={styles.placeholderText}>Settings coming soon</Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
  },
});
