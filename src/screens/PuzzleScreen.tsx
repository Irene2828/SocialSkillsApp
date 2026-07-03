import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Modal, useWindowDimensions, Dimensions, Animated, PanResponder } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useRewards } from '../context/RewardsContext';
import { useFeedback } from '../context/FeedbackContext';
import { SilverDust } from '../components/SilverDust';
import { AnimatedCubesBackground } from '../components/AnimatedCubesBackground';

interface PuzzleConfig {
  id: string;
  name: string;
  image: any;
  icon: string;
  cols: number;
  rows: number;
  difficulty: string;
}

const PUZZLES: PuzzleConfig[] = [
  { id: 'p_lion', name: 'Friendly Lion', image: require('../../assets/puzzles/lion.png'), icon: 'paw-outline', cols: 3, rows: 2, difficulty: '6 Pieces' },
  { id: 'p_panda', name: 'Happy Panda', image: require('../../assets/puzzles/panda.png'), icon: 'paw-outline', cols: 3, rows: 3, difficulty: '9 Pieces' },
  { id: 'p_koala', name: 'Sleepy Koala', image: require('../../assets/puzzles/koala.png'), icon: 'paw-outline', cols: 3, rows: 3, difficulty: '9 Pieces' },
  { id: 'p_rabbit', name: 'Fluffy Rabbit', image: require('../../assets/puzzles/rabbit.png'), icon: 'paw-outline', cols: 4, rows: 4, difficulty: '16 Pieces' },
  { id: 'p_monkey', name: 'Cheeky Monkey', image: require('../../assets/puzzles/monkey.png'), icon: 'paw-outline', cols: 4, rows: 4, difficulty: '16 Pieces' },
  { id: 'p_fox', name: 'Clever Fox', image: require('../../assets/puzzles/fox.png'), icon: 'paw-outline', cols: 4, rows: 6, difficulty: '24 Pieces' },
];


const DraggablePiece = ({
  piece,
  index,
  selectedPuzzle,
  boardSize,
  onSwap,
}: {
  piece: any;
  index: number;
  selectedPuzzle: PuzzleConfig;
  boardSize: number;
  onSwap: (fromIndex: number, toIndex: number) => void;
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [zIndex, setZIndex] = useState(1);
  const colWidth = boardSize / selectedPuzzle.cols;
  const rowHeight = boardSize / selectedPuzzle.rows;

  const origCol = piece.correctIndex % selectedPuzzle.cols;
  const origRow = Math.floor(piece.correctIndex / selectedPuzzle.cols);
  const curCol = index % selectedPuzzle.cols;
  const curRow = Math.floor(index / selectedPuzzle.cols);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setZIndex(100);
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gesture) => {
        setZIndex(1);
        const dropX = curCol * colWidth + gesture.dx + colWidth / 2;
        const dropY = curRow * rowHeight + gesture.dy + rowHeight / 2;
        
        const targetCol = Math.floor(dropX / colWidth);
        const targetRow = Math.floor(dropY / rowHeight);
        
        if (targetCol >= 0 && targetCol < selectedPuzzle.cols && targetRow >= 0 && targetRow < selectedPuzzle.rows) {
          const targetIndex = targetRow * selectedPuzzle.cols + targetCol;
          if (targetIndex !== index) {
            onSwap(index, targetIndex);
          }
        }
        
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    pan.setValue({ x: 0, y: 0 });
  }, [index, pan]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.pieceContainer,
        {
          width: colWidth,
          height: rowHeight,
          left: curCol * colWidth,
          top: curRow * rowHeight,
          zIndex,
          transform: pan.getTranslateTransform(),
          borderColor: '#E5E7EB',
          borderWidth: 1,
        },
      ]}
    >
      <Image
        source={selectedPuzzle.image}
        style={{
          width: boardSize,
          height: boardSize,
          position: 'absolute',
          left: -origCol * colWidth,
          top: -origRow * rowHeight,
        }}
        resizeMode="cover"
      />
    </Animated.View>
  );
};

