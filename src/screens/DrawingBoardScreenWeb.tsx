import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, ScrollView } from 'react-native';
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
  '#EF8B8B',
  '#FFC857',
  '#BEF264',
  '#60A5FA',
  '#A78BFA',
  '#111827',
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
  const [activeColor, setActiveColor] = useState(COLORS[5]);
  const [activeStrokeWidth, setActiveStrokeWidth] = useState(8);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [currentPath, setCurrentPath] = useState<string>('');

  const canvasRef = useRef<any>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (el && typeof el.addEventListener === 'function') {
      const preventScroll = (e: TouchEvent) => {
        // Prevent Safari from scrolling the page when drawing
        if (e.cancelable) {
          e.preventDefault();
        }
      };
      // { passive: false } is required on iOS Safari to allow preventDefault
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
          onResponderRelease={handleTouchEnd}
          onResponderTerminate={handleTouchEnd}
        >
          {/* @ts-ignore */}
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
            {paths.map((stroke, index) => (
              // @ts-ignore
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
              // @ts-ignore
              <path
                d={currentPath}
                stroke={activeColor}
                strokeWidth={activeStrokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ) : null}
          {/* @ts-ignore */}
          </svg>
        </View>

        <Pressable 
          style={[styles.absoluteBackButton, { top: insets.top + 16 }, isDark && { backgroundColor: 'rgba(255,255,255,0.1)' }]} 
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
        >
          <Ionicons name={navigation.canGoBack() ? "arrow-back" : "home-outline"} size={24} color={isDark ? '#FFFFFF' : theme.colors.text} />
        </Pressable>
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
        </ScrollView>
      </View>
      ) : (
        <Pressable 
          style={[styles.absoluteBackButton, { top: insets.top + 16, left: 'auto', right: 16 }, isDark && { backgroundColor: 'rgba(255,255,255,0.1)' }]} 
          onPress={() => setIsToolbarVisible(true)}
        >
          <Ionicons name="color-palette-outline" size={24} color={isDark ? '#FFFFFF' : theme.colors.text} />
        </Pressable>
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
  }
});
