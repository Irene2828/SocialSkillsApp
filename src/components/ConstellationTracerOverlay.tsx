import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Text, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalBackground } from './GlobalBackground';
import { SpaceTouchCanvas } from './SpaceTouchCanvas';
import { AppTabBar } from './AppTabBar';
import { FONTS } from '../theme';

const isWeb = Platform.OS === 'web';

interface Props {
  onClose: () => void;
  mode?: 'constellations' | 'abc' | 'digits';
  letterMode?: 'print' | 'cursive';
  letterLang?: 'eng' | 'ukr';
  onModeChange?: (mode: 'print' | 'cursive') => void;
  onLangChange?: (lang: 'eng' | 'ukr') => void;
}

const ABC_ENG = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const ABC_UKR = ['А','Б','В','Г','Ґ','Д','Е','Є','Ж','З','И','І','Ї','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ь','Ю','Я'];
const DIGITS_DATA = ['1','2','3','4','5','6','7','8','9','10'];

// Comprehensive stroke guides for smooth handwriting flow
const GET_HANDWRITING_STROKES = (char: string, isCursive: boolean) => {
  if (char === '1') {
    return [
      [{ x: 0.38, y: 0.38 }, { x: 0.50, y: 0.25 }, { x: 0.50, y: 0.75 }],
      [{ x: 0.38, y: 0.75 }, { x: 0.62, y: 0.75 }],
    ];
  } else if (char === '2') {
    return [
      [{ x: 0.32, y: 0.35 }, { x: 0.50, y: 0.24 }, { x: 0.68, y: 0.35 }, { x: 0.32, y: 0.75 }, { x: 0.68, y: 0.75 }]
    ];
  } else if (char === '3') {
    return [
      [{ x: 0.32, y: 0.25 }, { x: 0.65, y: 0.25 }, { x: 0.46, y: 0.48 }, { x: 0.65, y: 0.60 }, { x: 0.32, y: 0.75 }]
    ];
  } else if (char === '4') {
    return [
      [{ x: 0.58, y: 0.25 }, { x: 0.30, y: 0.55 }, { x: 0.72, y: 0.55 }],
      [{ x: 0.58, y: 0.45 }, { x: 0.58, y: 0.75 }],
    ];
  } else if (char === '5') {
    return [
      [{ x: 0.65, y: 0.25 }, { x: 0.38, y: 0.25 }],
      [{ x: 0.38, y: 0.25 }, { x: 0.38, y: 0.48 }, { x: 0.65, y: 0.58 }, { x: 0.35, y: 0.75 }],
    ];
  } else if (char === '6') {
    return [
      [{ x: 0.62, y: 0.25 }, { x: 0.35, y: 0.48 }, { x: 0.35, y: 0.75 }, { x: 0.65, y: 0.75 }, { x: 0.35, y: 0.50 }]
    ];
  } else if (char === '7') {
    return [
      [{ x: 0.32, y: 0.25 }, { x: 0.68, y: 0.25 }, { x: 0.42, y: 0.75 }]
    ];
  } else if (char === '8') {
    return [
      [{ x: 0.50, y: 0.25 }, { x: 0.68, y: 0.37 }, { x: 0.50, y: 0.50 }, { x: 0.32, y: 0.63 }, { x: 0.50, y: 0.75 }, { x: 0.68, y: 0.63 }, { x: 0.50, y: 0.50 }, { x: 0.32, y: 0.37 }, { x: 0.50, y: 0.25 }]
    ];
  } else if (char === '9') {
    return [
      [{ x: 0.65, y: 0.48 }, { x: 0.35, y: 0.48 }, { x: 0.35, y: 0.25 }, { x: 0.65, y: 0.25 }, { x: 0.65, y: 0.75 }]
    ];
  } else if (char === '10') {
    return [
      [{ x: 0.22, y: 0.40 }, { x: 0.32, y: 0.25 }, { x: 0.32, y: 0.75 }],
      [{ x: 0.55, y: 0.25 }, { x: 0.78, y: 0.25 }, { x: 0.78, y: 0.75 }, { x: 0.55, y: 0.75 }, { x: 0.55, y: 0.25 }],
    ];
  } else if (char === 'A' || char === 'А') {
    return [
      [{ x: 0.25, y: 0.75 }, { x: 0.50, y: 0.25 }],
      [{ x: 0.50, y: 0.25 }, { x: 0.75, y: 0.75 }],
      [{ x: 0.36, y: 0.52 }, { x: 0.64, y: 0.52 }],
    ];
  } else if (char === 'B' || char === 'Б') {
    return [
      [{ x: 0.30, y: 0.75 }, { x: 0.30, y: 0.25 }],
      [{ x: 0.30, y: 0.25 }, { x: 0.65, y: 0.36 }, { x: 0.30, y: 0.48 }],
      [{ x: 0.30, y: 0.48 }, { x: 0.70, y: 0.62 }, { x: 0.30, y: 0.75 }],
    ];
  } else if (char === 'C' || char === 'С') {
    return [
      [{ x: 0.70, y: 0.33 }, { x: 0.42, y: 0.25 }, { x: 0.30, y: 0.50 }, { x: 0.42, y: 0.75 }, { x: 0.70, y: 0.67 }]
    ];
  }

  // Generic natural multi-stroke preschool handwriting pattern
  if (isCursive) {
    return [
      [{ x: 0.22, y: 0.68 }, { x: 0.38, y: 0.28 }, { x: 0.62, y: 0.72 }, { x: 0.78, y: 0.32 }]
    ];
  }
  return [
    [{ x: 0.28, y: 0.25 }, { x: 0.72, y: 0.25 }],
    [{ x: 0.50, y: 0.25 }, { x: 0.50, y: 0.75 }],
    [{ x: 0.30, y: 0.75 }, { x: 0.70, y: 0.75 }],
  ];
};

