import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Modal, useWindowDimensions, Animated, PanResponder, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { safeStorage } from '../utils/storage';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { GlobalBackground } from '../components/GlobalBackground';
import { SimpleLockScreen } from '../components/SimpleLockScreen';
import { SettingsModal } from '../components/SettingsModal';
import { SilverDust } from '../components/SilverDust';
import { useMood, getMoodColors } from '../context/MoodContext';

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
  { id: 'p_fox', name: 'Clever Fox', image: require('../../assets/puzzles/fox.png'), icon: 'paw-outline', cols: 5, rows: 5, difficulty: '25 Pieces' },
  { id: 'p_elephant', name: 'Baby Elephant', image: require('../../assets/puzzles/elephant.png'), icon: 'paw-outline', cols: 3, rows: 2, difficulty: '6 Pieces' },
  { id: 'p_giraffe', name: 'Happy Giraffe', image: require('../../assets/puzzles/giraffe.png'), icon: 'paw-outline', cols: 3, rows: 3, difficulty: '9 Pieces' },
  { id: 'p_penguin', name: 'Waving Penguin', image: require('../../assets/puzzles/penguin.png'), icon: 'paw-outline', cols: 3, rows: 3, difficulty: '9 Pieces' },
  { id: 'p_turtle', name: 'Sea Turtle', image: require('../../assets/puzzles/turtle.png'), icon: 'paw-outline', cols: 4, rows: 4, difficulty: '16 Pieces' },
  { id: 'p_tiger', name: 'Tiger Cub', image: require('../../assets/puzzles/tiger.png'), icon: 'paw-outline', cols: 4, rows: 4, difficulty: '16 Pieces' },
  { id: 'p_dolphin', name: 'Jumping Dolphin', image: require('../../assets/puzzles/dolphin.png'), icon: 'paw-outline', cols: 5, rows: 5, difficulty: '25 Pieces' },
  { id: 'p_owl', name: 'Wise Owl', image: require('../../assets/puzzles/owl.png'), icon: 'paw-outline', cols: 3, rows: 2, difficulty: '6 Pieces' },
  { id: 'p_bear', name: 'Cuddly Bear', image: require('../../assets/puzzles/bear.png'), icon: 'paw-outline', cols: 3, rows: 3, difficulty: '9 Pieces' },
  { id: 'p_hippo', name: 'Baby Hippo', image: require('../../assets/puzzles/hippo.png'), icon: 'paw-outline', cols: 4, rows: 4, difficulty: '16 Pieces' },
  { id: 'p_zebra', name: 'Smiling Zebra', image: require('../../assets/puzzles/zebra.png'), icon: 'paw-outline', cols: 5, rows: 5, difficulty: '25 Pieces' },
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
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const isRocket = mood === 'rocket';

  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleConfig | null>(null);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [pieces, setPieces] = useState<{ id: number; correctIndex: number; currentIndex: number }[]>([]);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [actionMenuPuzzle, setActionMenuPuzzle] = useState<PuzzleConfig | null>(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameTitle, setRenameTitle] = useState('');
  const [showDeletePin, setShowDeletePin] = useState(false);
  const [deletePin, setDeletePin] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };
  const [isSolved, setIsSolved] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customPuzzles, setCustomPuzzles] = useState<PuzzleConfig[]>([]);
  const [hiddenPuzzles, setHiddenPuzzles] = useState<string[]>([]);
  const shakeNextAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadPuzzles = async () => {
      const storedCustom = await safeStorage.get<PuzzleConfig[]>('@custom_puzzles', []);
      const storedHidden = await safeStorage.get<string[]>('@hidden_puzzles', []);
      setCustomPuzzles(storedCustom);
      setHiddenPuzzles(storedHidden);
    };
    loadPuzzles();
  }, []);

  const allPuzzles = [...PUZZLES.filter(p => !hiddenPuzzles.includes(p.id)), ...customPuzzles];

  const handleDeletePuzzle = (puzzle: PuzzleConfig) => {
    setActionMenuPuzzle(puzzle);
    setShowDeletePin(true);
  };

  const handleDeletePinChange = (text: string) => {
    const newPin = text.replace(/[^0-9]/g, '');
    setDeletePin(newPin);

    if (newPin.length === 4) {
      if (newPin === '1111') {
        setShowDeletePin(false);
        setDeletePin('');
        if (actionMenuPuzzle) {
          if (PUZZLES.some(p => p.id === actionMenuPuzzle.id)) {
            const newHidden = [...hiddenPuzzles, actionMenuPuzzle.id];
            setHiddenPuzzles(newHidden);
            safeStorage.set('@hidden_puzzles', newHidden);
          } else {
            const newCustom = customPuzzles.filter(p => p.id !== actionMenuPuzzle.id);
            setCustomPuzzles(newCustom);
            safeStorage.set('@custom_puzzles', newCustom);
          }
          setActionMenuPuzzle(null);
        }
      } else {
        triggerShake();
        setDeletePin('');
      }
    }
  };

  const handleSaveRename = () => {
    if (actionMenuPuzzle && renameTitle.trim()) {
      const updated = customPuzzles.map(p => p.id === actionMenuPuzzle.id ? { ...p, name: renameTitle.trim() } : p);
      setCustomPuzzles(updated);
      safeStorage.set('@custom_puzzles', updated);
    }
    setShowRenameModal(false);
    setActionMenuPuzzle(null);
    setRenameTitle('');
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
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
      for (let i = scrambled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = scrambled[i];
        scrambled[i] = scrambled[j];
        scrambled[j] = temp;
      }
      scrambled.forEach((p, idx) => {
        p.currentIndex = idx;
      });
    } while (isAlreadySolved(scrambled) && scrambled.length > 1);

    scrambled = scrambled.map((p, idx) => ({
      ...p,
      currentIndex: idx,
    }));

    setPieces(scrambled);
    setIsSolved(false);
    setSelectedPuzzle(puzzle);
  };

  useEffect(() => {
    if (pieces.length > 0 && isAlreadySolved(pieces) && !isSolved) {
      const timer = setTimeout(() => {
        setIsSolved(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [pieces, isSolved]);

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
        case 25: newCols = 5; newRows = 5; break;
        default: return;
    }
    const updatedPuzzle = { ...selectedPuzzle, cols: newCols, rows: newRows, difficulty: `${piecesCount} Pieces` };
    startPuzzle(updatedPuzzle);
  };

  const handleNextPuzzle = () => {
    if (!selectedPuzzle) return;
    const currentIndex = allPuzzles.findIndex(p => p.id === selectedPuzzle.id);
    if (currentIndex === -1 || currentIndex === allPuzzles.length - 1) {
      Animated.sequence([
        Animated.timing(shakeNextAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeNextAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeNextAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeNextAnim, { toValue: 0, duration: 50, useNativeDriver: true })
      ]).start();
    } else {
      startPuzzle(allPuzzles[currentIndex + 1]);
    }
  };

  const createCustomPuzzle = (uri: string) => {
    const newPuzzle: PuzzleConfig = {
      id: 'p_custom_' + Date.now(),
      name: 'My Custom Puzzle',
      image: { uri },
      icon: 'image-outline',
      cols: 3,
      rows: 3,
      difficulty: '9 Pieces',
    };
    const updatedPuzzles = [...customPuzzles, newPuzzle];
    setCustomPuzzles(updatedPuzzles);
    safeStorage.set('@custom_puzzles', updatedPuzzles);
    startPuzzle(newPuzzle);
  };

  const takePhoto = async () => {
    setShowAiMenu(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      createCustomPuzzle(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    setShowAiMenu(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      createCustomPuzzle(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <GlobalBackground />
      <ScreenWrapper transparent>
        <TopBar 
          title="Puzzles"
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.grid}>
            {allPuzzles.map((puzzle) => (
              <View
                key={puzzle.id}
                style={{ width: '48%', marginBottom: theme.spacing.md, marginTop: theme.spacing.md, position: 'relative' }}
              >
                <Pressable
                  onPress={() => {
                    startPuzzle(puzzle);
                  }}
                >
                  <Animated.View style={[
                    styles.card,
                    isRocket && {
                      backgroundColor: 'rgba(255, 255, 255, 0.45)',
                      borderColor: 'rgba(255, 255, 255, 0.35)',
                      borderWidth: 1.5,
                      shadowColor: '#000000',
                      shadowOffset: { width: 0, height: 8 },
                      shadowRadius: 24,
                      shadowOpacity: 0.1,
                    }
                  ]}>
                    <View style={[styles.cardIconContainer, { overflow: 'hidden' }]}>
                      <Image source={puzzle.image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    </View>
                    <Text style={[
                      styles.cardName,
                      isRocket && { color: '#FFFFFF' },
                      isRocket && { textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }
                    ]}>{puzzle.name}</Text>
                  </Animated.View>
                </Pressable>

                <View style={{ position: 'absolute', top: 12, right: 12, zIndex: 20 }}>
                  <Pressable 
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                    onPress={(e) => { 
                      if (e && e.stopPropagation) e.stopPropagation(); 
                      setActionMenuPuzzle(puzzle);
                      setShowActionMenu(true);
                    }} 
                    style={({ pressed }) => [
                      {
                        padding: 6,
                        borderRadius: 20,
                        backgroundColor: pressed ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.03)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }
                    ]}
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color={isRocket ? '#FFFFFF' : '#6B7280'} />
                  </Pressable>
                </View>
              </View>
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
                  <Text style={[styles.questionCaption, { marginBottom: theme.spacing.lg, paddingHorizontal: theme.spacing.md }]}>
                    Upload a page or take a photo, and AI will turn it into a fun puzzle.
                  </Text>
                  
                  <View style={styles.iconContainer}>
                    <Ionicons name="camera-outline" size={64} color={theme.colors.primary} />
                  </View>
                  
                  <Button 
                    title="Take Photo" 
                    onPress={takePhoto} 
                    style={styles.uploadButton}
                  />
                  
                  <Button 
                    title="Upload Image" 
                    onPress={pickImage} 
                    style={[styles.uploadButton, { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.stroke }]}
                  />
                  <Text style={styles.supportedText}>Supports JPG, PNG</Text>
                </Pressable>
              </Pressable>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Puzzle Action Menu Modal */}
      <Modal visible={showActionMenu} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => setShowActionMenu(false)}>
          <View style={[styles.modalOverlay, { justifyContent: 'flex-end', padding: 0 }]}>
            <Pressable style={[styles.uploadCard, { width: '100%', maxWidth: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: 40, borderStyle: 'solid', borderWidth: 0 }]} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Text style={[styles.levelTitle, { marginBottom: theme.spacing.xl }]}>{actionMenuPuzzle?.name || 'Options'}</Text>
              
              <View style={{ width: '100%', gap: theme.spacing.sm }}>
                <Pressable 
                  style={[styles.modalOptionCard, actionMenuPuzzle?.id.startsWith('p_') && { opacity: 0.5 }]}
                  disabled={actionMenuPuzzle?.id.startsWith('p_')}
                  onPress={() => {
                    setShowActionMenu(false);
                    setRenameTitle(actionMenuPuzzle?.name || '');
                    setShowRenameModal(true);
                  }}
                >
                  <Ionicons name="pencil-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 12 }} />
                  <Text style={styles.modalOptionText}>Rename</Text>
                </Pressable>

                <Pressable 
                  style={styles.modalOptionCard}
                  onPress={() => {
                    const target = actionMenuPuzzle;
                    setShowActionMenu(false);
                    if (target) {
                      setActionMenuPuzzle(target);
                      setShowDeletePin(true);
                    }
                  }}
                >
                  <Ionicons name="trash-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 12 }} />
                  <Text style={styles.modalOptionText}>Delete</Text>
                </Pressable>
              </View>
              
              <Button 
                title="Cancel" 
                variant="secondary"
                onPress={() => setShowActionMenu(false)} 
                style={{ width: '100%', marginTop: theme.spacing.xl }}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Delete Pin Verification Modal */}
      <Modal visible={showDeletePin} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => {
          setShowDeletePin(false);
          setDeletePin('');
          setActionMenuPuzzle(null);
        }}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.pinCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Animated.View style={[styles.pinContainer, { transform: [{ translateX: shakeAnim }] }]}>
                <Text style={styles.pinTitle}>Enter Parent PIN to Delete</Text>
                <TextInput
                  style={styles.pinInput}
                  value={deletePin}
                  onChangeText={handleDeletePinChange}
                  keyboardType="number-pad"
                  maxLength={4}
                  autoFocus
                  placeholder="****"
                  autoComplete="off"
                  autoCorrect={false}
                  importantForAutofill="no"
                  textContentType="oneTimeCode"
                />
              </Animated.View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Rename Puzzle Modal */}
      <Modal visible={showRenameModal} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => {
          setShowRenameModal(false);
        }}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.pinCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Text style={styles.pinTitle}>Rename Puzzle</Text>
              <TextInput
                style={[styles.editInput, { marginBottom: theme.spacing.lg }]}
                value={renameTitle}
                onChangeText={setRenameTitle}
                placeholder="Puzzle Name"
                maxLength={40}
                autoFocus
              />
              <Button
                title="Save"
                onPress={handleSaveRename}
                style={{ width: '100%', marginBottom: theme.spacing.md }}
              />
            </Pressable>
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
          <GlobalBackground />
          <ScreenWrapper transparent>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md, zIndex: 2, paddingHorizontal: theme.spacing.md }}>
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
                  {screenHeight > 700 && <Text style={styles.headlineText}>Drag the pieces to solve a puzzle!</Text>}
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
                    {[4, 9, 16, 25].map((num) => {
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
                  <View style={styles.mascotContainer}>
                    <Ionicons name="extension-puzzle-outline" size={32} color={theme.colors.secondaryText} style={{ opacity: 0.5 }} />
                    <Text style={styles.mascotText}>Piece it together!</Text>
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
                    style={{ marginTop: theme.spacing.lg, paddingHorizontal: theme.spacing.xxl }}
                  />
                </View>
              )}
            </View>

            <View style={{ width: '100%', alignItems: 'flex-end', paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md, marginTop: 'auto' }}>
              {screenHeight > 700 && (
                <Animated.View style={{ transform: [{ translateX: shakeNextAnim }] }}>
                  <Pressable style={styles.backButton} onPress={handleNextPuzzle}>
                    <Text style={{ marginRight: 4, ...theme.typography.button, color: theme.colors.text }}>Next Puzzle</Text>
                    <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
                  </Pressable>
                </Animated.View>
              )}
            </View>
          </ScreenWrapper>
        </View>
      </Modal>
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
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
    width: '100%',
    height: 140,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    ...theme.shadows.soft,
  },
  deleteBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  cardIconContainer: {
    marginBottom: theme.spacing.md,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardIcon: {
    fontSize: 32,
  },
  cardName: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '600',
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
    paddingVertical: theme.spacing.xs,
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
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  mascotText: {
    ...theme.typography.caption,
    color: theme.colors.secondaryText,
    fontStyle: 'italic',
  },
  pinCard: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    zIndex: 1000,
    backgroundColor: theme.colors.white,
  },
  pinContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  pinTitle: {
    ...theme.typography.body,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.text,
  },
  pinInput: {
    width: 120,
    height: 60,
    borderWidth: 2,
    borderColor: theme.colors.stroke,
    borderRadius: theme.borderRadius.sm,
    textAlign: 'center',
    ...theme.typography.heading,
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  editInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  modalOptionCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
  },
  modalOptionText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});