export const PuzzleScreen = () => {
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleConfig | null>(null);
  const [pieces, setPieces] = useState<{ id: number; correctIndex: number; currentIndex: number }[]>([]);
  
  const [isSolved, setIsSolved] = useState(false);
  const shakeNextAnim = useRef(new Animated.Value(0)).current;

  const { width: screenWidth } = useWindowDimensions();
  const boardSize = Math.min(screenWidth - 48, 400);

  // Scramble the puzzle pieces
  const startPuzzle = (puzzle: PuzzleConfig) => {
    const totalPieces = puzzle.cols * puzzle.rows;
    let initialPieces = Array.from({ length: totalPieces }, (_, i) => ({
      id: i,
      correctIndex: i,
      currentIndex: i,
    }));

    // Scramble logic
    let scrambled = [...initialPieces];
    do {
      scrambled.sort(() => Math.random() - 0.5);
    } while (isAlreadySolved(scrambled)); // ensure it's not solved at start

    // Update current index maps
    scrambled = scrambled.map((p, idx) => ({
      ...p,
      currentIndex: idx,
    }));

    setPieces(scrambled);
    setIsSolved(false);
    setSelectedPuzzle(puzzle);
  };

  const isAlreadySolved = (arr: any[]) => {
    return arr.every((p, idx) => p.correctIndex === idx);
  };

  
  const handleSwapPieces = (fromIndex: number, toIndex: number) => {
    if (isSolved) return;

    const newPieces = [...pieces];
    const pieceA = newPieces[fromIndex];
    const pieceB = newPieces[toIndex];

    newPieces[fromIndex] = { ...pieceB, currentIndex: fromIndex };
    newPieces[toIndex] = { ...pieceA, currentIndex: toIndex };

    setPieces(newPieces);

    const solved = newPieces.every((p) => p.correctIndex === p.currentIndex);
    if (solved) {
      setIsSolved(true);
    }
  };

  const handleNextPuzzle = () => {
    if (!selectedPuzzle) return;
    const currentIndex = PUZZLES.findIndex(p => p.id === selectedPuzzle.id);
    if (currentIndex === -1 || currentIndex === PUZZLES.length - 1) {
      Animated.sequence([
        Animated.timing(shakeNextAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeNextAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeNextAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeNextAnim, { toValue: 0, duration: 50, useNativeDriver: true })
      ]).start();
    } else {
      startPuzzle(PUZZLES[currentIndex + 1]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedCubesBackground />
      <ScreenWrapper transparent>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Header title="Solve a Puzzle" style={{ marginBottom: theme.spacing.md, marginTop: 4 }} />
          
          <View style={styles.grid}>
            {PUZZLES.map((puzzle) => (
              <Pressable
                key={puzzle.id}
                style={styles.card}
                onPress={() => startPuzzle(puzzle)}
              >
                <View style={styles.cardIconContainer}>
                  <Ionicons name={puzzle.icon as any} size={32} color={theme.colors.secondaryText} />
                </View>
                <Text style={styles.cardName}>{puzzle.name}</Text>
                <Text style={styles.cardDifficulty}>{puzzle.difficulty}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </ScreenWrapper>

      {/* Puzzle Board Modal */}
      <Modal
        visible={selectedPuzzle !== null}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setSelectedPuzzle(null)}
      >
        <View style={{ flex: 1, backgroundColor: '#F0F1F3' }}>
          <AnimatedCubesBackground />
          <ScreenWrapper transparent>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, zIndex: 2, paddingHorizontal: 16, marginTop: 16 }}>
              <Pressable style={styles.backButton} onPress={() => setSelectedPuzzle(null)}>
                <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                <Text style={{ marginLeft: 4, ...theme.typography.button, color: theme.colors.text }}>Back</Text>
              </Pressable>
              <View style={[styles.screenFolderTab, { position: 'relative', top: 0, right: 0, left: 'auto' }]}>
                <Text style={styles.screenFolderTabText} numberOfLines={1}>Puzzle: {selectedPuzzle?.name}</Text>
              </View>
            </View>

            <View style={styles.gameContent}>
              {selectedPuzzle && (
                <>
                  <Text style={styles.headlineText}>Drag the pieces to solve a puzzle!</Text>
                  <View
                    style={[
                      styles.board,
                    {
                      width: boardSize,
                      height: boardSize,
                    },
                  ]}
                >
                  {pieces.map((piece, index) => (
                    <DraggablePiece
                      key={piece.id}
                      piece={piece}
                      index={index}
                      selectedPuzzle={selectedPuzzle}
                      boardSize={boardSize}
                      onSwap={handleSwapPieces}
                    />
                  ))}
                  </View>
                </>
              )}

              {isSolved && (
                <View style={styles.celebrationCard}>
                  <SilverDust />
                  <View style={styles.titleContainer}>
                    <Text style={styles.celebrationText}>Awesome!</Text>
                    <View style={styles.brushUnderline} />
                  </View>
                  <Button
                    title="Play More!"
                    onPress={() => setSelectedPuzzle(null)}
                    style={{ width: '80%', marginTop: theme.spacing.lg }}
                  />
                </View>
              )}
            </View>
          </ScreenWrapper>
          <Animated.View style={{
            position: 'absolute',
            bottom: 32,
            right: 16,
            transform: [{ translateX: shakeNextAnim }]
          }}>
            <Pressable style={styles.backButton} onPress={handleNextPuzzle}>
              <Text style={{ marginRight: 4, ...theme.typography.button, color: theme.colors.text }}>Next Puzzle</Text>
              <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xs,
  },
  card: {
    width: '48%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    ...theme.shadows.soft,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: '#F7FEE7',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardIcon: {
    fontSize: 32,
  },
  cardName: {
    ...theme.typography.button,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '700',
  },
  cardDifficulty: {
    ...theme.typography.caption,
    color: theme.colors.secondaryText,
    textAlign: 'center',
    marginTop: 4,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  screenFolderTab: {
    minWidth: 120,
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 0,
    borderRadius: 0,
  },
  screenFolderTabText: {
    ...theme.typography.body,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.1,
    color: theme.colors.text,
  },
  headlineText: {
    ...theme.typography.subheading,
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  gameContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60, // Shift up slightly
  },
  board: {
    position: 'relative',
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.stroke,
  },
  pieceContainer: {
    position: 'absolute',
    overflow: 'hidden',
  },
  celebrationCard: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    zIndex: 100,
  },
  celebrationText: {
    ...theme.typography.heading,
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 0,
  },
  celebrationSub: {
    ...theme.typography.body,
    textAlign: 'center',
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  titleContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  brushUnderline: {
    position: 'absolute',
    bottom: -4,
    left: '2%',
    right: '2%',
    height: 5.5,
    backgroundColor: '#BEF264',
    borderRadius: 4,
    transform: [{ rotate: '-1.5deg' }],
    zIndex: -1,
  },
});