export const ConstellationTracerOverlay = ({ onClose, mode = 'constellations', letterMode = 'print', letterLang = 'eng', onModeChange, onLangChange }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [itemIndex, setItemIndex] = useState(0);

  const stateRef = useRef({
    width: 0,
    height: 0,
    pointerActive: false,
    userDrawnStrokes: [] as { x: number; y: number }[][],
    currentStroke: [] as { x: number; y: number }[],
    completed: false,
  });

  useEffect(() => {
    stateRef.current.userDrawnStrokes = [];
    stateRef.current.currentStroke = [];
    stateRef.current.completed = false;
  }, [itemIndex, mode, letterMode, letterLang]);

  useEffect(() => {
    if (!isWeb || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      const { width, height } = Dimensions.get('window');
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      stateRef.current.width = width;
      stateRef.current.height = height;
    };
    
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const state = stateRef.current;
      const { width, height, userDrawnStrokes, currentStroke } = state;
      
      ctx.clearRect(0, 0, width | 0, height | 0);

      let nameText = '';
      let charToDraw = '';

      if (mode === 'abc') {
        const list = letterLang === 'ukr' ? ABC_UKR : ABC_ENG;
        charToDraw = list[itemIndex % list.length];
        nameText = `Letter ${charToDraw} (${letterMode === 'cursive' ? 'Cursive 𝓐a' : 'Print Aa'})`;
      } else if (mode === 'digits') {
        charToDraw = DIGITS_DATA[itemIndex % DIGITS_DATA.length];
        nameText = `Number ${charToDraw}`;
      } else {
        nameText = `Constellation ${itemIndex + 1}`;
      }

      // Title at bottom above footer
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '500 20px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(nameText, width / 2, height - 90);

      // Render REAL preschool letter watermark with handwriting stroke direction guides
      if (mode === 'abc' || mode === 'digits') {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.lineWidth = 4;
        ctx.font = letterMode === 'cursive' 
          ? 'italic bold 210px "Dancing Script", "Comic Sans MS", "Caveat", cursive' 
          : 'bold 230px system-ui, -apple-system, "Nunito", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(charToDraw, width / 2, height / 2 - 20);
        ctx.strokeText(charToDraw, width / 2, height / 2 - 20);
        ctx.restore();

        // Draw dotted stroke guidelines with arrow direction dots
        const strokes = GET_HANDWRITING_STROKES(charToDraw, letterMode === 'cursive');
        ctx.save();
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'rgba(190, 242, 100, 0.45)';
        ctx.setLineDash([8, 12]);
        for (const stroke of strokes) {
          if (stroke.length > 1) {
            ctx.beginPath();
            ctx.moveTo(stroke[0].x * width, stroke[0].y * height - 20);
            for (let i = 1; i < stroke.length; i++) {
              ctx.lineTo(stroke[i].x * width, stroke[i].y * height - 20);
            }
            ctx.stroke();

            // Draw start direction dot
            ctx.fillStyle = '#BEF264';
            ctx.beginPath();
            ctx.arc(stroke[0].x * width, stroke[0].y * height - 20, 8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // Render user's smooth handwriting ink strokes
      ctx.save();
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#5C9EAD';
      ctx.shadowColor = '#5C9EAD';
      ctx.shadowBlur = 10;

      for (const stroke of userDrawnStrokes) {
        if (stroke.length > 1) {
          ctx.beginPath();
          ctx.moveTo(stroke[0].x, stroke[0].y);
          for (let i = 1; i < stroke.length; i++) {
            ctx.lineTo(stroke[i].x, stroke[i].y);
          }
          ctx.stroke();
        }
      }

      if (currentStroke.length > 1) {
        ctx.beginPath();
        ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
        for (let i = 1; i < currentStroke.length; i++) {
          ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
        }
        ctx.stroke();
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [itemIndex, mode, letterMode, letterLang]);

  const handlePointerDown = (e: React.PointerEvent) => {
    stateRef.current.pointerActive = true;
    const pt = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    stateRef.current.currentStroke = [pt];
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (stateRef.current.pointerActive) {
      const pt = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
      stateRef.current.currentStroke.push(pt);
    }
  };

  const handlePointerUp = () => {
    if (stateRef.current.pointerActive) {
      stateRef.current.pointerActive = false;
      if (stateRef.current.currentStroke.length > 0) {
        stateRef.current.userDrawnStrokes.push([...stateRef.current.currentStroke]);
        stateRef.current.currentStroke = [];
      }
    }
  };

  const handleNextItem = () => {
    const list = mode === 'abc' ? (letterLang === 'ukr' ? ABC_UKR : ABC_ENG) : mode === 'digits' ? DIGITS_DATA : Array.from({ length: 50 });
    setItemIndex(prev => (prev + 1) % list.length);
  };

  const handlePrevItem = () => {
    const list = mode === 'abc' ? (letterLang === 'ukr' ? ABC_UKR : ABC_ENG) : mode === 'digits' ? DIGITS_DATA : Array.from({ length: 50 });
    setItemIndex(prev => (prev - 1 + list.length) % list.length);
  };

  if (!isWeb) {
    return (
      <View style={styles.container}>
        <Text style={{color: 'white'}}>Tracing requires Web Environment</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlobalBackground showClouds dimmed={false} />
      <SpaceTouchCanvas />
      <canvas
        ref={canvasRef}
        style={{ ...styles.canvas, touchAction: 'none' } as any}
        onPointerDown={handlePointerDown as any}
        onPointerMove={handlePointerMove as any}
        onPointerUp={handlePointerUp as any}
        onPointerCancel={handlePointerUp as any}
      />
      <Pressable style={styles.closeButton} onPress={onClose}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </Pressable>

      {/* Navigation Arrows for next/prev letter */}
      <View style={styles.navControls}>
        <Pressable style={styles.navChip} onPress={handlePrevItem}>
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </Pressable>
        <Pressable style={styles.navChip} onPress={handleNextItem}>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Top-Right Toggles strictly for ABC Letters screen */}
      {mode === 'abc' && (
        <View style={styles.topRightControls}>
          <Pressable 
            onPress={() => onLangChange && onLangChange(letterLang === 'eng' ? 'ukr' : 'eng')}
            style={styles.controlChip}
          >
            <Text style={styles.controlText}>
              {letterLang === 'eng' ? '🇬🇧 ENG' : '🇺🇦 UKR'}
            </Text>
          </Pressable>

          <Pressable 
            onPress={() => onModeChange && onModeChange(letterMode === 'print' ? 'cursive' : 'print')}
            style={[styles.controlChip, styles.controlChipActive]}
          >
            <Text style={styles.controlText}>
              {letterMode === 'print' ? 'Print Aa' : 'Cursive 𝓐a'}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Footer bar present on folder opening */}
      <AppTabBar activeRoute="Games" isFabActive={false} navContext="Default" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0b0f19',
    zIndex: 100,
  },
  canvas: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 30,
  },
  navControls: {
    position: 'absolute',
    top: 16,
    left: 74,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 30,
  },
  navChip: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRightControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 30,
  },
  controlChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  controlChipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderColor: '#FFFFFF',
  },
  controlText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 13,
  },
});
