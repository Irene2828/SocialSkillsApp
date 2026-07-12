import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable, Text, Dimensions } from 'react-native';
import { Canvas, Path, Skia, SkPath } from '@shopify/react-native-skia';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { useMood, getMoodColors } from '../context/MoodContext';

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
  '#111827', // Black
];

const STROKE_WIDTHS = [
  { id: 'thin', value: 4, icon: 'ellipse' as const, size: 8 },
  { id: 'medium', value: 8, icon: 'ellipse' as const, size: 14 },
  { id: 'thick', value: 16, icon: 'ellipse' as const, size: 22 },
];

export const DrawingBoardScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const isDark = moodColors.isDark;

  const [paths, setPaths] = useState<Stroke[]>([]);
  const [activeColor, setActiveColor] = useState(COLORS[5]);
  const [activeStrokeWidth, setActiveStrokeWidth] = useState(8);
  
  const [currentPath, setCurrentPath] = useState<string>('');

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
    const { x, y } = getCoordinates(e);
    setCurrentPath(`M ${x} ${y}`);
  };

  const handleTouchMove = (e: any) => {
    const { x, y } = getCoordinates(e);
    setCurrentPath(prev => prev ? `${prev} L ${x} ${y}` : `M ${x} ${y}`);
  };

  const handleTouchEnd = () => {
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
      }
      return '';
    });
  };

  const undo = () => {
    setPaths(prev => prev.slice(0, -1));
  };

  const clearCanvas = () => {
    setPaths([]);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: isDark ? moodColors.bg : '#FFFFFF' }]}>
        <Pressable 
          style={[styles.backButton, isDark && styles.backButtonDark]} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : theme.colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : theme.colors.text }]}>Drawing Board</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={[styles.canvasContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF' }]}>
        <View 
          collapsable={false} 
          style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleTouchStart}
          onResponderMove={handleTouchMove}
          onResponderRelease={handleTouchEnd}
          onResponderTerminate={handleTouchEnd}
        >
          <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
            {paths.map((stroke, index) => (
              <Path
                key={index}
                path={stroke.path}
                color={stroke.color}
                style="stroke"
                strokeWidth={stroke.strokeWidth}
                strokeCap="round"
                strokeJoin="round"
              />
            ))}
            {currentPath ? (
              <Path
                path={currentPath}
                color={activeColor}
                style="stroke"
                strokeWidth={activeStrokeWidth}
                strokeCap="round"
                strokeJoin="round"
              />
            ) : null}
          </Canvas>
        </View>
      </View>

      <View style={[styles.toolbar, { paddingBottom: insets.bottom + 80, backgroundColor: isDark ? moodColors.bg : '#FFFFFF' }]}>
        <View style={styles.toolsRow}>
          <Pressable style={styles.toolBtn} onPress={undo} disabled={paths.length === 0}>
            <Ionicons name="arrow-undo-outline" size={26} color={paths.length === 0 ? theme.colors.neutralGrey : (isDark ? '#FFFFFF' : theme.colors.text)} />
          </Pressable>
          
          <View style={styles.divider} />

          <View style={styles.strokeWidths}>
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
          </View>

          <View style={styles.divider} />
          
          <Pressable style={styles.toolBtn} onPress={clearCanvas}>
            <Ionicons name="trash-outline" size={26} color={isDark ? '#FFFFFF' : theme.colors.text} />
          </Pressable>
        </View>

        <View style={styles.colorPicker}>
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
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    ...theme.shadows.soft,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.neutralGrey,
  },
  backButtonDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    ...theme.typography.heading,
    fontSize: 20,
  },
  headerSpacer: {
    width: 40,
  },
  canvasContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  toolbar: {
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.glow,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  toolsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.neutralGrey,
    opacity: 0.5,
  },
  toolBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strokeWidths: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  strokeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeStrokeBtn: {
    backgroundColor: theme.colors.neutralGrey,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
  },
  colorBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  activeColorBtn: {
    borderColor: 'rgba(0,0,0,0.15)',
    transform: [{ scale: 1.1 }],
  }
});

export default DrawingBoardScreen;
