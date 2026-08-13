import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions, Modal } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlobalBackground } from '../components/GlobalBackground';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { theme, FONTS } from '../theme';
import { ConstellationTracerOverlay } from '../components/ConstellationTracerOverlay';
import { AppTabBar } from '../components/AppTabBar';
import { Ionicons } from '@expo/vector-icons';

interface TracingScreenProps {
  onBackToGames: () => void;
  embed?: boolean;
}

export type LetterMode = 'print' | 'cursive';
export type LetterLang = 'eng' | 'ukr';
export type TracingActiveFolder = 'none' | 'constellations' | 'abc' | 'digits';

export const TracingMenuScreen: React.FC<TracingScreenProps> = ({ onBackToGames, embed = false }) => {
  const [activeFolder, setActiveFolder] = useState<TracingActiveFolder>('none');
  const [letterMode, setLetterMode] = useState<LetterMode>('print');
  const [letterLang, setLetterLang] = useState<LetterLang>('eng');

  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = Math.min(screenWidth, 700);
  const paddingH = 12;
  const numColumns = 2;
  const cardWidth = Math.floor((contentWidth - (paddingH * 2) - (16 * (numColumns - 1))) / numColumns);

  const content = (
    <>
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

        {/* Row 2: Digits */}
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

      <Modal
        visible={activeFolder !== 'none'}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setActiveFolder('none')}
      >
        <ConstellationTracerOverlay 
          mode={activeFolder === 'none' ? undefined : activeFolder}
          letterMode={letterMode}
          letterLang={letterLang}
          onModeChange={(newMode) => setLetterMode(newMode)}
          onLangChange={(newLang) => setLetterLang(newLang)}
          onClose={() => setActiveFolder('none')} 
        />
      </Modal>
    </>
  );

  if (embed) {
    return content;
  }

  return (
    <View style={{ flex: 1 }}>
      <GlobalBackground />
      <ScreenWrapper transparent>
        {content}
      </ScreenWrapper>
      <AppTabBar activeRoute="Games" isFabActive={false} navContext="Passive" />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 95,
  },
  folderCard: {
    width: '100%',
    height: 158,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md / 2,
    paddingBottom: theme.spacing.md / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconContainer: {
    marginBottom: 4,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardName: {
    ...theme.typography.body,
    color: '#0C4A6E',
    textAlign: 'center',
    fontWeight: '400',
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
