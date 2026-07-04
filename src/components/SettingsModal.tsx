import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useMood, MoodType } from '../context/MoodContext';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { mood, setMood } = useMood();
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
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
  }, [visible, fadeAnim]);

  if (!visible) return null;

  const moods: { id: MoodType; title: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
    { id: 'botanical', title: 'Botanical', icon: 'leaf-outline', color: '#8FBC8F' }, // Muted green
    { id: 'celestial', title: 'Celestial', icon: 'moon-outline', color: '#B19CD9' }, // Muted purple
    { id: 'astronaut', title: 'Astronaut', icon: 'planet-outline', color: '#775B7B' }, // Deep muted violet
    { id: 'rocket', title: 'Rocket', icon: 'rocket-outline', color: '#708090' }, // Slate grey blue
  ];

  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.scrollContent}>
            <Text style={styles.sectionTitle}>App Mood</Text>
            <Text style={styles.sectionSubtitle}>Choose your vibe for learning</Text>
            
            <View style={styles.moodGrid}>
              {moods.map(m => (
                <Pressable
                  key={m.id}
                  style={[
                    styles.moodCard,
                    mood === m.id && styles.moodCardActive,
                    mood === m.id && { borderColor: m.color }
                  ]}
                  onPress={() => setMood(m.id)}
                >
                  <View style={[styles.iconContainer, { backgroundColor: m.color + '20' }]}>
                    <Ionicons name={m.icon} size={32} color={m.color} />
                  </View>
                  <Text style={[styles.moodTitle, mood === m.id && { color: m.color }]}>
                    {m.title}
                  </Text>
                  {mood === m.id && (
                    <View style={[styles.activeCheck, { backgroundColor: m.color }]}>
                      <Ionicons name="checkmark" size={12} color="#FFF" />
                    </View>
                  )}
                </Pressable>
              ))}
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    ...theme.typography.subheading,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.lg,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  moodCard: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  moodCardActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  moodTitle: {
    ...theme.typography.caption,
    fontWeight: '600',
    textAlign: 'center',
    color: theme.colors.text,
  },
  activeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
