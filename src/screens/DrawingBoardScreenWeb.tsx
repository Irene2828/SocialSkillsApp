import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, ScrollView, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { useMood, getMoodColors } from '../context/MoodContext';
import ColorPicker from 'react-native-wheel-color-picker';

type Stroke = {
  path: string;
  color: string;
  strokeWidth: number;
};

const COLORS = [
  '#EF8B8B', // Pastel Red
  '#FFC857', // Yellow
  '#BEF264', // Green
  '#60A5FA', // Blue
  '#A78BFA', // Purple
  '#FFD700', // Gold
  '#111827', // Black
];

const STROKE_WIDTHS = [
  { id: 'thin', value: 4, icon: 'ellipse' as const, size: 8 },
  { id: 'medium', value: 8, icon: 'ellipse' as const, size: 14 },
  { id: 'thick', value: 16, icon: 'ellipse' as const, size: 22 },
];

export const DrawingBoardScreenWeb = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const isDark = moodColors.isDark;

  const [paths, setPaths] = useState<Stroke[]>([]);
  const [redoPaths, setRedoPaths] = useState<Stroke[]>([]);
  const [activeColor, setActiveColor] = useState(COLORS[5]);
  const [activeStrokeWidth, setActiveStrokeWidth] = useState(8);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>('');
  const isDrawing = useRef(false);

  const canvasRef = useRef<any>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (el && typeof el.addEventListener === 'function') {
      const preventScroll = (e: TouchEvent) => {
        if (e.cancelable) {
          e.preventDefault();
        }
      };
      el.addEventListener('touchmove', preventScroll, { passive: false });
      return () => {
        el.removeEventListener('touchmove', preventScroll);
      };
    }
  }, []);

  const getCoordinates = (e: any) => {
    let x = e.nativeEvent.locationX;
    let y = e.nativeEvent.locationY;
    if (x === undefined || isNaN(x)) x = e.nativeEvent.offsetX;
    if (y === undefined || isNaN(y)) y = e.nativeEvent.offsetY;
    if (x === undefined || isNaN(x)) x = e.nativeEvent.pageX;
    if (y === undefined || isNaN(y)) y = e.nativeEvent.pageY;
    
    return {
      x: typeof x === 'number' && !isNaN(x) ? x : 0,
      y: typeof y === 'number' && !isNaN(y) ? y : 0
    };
  };

  const handleTouchStart = (e: any) => {
    isDrawing.current = true;
    const { x, y } = getCoordinates(e);
    setCurrentPath(`M ${x} ${y}`);
  };

  const handleTouchMove = (e: any) => {
    if (!isDrawing.current) return;
    const { x, y } = getCoordinates(e);
    setCurrentPath(prev => prev ? `${prev} L ${x} ${y}` : `M ${x} ${y}`);
  };

  const handlePointerUp = (e: any) => {
    isDrawing.current = false;
    setCurrentPath(prevPath => {
      if (prevPath) {
        setPaths(prev => [
          ...prev, 
          { 
            path: prevPath, 
            color: activeColor, 
            strokeWidth: activeStrokeWidth 
          }
        ]);
        setRedoPaths([]); // Clear redo stack on new action
      }
      return '';
    });
  };

  const undo = () => {
    if (paths.length === 0) return;
    const lastPath = paths[paths.length - 1];
    setRedoPaths(prev => [...prev, lastPath]);
    setPaths(prev => prev.slice(0, -1));
  };

  const redo = () => {
    if (redoPaths.length === 0) return;
    const pathToRestore = redoPaths[redoPaths.length - 1];
    setPaths(prev => [...prev, pathToRestore]);
    setRedoPaths(prev => prev.slice(0, -1));
  };

  const clearCanvas = () => {
    setPaths([]);
    setRedoPaths([]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <View style={[styles.canvasContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF' }]}>
        <View 
          ref={canvasRef}
          collapsable={false} 
          style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent', touchAction: 'none' } as any]}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleTouchStart}
          onResponderMove={handleTouchMove}
          onResponderRelease={handlePointerUp}
          onResponderTerminate={handlePointerUp}
        >
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
            {paths.map((stroke, index) => (
              <path
                key={index}
                d={stroke.path}
                stroke={stroke.color}
                strokeWidth={stroke.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}
            {currentPath ? (
              <path
                d={currentPath}
                stroke={activeColor}
                strokeWidth={activeStrokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ) : null}
          </svg>
        </View>
      </View>

      {isToolbarVisible ? (
        <View style={[styles.rightToolbar, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16, backgroundColor: isDark ? moodColors.bg : '#FFFFFF' }]}>
          <Pressable style={styles.toolBtn} onPress={() => setIsToolbarVisible(false)}>
            <Ionicons name="chevron-forward" size={26} color={isDark ? '#FFFFFF' : theme.colors.text} />
          </Pressable>
          <View style={styles.dividerHorizontal} />
          
          <ScrollView contentContainerStyle={styles.toolbarContent} showsVerticalScrollIndicator={false}>
          <Pressable style={styles.toolBtn} onPress={undo} disabled={paths.length === 0}>
            <Ionicons name="arrow-undo-outline" size={26} color={paths.length === 0 ? theme.colors.neutralGrey : (isDark ? '#FFFFFF' : theme.colors.text)} />
          </Pressable>
          
          <Pressable style={styles.toolBtn} onPress={redo} disabled={redoPaths.length === 0}>
            <Ionicons name="arrow-redo-outline" size={26} color={redoPaths.length === 0 ? theme.colors.neutralGrey : (isDark ? '#FFFFFF' : theme.colors.text)} />
          </Pressable>
          
          <Pressable style={styles.toolBtn} onPress={clearCanvas}>
            <Ionicons name="trash-outline" size={26} color={isDark ? '#FFFFFF' : theme.colors.text} />
          </Pressable>

          <View style={styles.dividerHorizontal} />

          {STROKE_WIDTHS.map((sw) => (
            <Pressable
              key={sw.id}
              style={[
                styles.strokeBtn,
                activeStrokeWidth === sw.value && styles.activeStrokeBtn,
                isDark && activeStrokeWidth === sw.value && { borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.1)' }
              ]}
              onPress={() => setActiveStrokeWidth(sw.value)}
            >
              <Ionicons name={sw.icon} size={sw.size} color={isDark ? '#FFFFFF' : theme.colors.text} />
            </Pressable>
          ))}

          <View style={styles.dividerHorizontal} />

          {COLORS.map((color) => (
            <Pressable
              key={color}
              style={[
                styles.colorBtn,
                { backgroundColor: color },
                activeColor === color && styles.activeColorBtn,
                activeColor === color && color === '#111827' && isDark && { borderColor: 'rgba(255,255,255,0.5)' }
              ]}
              onPress={() => setActiveColor(color)}
            />
          ))}
          
          <Pressable
            style={[
              styles.colorBtn,
              { backgroundColor: !COLORS.includes(activeColor) ? activeColor : 'transparent', borderWidth: 2, borderColor: isDark ? '#FFFFFF' : theme.colors.neutralGrey, justifyContent: 'center', alignItems: 'center' },
              !COLORS.includes(activeColor) && styles.activeColorBtn
            ]}
            onPress={() => setShowColorPicker(true)}
          >
            <Ionicons name="aperture-outline" size={20} color={isDark || !COLORS.includes(activeColor) ? '#FFFFFF' : theme.colors.text} />
          </Pressable>
        </ScrollView>
      </View>
      ) : (
        <Pressable 
          style={[styles.absoluteBackButton, { top: insets.top + 16, left: 'auto', right: 16 }, isDark && { backgroundColor: 'rgba(255,255,255,0.1)' }]} 
          onPress={() => setIsToolbarVisible(true)}
        >
          <Ionicons name="eye-outline" size={24} color={isDark ? '#FFFFFF' : theme.colors.text} />
        </Pressable>
      )}
      </View>

      {showColorPicker && (
        <View style={styles.colorPickerModal}>
          <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={() => setShowColorPicker(false)} />
          <View style={[styles.colorPickerContainer, isDark && { backgroundColor: moodColors.bg }]}>
            <View style={{ flex: 1, padding: 20 }}>
              <ColorPicker
                color={activeColor}
                onColorChange={(color: string) => setActiveColor(color)}
                onColorChangeComplete={(color: string) => setActiveColor(color)}
                thumbSize={30}
                sliderSize={30}
                noSnap={true}
                row={false}
              />
            </View>
            <Pressable style={[styles.closePickerBtn, { backgroundColor: theme.colors.primary }]} onPress={() => setShowColorPicker(false)}>
              <Text style={[styles.closePickerText, { color: '#111827' }]}>Select Color</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
  },
  canvasContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  absoluteBackButton: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    ...theme.shadows.soft,
    zIndex: 100,
  },
  rightToolbar: {
    width: 76,
    alignItems: 'center',
    ...theme.shadows.glow,
    borderLeftWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  toolbarContent: {
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: 8,
    paddingBottom: 40,
  },
  dividerHorizontal: {
    width: 32,
    height: 2,
    backgroundColor: theme.colors.neutralGrey,
    opacity: 0.3,
    marginVertical: 4,
    borderRadius: 1,
  },
  toolBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  strokeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeStrokeBtn: {
    backgroundColor: theme.colors.neutralGrey,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  colorBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  activeColorBtn: {
    borderColor: 'rgba(0,0,0,0.2)',
    transform: [{ scale: 1.15 }],
  },
  colorPickerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  colorPickerContainer: {
    width: '85%',
    height: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  closePickerBtn: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closePickerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
