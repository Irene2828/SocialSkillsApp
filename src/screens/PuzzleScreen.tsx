import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Modal, useWindowDimensions, Animated, PanResponder } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCubesBackground } from '../components/AnimatedCubesBackground';
import { SilverDust } from '../components/SilverDust';

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
  const curCol = piece.currentIndex % selectedPuzzle.cols;
  const curRow = Math.floor(piece.currentIndex / selectedPuzzle.cols);

  // Store mutable refs so the PanResponder closure always reads fresh values
  const latestRef = useRef({ curCol, curRow, currentIndex: piece.currentIndex, onSwap, colWidth, rowHeight, cols: selectedPuzzle.cols, rows: selectedPuzzle.rows });
  latestRef.current = { curCol, curRow, currentIndex: piece.currentIndex, onSwap, colWidth, rowHeight, cols: selectedPuzzle.cols, rows: selectedPuzzle.rows };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setZIndex(100);
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_e, gesture) => {
        setZIndex(1);
        const { curCol: cc, curRow: cr, currentIndex, onSwap: swap, colWidth: cw, rowHeight: rh, cols, rows } = latestRef.current;
        const dropX = cc * cw + gesture.dx + cw / 2;
        const dropY = cr * rh + gesture.dy + rh / 2;
        
        const targetCol = Math.floor(dropX / cw);
        const targetRow = Math.floor(dropY / rh);
        
        if (targetCol >= 0 && targetCol < cols && targetRow >= 0 && targetRow < rows) {
          const targetIndex = targetRow * cols + targetCol;
          if (targetIndex !== currentIndex) {
            swap(currentIndex, targetIndex);
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
  }, [piece.currentIndex, pan]);

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
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [pieces, setPieces] = useState<{ id: number; correctIndex: number; currentIndex: number }[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const shakeNextAnim = useRef(new Animated.Value(0)).current;

  const { width: screenWidth } = useWindowDimensions();
  const boardSize = Math.min(screenWidth - 48, 400);

  const startPuzzle = (puzzle: PuzzleConfig) => {
    const totalPieces = puzzle.cols * puzzle.rows;
    let initialPieces = Array.from({ length: totalPieces }, (_, i) => ({
      id: i,
      correctIndex: i,
      currentIndex: i,
    }));

    let scrambled = [...initialPieces];
    do {
      scrambled.sort(() => Math.random() - 0.5);
      scrambled.forEach((p, idx) => {
        p.currentIndex = idx;
      });
    } while (isAlreadySolved(scrambled));

    scrambled = scrambled.map((p, idx) => ({
      ...p,
      currentIndex: idx,
    }));

    setPieces(scrambled);
    setIsSolved(false);
    setSelectedPuzzle(puzzle);
  };

  const isAlreadySolved = (arr: any[]) => {
    return arr.every((p, idx) => p.correctIndex === p.currentIndex);
  };

  const handleSwapPieces = (fromIndex: number, toIndex: number) => {
    if (isSolved) return;

    setPieces((prev) => {
      const next = [...prev];
      const fromPos = next.findIndex((p) => p.currentIndex === fromIndex);
      const toPos = next.findIndex((p) => p.currentIndex === toIndex);

      if (fromPos === -1 || toPos === -1) return prev;

      const temp = next[fromPos].currentIndex;
      next[fromPos].currentIndex = next[toPos].currentIndex;
      next[toPos].currentIndex = temp;

      if (isAlreadySolved(next)) {
        setIsSolved(true);
      }

      return next;
    });
  };

  const changeDifficulty = (piecesCount: number) => {
    if (!selectedPuzzle) return;
    let newCols, newRows;
    switch(piecesCount) {
        case 4: newCols = 2; newRows = 2; break;
        case 9: newCols = 3; newRows = 3; break;
        case 16: newCols = 4; newRows = 4; break;
        case 24: newCols = 4; newRows = 6; break;
        default: return;
    }
    const updatedPuzzle = { ...selectedPuzzle, cols: newCols, rows: newRows, difficulty: `${piecesCount} Pieces` };
    startPuzzle(updatedPuzzle);
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
                <View style={[styles.cardIconContainer, { overflow: 'hidden' }]}>
                  <Image source={puzzle.image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                </View>
                <Text style={styles.cardName}>{puzzle.name}</Text>
              </Pressable>
            ))}
          </View>
          
          <View style={styles.createAiButtonContainer}>
            <Button
              title="Create New Puzzle"
              style={styles.createAiButton}
              onPress={() => setShowAiMenu(true)}
            />
          </View>
        </ScrollView>
      </ScreenWrapper>

      {/* AI Puzzle creation menu modal */}
      <Modal visible={showAiMenu} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => setShowAiMenu(false)}>
          <View style={[styles.modalOverlay, { padding: 0 }]}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
              <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl, minHeight: '100%' }} onPress={() => setShowAiMenu(false)}>
                <Pressable style={styles.uploadCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
                  <Text style={styles.levelTitle}>Create AI Puzzle</Text>
                  <Text style={[styles.questionCaption, { marginBottom: theme.spacing.lg, paddingHorizontal: 16 }]}>
                    Upload a page or take a photo, and AI will turn it into a fun puzzle.
                  </Text>
                  
                  <View style={styles.iconContainer}>
                    <Ionicons name="camera-outline" size={64} color={theme.colors.primary} />
                  </View>
                  
                  <Button 
                    title="Take Photo" 
                    onPress={() => { setShowAiMenu(false); alert('AI Puzzle feature coming soon!'); }} 
                    style={styles.uploadButton}
                  />
                  
                  <Button 
                    title="Upload Image" 
                    onPress={() => { setShowAiMenu(false); alert('AI Puzzle feature coming soon!'); }} 
                    style={[styles.uploadButton, { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.stroke }]}
                  />
                  <Text style={styles.supportedText}>Supports JPG, PNG</Text>
                </Pressable>
              </Pressable>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

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
                  <View style={styles.difficultySelector}>
                    {[4, 9, 16, 24].map((num) => {
                      const isSelected = selectedPuzzle.cols * selectedPuzzle.rows === num;
                      return (
                        <Pressable 
                          key={num} 
                          style={[styles.diffBtn, isSelected && styles.diffBtnSelected]}
                          onPress={() => changeDifficulty(num)}
                        >
                          <Text style={[styles.diffBtnText, isSelected && styles.diffBtnTextSelected]}>{num}</Text>
                        </Pressable>
                      );
                    })}
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
                    style={{ marginTop: theme.spacing.lg, paddingHorizontal: 48 }}
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
    bottom: -8,
    left: '2%',
    right: '2%',
    height: 5.5,
    backgroundColor: '#BEF264',
    borderRadius: 4,
    transform: [{ rotate: '-1.5deg' }],
    zIndex: -1,
  },
  difficultySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  diffBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.stroke,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diffBtnSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  diffBtnText: {
    ...theme.typography.button,
    fontSize: 18,
    color: theme.colors.secondaryText,
  },
  diffBtnTextSelected: {
    color: theme.colors.text,
  },
  createAiButtonContainer: {
    width: '100%',
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  createAiButton: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  uploadCard: {
    width: '100%',
    maxWidth: 500,
    padding: theme.spacing.xl,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.neutralGrey,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.md,
  },
  levelTitle: {
    ...theme.typography.subheading,
    marginBottom: theme.spacing.md,
  },
  questionCaption: {
    ...theme.typography.caption,
    textAlign: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
    ...theme.shadows.soft,
  },
  uploadButton: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  supportedText: {
    ...theme.typography.caption,
    marginTop: theme.spacing.xs,
    color: theme.colors.secondaryText,
    textAlign: 'center',
  },
});
