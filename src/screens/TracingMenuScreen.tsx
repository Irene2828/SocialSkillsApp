import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlobalBackground } from '../components/GlobalBackground';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { theme, FONTS } from '../theme';
import { ConstellationTracerOverlay } from '../components/ConstellationTracerOverlay';
import { Ionicons } from '@expo/vector-icons';

interface TracingScreenProps {
  onBackToGames: () => void;
}

export type LetterMode = 'print' | 'cursive';
export type LetterLang = 'eng' | 'ukr';

export const TracingMenuScreen: React.FC<TracingScreenProps> = ({ onBackToGames }) => {
  const [activeFolder, setActiveFolder] = useState<'none' | 'constellations' | 'abc' | 'digits'>('none');
  const [letterMode, setLetterMode] = useState<LetterMode>('print');
  const [letterLang, setLetterLang] = useState<LetterLang>('eng');

  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = Math.min(screenWidth, 700);
  const paddingH = 12;
  const numColumns = 2;
  const cardWidth = Math.floor((contentWidth - (paddingH * 2) - (16 * (numColumns - 1))) / numColumns);

  if (activeFolder !== 'none') {
    return (
      <ConstellationTracerOverlay 
        mode={activeFolder}
        letterMode={letterMode}
        letterLang={letterLang}
        onModeChange={(newMode) => setLetterMode(newMode)}
        onLangChange={(newLang) => setLetterLang(newLang)}
        onClose={() => setActiveFolder('none')} 
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <GlobalBackground />
      <ScreenWrapper transparent>
        <TopBar
          title="Tracing"
          showSettingsAndRewards={true}
          onBack={onBackToGames}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: 12 }]}>
          {/* Row 1: Constellations & ABC Letters */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.md }}>
            <Pressable style={{ width: cardWidth }} onPress={() => setActiveFolder('constellations')}>
              <Card style={styles.folderCard}>
                <View style={[styles.cardIconContainer, { backgroundColor: '#E0F2FE' }]}>
                  <Text style={{ fontSize: 40 }}>✨</Text>
                </View>
                <Text style={styles.cardName} numberOfLines={2}>Constellations</Text>
              </Card>
            </Pressable>

            <Pressable style={{ width: cardWidth }} onPress={() => setActiveFolder('abc')}>
              <Card style={styles.folderCard}>
                <View style={[styles.cardIconContainer, { backgroundColor: '#FEF08A' }]}>
                  <Text style={{ fontSize: 40 }}>🔤</Text>
                </View>
                <Text style={styles.cardName} numberOfLines={2}>ABC Letters</Text>
              </Card>
            </Pressable>
          </View>

          {/* Row 2: Digits 1 to 10 */}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: theme.spacing.xl }}>
            <Pressable style={{ width: cardWidth }} onPress={() => setActiveFolder('digits')}>
              <Card style={styles.folderCard}>
                <View style={[styles.cardIconContainer, { backgroundColor: '#FBCFE8' }]}>
                  <Text style={{ fontSize: 40 }}>🔢</Text>
                </View>
                <Text style={styles.cardName} numberOfLines={2}>Digits 1 to 10</Text>
              </Card>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 95,
  },
  folderCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    height: 140,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardName: {
    ...theme.typography.body,
    fontFamily: FONTS.medium,
    fontWeight: '500',
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  topRightToggles: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toggleChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  toggleChipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderColor: '#FFFFFF',
  },
  toggleText: {
    color: '#FFFFFF',
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
});
