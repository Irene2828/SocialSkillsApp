import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { NewQuizScreen } from './NewQuizScreen';
import { MyRewardsScreen } from './MyRewardsScreen';
import { SettingsScreen } from './SettingsScreen';
import { QuestionView } from '../components/QuestionView';
import { Question } from '../data/types';
import { theme } from '../theme';

interface ReviewComment {
  id: string;
  x: number;
  y: number;
  text: string;
}

interface Outline {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const DesignReviewScreen = () => {
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [draft, setDraft] = useState<ReviewComment | null>(null);
  
  const [mode, setMode] = useState<'comment' | 'outline'>('comment');
  const [outlines, setOutlines] = useState<Outline[]>([]);
  const [activeOutline, setActiveOutline] = useState<Outline | null>(null);

  const mockQuestion: Question = {
    id: 'mock-1',
    category: 'Friendship',
    difficulty: 'Easy',
    scenario: 'Your friend drops their books in the hallway.',
    options: ['Laugh at them', 'Help them pick them up', 'Walk away', 'Kick the books'],
    correctAnswerIndex: 1,
    explanation: 'Helping a friend shows you care and builds strong friendships.'
  };

  const handleResponderGrant = (e: any) => {
    const { locationX, locationY } = e.nativeEvent;
    if (mode === 'comment') {
      if (draft) {
        if (draft.text.trim()) setComments([...comments, draft]);
        setDraft(null);
        return;
      }
      setDraft({ id: Date.now().toString(), x: locationX, y: locationY, text: '' });
    } else {
      setActiveOutline({
        id: Date.now().toString(),
        startX: locationX,
        startY: locationY,
        endX: locationX,
        endY: locationY,
      });
    }
  };

  const handleResponderMove = (e: any) => {
    if (mode === 'outline' && activeOutline) {
      const { locationX, locationY } = e.nativeEvent;
      setActiveOutline({ ...activeOutline, endX: locationX, endY: locationY });
    }
  };

  const handleResponderRelease = () => {
    if (mode === 'outline' && activeOutline) {
      setOutlines([...outlines, activeOutline]);
      setActiveOutline(null);
    }
  };

  const handleDraftComplete = () => {
    if (draft && draft.text.trim()) {
      setComments([...comments, draft]);
    }
    setDraft(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Design Review Board</Text>
      
      <View style={styles.toolbar}>
        <Pressable 
          style={[styles.toolButton, mode === 'comment' && styles.toolButtonActive]}
          onPress={() => setMode('comment')}
        >
          <Text style={styles.toolText}>📍 Comment Mode</Text>
        </Pressable>
        <Pressable 
          style={[styles.toolButton, mode === 'outline' && styles.toolButtonActive]}
          onPress={() => setMode('outline')}
        >
          <Text style={styles.toolText}>✂️ Remove Outline Mode</Text>
        </Pressable>
      </View>
      <Text style={styles.subtext}>
        {mode === 'comment' ? "Tap anywhere to drop a comment pin!" : "Drag to draw a red outline over elements to remove."}
      </Text>
      
      <View 
        onStartShouldSetResponder={() => true}
        onResponderGrant={handleResponderGrant}
        onResponderMove={handleResponderMove}
        onResponderRelease={handleResponderRelease}
        style={styles.responderOverlay}
      >
        <View pointerEvents="none" style={styles.screensContainer}>
          <View style={styles.screenWrapper}>
            <Text style={styles.label}>1. New Quiz (Home)</Text>
            <View style={styles.screenBox}>
              <NewQuizScreen />
            </View>
          </View>

          <View style={styles.screenWrapper}>
            <Text style={styles.label}>2. My Rewards</Text>
            <View style={styles.screenBox}>
              <MyRewardsScreen />
            </View>
          </View>

          <View style={styles.screenWrapper}>
            <Text style={styles.label}>3. Settings</Text>
            <View style={styles.screenBox}>
              <SettingsScreen />
            </View>
          </View>

          <View style={styles.screenWrapper}>
            <Text style={styles.label}>4. Active Quiz Question</Text>
            <View style={styles.screenBox}>
              <View style={{ flex: 1, backgroundColor: '#FAFAF8', padding: 16, paddingTop: 40 }}>
                <QuestionView 
                  question={mockQuestion} 
                  onContinue={() => {}} 
                />
              </View>
            </View>
          </View>
        </View>

        {outlines.map(o => {
          const left = Math.min(o.startX, o.endX);
          const top = Math.min(o.startY, o.endY);
          const width = Math.abs(o.endX - o.startX);
          const height = Math.abs(o.endY - o.startY);
          return (
            <View key={o.id} style={[styles.outlineBox, { left, top, width, height }]} />
          );
        })}

        {activeOutline && (
          <View style={[styles.outlineBox, {
            left: Math.min(activeOutline.startX, activeOutline.endX),
            top: Math.min(activeOutline.startY, activeOutline.endY),
            width: Math.abs(activeOutline.endX - activeOutline.startX),
            height: Math.abs(activeOutline.endY - activeOutline.startY),
          }]} />
        )}

        {comments.map(c => (
          <View 
            key={c.id} 
            style={[styles.commentPin, { left: c.x, top: c.y }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.pinDot} />
            <View style={styles.commentBubble}>
              <Text style={styles.commentText}>{c.text}</Text>
            </View>
          </View>
        ))}

        {draft && (
          <View 
            style={[styles.commentPin, { left: draft.x, top: draft.y }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.pinDot} />
            <View style={styles.draftBubble}>
              <TextInput
                autoFocus
                value={draft.text}
                onChangeText={t => setDraft({ ...draft, text: t })}
                onSubmitEditing={handleDraftComplete}
                style={styles.draftInput}
                placeholder="Type comment & press Enter"
                placeholderTextColor={theme.colors.secondaryText}
              />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: '#1E293B', // Dark slate for contrast
    alignItems: 'center',
    minHeight: '100%',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  toolbar: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  toolButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#334155',
    borderRadius: 8,
  },
  toolButtonActive: {
    backgroundColor: '#3B82F6',
  },
  toolText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  subtext: {
    fontSize: 18,
    color: theme.colors.accent,
    marginBottom: 40,
  },
  responderOverlay: {
    width: '100%',
    position: 'relative',
  },
  screensContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 40,
  },
  screenWrapper: {
    marginBottom: 0,
    alignItems: 'center',
  },
  label: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  screenBox: {
    width: 390,
    height: 844, // standard iPhone height
    backgroundColor: 'white',
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 8,
    borderColor: '#0F172A',
  },
  outlineBox: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#EF4444', // Red-500
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    zIndex: 90,
  },
  commentPin: {
    position: 'absolute',
    alignItems: 'flex-start',
    zIndex: 100,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EAB308',
    borderWidth: 3,
    borderColor: 'white',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    ...theme.shadows.soft,
  },
  commentBubble: {
    backgroundColor: '#EAB308',
    padding: 12,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    maxWidth: 250,
    marginTop: -8,
    ...theme.shadows.soft,
  },
  commentText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  draftBubble: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    marginTop: -8,
    borderWidth: 2,
    borderColor: '#EAB308',
    ...theme.shadows.soft,
  },
  draftInput: {
    minWidth: 200,
    fontSize: 16,
    color: '#000',
  }
});
