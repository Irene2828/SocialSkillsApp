import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Modal, useWindowDimensions, Animated, PanResponder, Alert, TextInput, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { safeStorage } from '../utils/storage';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/Button';
import { theme, FONTS } from '../theme';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
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
  category?: 'animals' | 'cities';
}

const PUZZLES: PuzzleConfig[] = [
  { id: 'p_lion', name: 'Friendly Lion', image: require('../../assets/puzzles/lion.png'), icon: 'paw-outline', cols: 3, rows: 2, difficulty: '6 Pieces', category: 'animals' },
  { id: 'p_panda', name: 'Happy Panda', image: require('../../assets/puzzles/panda.png'), icon: 'paw-outline', cols: 3, rows: 3, difficulty: '9 Pieces', category: 'animals' },
  { id: 'p_koala', name: 'Sleepy Koala', image: require('../../assets/puzzles/koala.png'), icon: 'paw-outline', cols: 3, rows: 3, difficulty: '9 Pieces', category: 'animals' },
  { id: 'p_rabbit', name: 'Fluffy Rabbit', image: require('../../assets/puzzles/rabbit.png'), icon: 'paw-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'animals' },
  { id: 'p_monkey', name: 'Cheeky Monkey', image: require('../../assets/puzzles/monkey.png'), icon: 'paw-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'animals' },
  { id: 'p_fox', name: 'Clever Fox', image: require('../../assets/puzzles/fox.png'), icon: 'paw-outline', cols: 5, rows: 5, difficulty: '25 Pieces', category: 'animals' },
  { id: 'p_elephant', name: 'Baby Elephant', image: require('../../assets/puzzles/elephant.png'), icon: 'paw-outline', cols: 3, rows: 2, difficulty: '6 Pieces', category: 'animals' },
  { id: 'p_giraffe', name: 'Happy Giraffe', image: require('../../assets/puzzles/giraffe.png'), icon: 'paw-outline', cols: 3, rows: 3, difficulty: '9 Pieces', category: 'animals' },
  { id: 'p_penguin', name: 'Waving Penguin', image: require('../../assets/puzzles/penguin.png'), icon: 'paw-outline', cols: 3, rows: 3, difficulty: '9 Pieces', category: 'animals' },
  { id: 'p_turtle', name: 'Sea Turtle', image: require('../../assets/puzzles/turtle.png'), icon: 'paw-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'animals' },
  { id: 'p_tiger', name: 'Tiger Cub', image: require('../../assets/puzzles/tiger.png'), icon: 'paw-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'animals' },
  { id: 'p_dolphin', name: 'Jumping Dolphin', image: require('../../assets/puzzles/dolphin.png'), icon: 'paw-outline', cols: 5, rows: 5, difficulty: '25 Pieces', category: 'animals' },
  { id: 'p_owl', name: 'Wise Owl', image: require('../../assets/puzzles/owl.png'), icon: 'paw-outline', cols: 3, rows: 2, difficulty: '6 Pieces', category: 'animals' },
  { id: 'p_bear', name: 'Cuddly Bear', image: require('../../assets/puzzles/bear.png'), icon: 'paw-outline', cols: 3, rows: 3, difficulty: '9 Pieces', category: 'animals' },
  { id: 'p_hippo', name: 'Baby Hippo', image: require('../../assets/puzzles/hippo.png'), icon: 'paw-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'animals' },
  { id: 'p_zebra', name: 'Smiling Zebra', image: require('../../assets/puzzles/zebra.png'), icon: 'paw-outline', cols: 5, rows: 5, difficulty: '25 Pieces', category: 'animals' },
  { id: 'p_astronaut', name: 'Little Astronaut', image: require('../../assets/puzzles/puzzle_astronaut.png'), icon: 'rocket-outline', cols: 3, rows: 3, difficulty: '9 Pieces', category: 'animals' },
  { id: 'p_dolphin2', name: 'Playful Dolphin', image: require('../../assets/puzzles/puzzle_dolphin.png'), icon: 'water-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'animals' },
  { id: 'p_elephant2', name: 'Jungle Elephant', image: require('../../assets/puzzles/puzzle_elephant.png'), icon: 'paw-outline', cols: 5, rows: 5, difficulty: '25 Pieces', category: 'animals' },
  { id: 'p_fish', name: 'Clownfish', image: require('../../assets/puzzles/puzzle_fish.png'), icon: 'water-outline', cols: 3, rows: 2, difficulty: '6 Pieces', category: 'animals' },
  { id: 'p_koala2', name: 'Sleepy Koala 2', image: require('../../assets/puzzles/puzzle_koala.png'), icon: 'paw-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'animals' },
  { id: 'p_lion2', name: 'Brave Lion', image: require('../../assets/puzzles/puzzle_lion.png'), icon: 'paw-outline', cols: 5, rows: 5, difficulty: '25 Pieces', category: 'animals' },
  { id: 'p_octopus', name: 'Curious Octopus', image: require('../../assets/puzzles/puzzle_octopus.png'), icon: 'water-outline', cols: 3, rows: 3, difficulty: '9 Pieces', category: 'animals' },
  { id: 'p_parrot', name: 'Colorful Parrot', image: require('../../assets/puzzles/puzzle_parrot.png'), icon: 'leaf-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'animals' },
  { id: 'p_turtle2', name: 'Sea Turtle 2', image: require('../../assets/puzzles/puzzle_turtle.png'), icon: 'water-outline', cols: 5, rows: 5, difficulty: '25 Pieces', category: 'animals' },
  { id: 'p_unicorn', name: 'Magical Unicorn', image: require('../../assets/puzzles/puzzle_unicorn.png'), icon: 'star-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'animals' },

  { id: 'p_kyiv', name: 'Kyiv', image: require('../../assets/puzzles/puzzle_kyiv.png'), icon: 'business-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'cities' },
  { id: 'p_montreal', name: 'Montreal', image: require('../../assets/puzzles/puzzle_montreal.png'), icon: 'business-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'cities' },
  { id: 'p_las_palmas', name: 'Las Palmas', image: require('../../assets/puzzles/puzzle_las_palmas.png'), icon: 'business-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'cities' },
  { id: 'p_madrid', name: 'Madrid', image: require('../../assets/puzzles/puzzle_madrid.png'), icon: 'business-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'cities' },
  { id: 'p_valencia', name: 'Valencia', image: require('../../assets/puzzles/puzzle_valencia.png'), icon: 'business-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'cities' },
  { id: 'p_lisbon', name: 'Lisbon', image: require('../../assets/puzzles/puzzle_lisbon.png'), icon: 'business-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'cities' },
  { id: 'p_berlin', name: 'Berlin', image: require('../../assets/puzzles/puzzle_berlin.png'), icon: 'business-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'cities' },
  { id: 'p_paris', name: 'Paris', image: require('../../assets/puzzles/puzzle_paris.png'), icon: 'business-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'cities' },
  { id: 'p_london', name: 'London', image: require('../../assets/puzzles/puzzle_london.png'), icon: 'business-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'cities' },
  { id: 'p_rome', name: 'Rome', image: require('../../assets/puzzles/puzzle_rome.png'), icon: 'business-outline', cols: 4, rows: 4, difficulty: '16 Pieces', category: 'cities' },
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
import { useNavigation } from '@react-navigation/native';

export const PuzzleScreen = () => {
  const navigation = useNavigation();
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
  const [activeTab, setActiveTab] = useState<'animals' | 'cities'>('animals');

  const [hiddenPuzzles, setHiddenPuzzles] = useState<string[]>([]);
  const shakeNextAnim = useRef(new Animated.Value(0)).current;

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    let interval: any;
    if (selectedPuzzle && !isSolved) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedPuzzle, isSolved]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    const loadPuzzles = async () => {
      const storedCustom = await safeStorage.get<PuzzleConfig[]>('@custom_puzzles', []);
      const storedHidden = await safeStorage.get<string[]>('@hidden_puzzles', []);
      setCustomPuzzles(storedCustom);
      setHiddenPuzzles(storedHidden);
    };
    loadPuzzles();
  }, []);

  const allPuzzles = [...PUZZLES.filter(p => !hiddenPuzzles.includes(p.id)), ...customPuzzles].filter(p => p.category === activeTab || p.id.startsWith('p_custom_'));

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
  const isTablet = screenWidth >= 768;
  const numColumns = 2;
  const cardWidth = Math.floor((screenWidth - 32 - (16 * (numColumns - 1))) / numColumns);
  const isSmallScreen = screenWidth < 380;
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
    setTimeElapsed(0);
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
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.base64) {
      const base64Uri = `data:image/jpeg;base64,${result.assets[0].base64}`;
      createCustomPuzzle(base64Uri);
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
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.base64) {
      const base64Uri = `data:image/jpeg;base64,${result.assets[0].base64}`;
      createCustomPuzzle(base64Uri);
    }
  };

  const renderCompleted = () => {
    let message = "Awesome!";

    return (
      <Pressable style={styles.completedContainer} onPress={() => setSelectedPuzzle(null)}>
        <SilverDust />
        <Pressable style={styles.completedCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
          <Animated.View style={{ alignItems: 'center', width: '100%' }}>
            <View style={[styles.titleContainer, { position: 'relative', marginBottom: theme.spacing.xl }]}>
              <Text style={styles.completedTitle}>{message}</Text>
              {message === "Awesome!" && <View style={styles.brushUnderline} />}
            </View>

            {showTimer && timeElapsed > 0 && (
              <Text style={{ fontFamily: FONTS.semiBold, fontSize: 18, color: theme.colors.secondaryText, marginBottom: theme.spacing.xl }}>
                Time: {formatTime(timeElapsed)}
              </Text>
            )}

            <Button 
              title="Next Puzzle" 
              onPress={handleNextPuzzle}
              style={{ width: '100%', marginBottom: theme.spacing.md, backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }}
            />

            <Pressable style={styles.linkButton} onPress={() => setSelectedPuzzle(null)}>
              <Text style={[styles.linkButtonText, { textDecorationLine: 'none' }]}>Back to All Puzzles</Text>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <GlobalBackground />
      <ScreenWrapper transparent>
        <TopBar 
          title=""
        />

        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          data={allPuzzles}
          keyExtractor={(item) => item.id}
          key={numColumns}
          numColumns={numColumns}
          columnWrapperStyle={{ gap: theme.spacing.md, marginBottom: theme.spacing.md }}
          ListHeaderComponent={
            <View style={[styles.tabContainer, isRocket && { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)', shadowOpacity: 0 }]}>
              <Pressable 
                style={[styles.tab, { borderRightWidth: 1, borderRightColor: '#BAE6FD' }]} 
                onPress={() => setActiveTab('animals')}
              >
                <Text style={[styles.tabText, { color: isRocket ? '#FFFFFF' : theme.colors.secondaryText }, activeTab === 'animals' && { color: '#374151', fontFamily: FONTS.semiBold, fontWeight: '500', fontSize: 16, letterSpacing: 0.2, lineHeight: 22 }]}>Animals</Text>
              </Pressable>
              <Pressable 
                style={styles.tab} 
                onPress={() => setActiveTab('cities')}
              >
                <Text style={[styles.tabText, { color: isRocket ? '#FFFFFF' : theme.colors.secondaryText }, activeTab === 'cities' && { color: '#374151', fontFamily: FONTS.semiBold, fontWeight: '500', fontSize: 16, letterSpacing: 0.2, lineHeight: 22 }]}>Cities</Text>
              </Pressable>
            </View>
          }
          ListFooterComponent={
            <View style={styles.createAiButtonContainer}>
              <Button
                title="Create New Puzzle"
                iconName="extension-puzzle-outline"
                style={styles.createAiButton}
                onPress={() => setShowAiMenu(true)}
              />
            </View>
          }
          renderItem={({ item: puzzle }) => (
            <View style={{ width: cardWidth, position: 'relative' }}>
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
          )}
        />
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
                      if (PUZZLES.some(p => p.id === target.id)) {
                        const newHidden = [...hiddenPuzzles, target.id];
                        setHiddenPuzzles(newHidden);
                        safeStorage.set('@hidden_puzzles', newHidden);
                      } else {
                        const newCustom = customPuzzles.filter(p => p.id !== target.id);
                        setCustomPuzzles(newCustom);
                        safeStorage.set('@custom_puzzles', newCustom);
                      }
                      setActionMenuPuzzle(null);
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
            {!isSolved ? (
              <>
                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md, zIndex: 2, paddingHorizontal: theme.spacing.md }}>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <Pressable 
                      onPress={() => setSelectedPuzzle(null)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, marginLeft: -4 }}
                    >
                      <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
                      <Text style={{ ...theme.typography.body, color: isRocket ? 'rgba(255,255,255,0.7)' : theme.colors.secondaryText, marginLeft: 2 }}>Back</Text>
                    </Pressable>
                  </View>
                  <View style={{ flex: 2, alignItems: 'center' }}>
                    <View style={[styles.screenFolderTab, { position: 'relative', top: 0, right: 0, left: 'auto', overflow: 'hidden', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                      />
                      <Ionicons name="extension-puzzle-outline" size={16} color={theme.colors.text} style={{ marginRight: 4 }} />
                      <Text style={[styles.screenFolderTabText, { color: theme.colors.text }]} numberOfLines={1}>{selectedPuzzle?.name}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Pressable 
                      onPress={() => setShowSettings(true)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      style={{ paddingVertical: 8 }}
                    >
                      <Ionicons name="options-outline" size={28} color={theme.colors.text} />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.gameContent}>
                  {selectedPuzzle && (
                    <>
                      <Pressable 
                        onPress={() => setShowTimer(!showTimer)}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.md, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20, backgroundColor: isRocket ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                      >
                        <Ionicons name="timer-outline" size={20} color={isRocket ? '#FFFFFF' : theme.colors.text} />
                        {showTimer && (
                          <Text style={{ marginLeft: 8, fontSize: 16, fontFamily: FONTS.semiBold, color: isRocket ? '#FFFFFF' : theme.colors.text, fontVariant: ['tabular-nums'] }}>
                            {formatTime(timeElapsed)}
                          </Text>
                        )}
                      </Pressable>
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
              </>
            ) : renderCompleted()}
          </ScreenWrapper>
        </View>
      </Modal>
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: 0,
    padding: 0,
    marginHorizontal: -theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
    ...theme.shadows.soft,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
    opacity: 0.8,
  },
  tabText: {
    ...theme.typography.button,
    fontFamily: FONTS.medium,
    fontWeight: '500',
    color: theme.colors.secondaryText,
  },
  scrollContent: {
    paddingBottom: 160,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xs,
  },
  card: {
    width: '100%',
    height: 158,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg * 2,
    paddingBottom: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.stroke,
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
    marginBottom: 4,
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
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -12,
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
  completedContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xl,
  },
  completedCard: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
  },
  completedTitle: {
    ...theme.typography.heading,
    fontSize: 24,
    textAlign: 'center',
    color: theme.colors.text,
    marginBottom: 0,
  },
  completedCoinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  completedCoinText: {
    ...theme.typography.body,
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: 0.5,
    textAlign: 'center',
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  completedButton: {
    marginTop: theme.spacing.md,
    width: '100%',
  },
  linkButton: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.sm,
  },
  linkButtonText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.secondaryText,
    textAlign: 'center',
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
    marginTop: 24,
    paddingHorizontal: theme.spacing.xl,
  },
  createAiButton: {
    width: '100%',
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  uploadCard: {
    width: '100%',
    maxWidth: 500,
    padding: theme.spacing.xl,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
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
    borderRadius: 0,
    overflow: 'hidden',
    zIndex: 1000,
    backgroundColor: 'transparent',
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
