import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Text, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { GlobalBackground } from './GlobalBackground';
import { SpaceTouchCanvas } from './SpaceTouchCanvas';
import { AppTabBar } from './AppTabBar';
import { TopBar } from './TopBar';
import { theme, FONTS } from '../theme';

const isWeb = Platform.OS === 'web';

const ABC_ENG = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const ABC_UKR = ['А','Б','В','Г','Ґ','Д','Е','Є','Ж','З','И','І','Ї','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ь','Ю','Я'];
const DIGITS_DATA = ['1','2','3','4','5','6','7','8','9','10'];

interface Props {
  onClose: () => void;
  mode?: 'constellations' | 'abc' | 'digits';
  letterMode?: 'print' | 'cursive';
  letterLang?: 'eng' | 'ukr';
  onModeChange?: (mode: 'print' | 'cursive') => void;
  onLangChange?: (lang: 'eng' | 'ukr') => void;
}

// 50 Normalized constellations (0.0 to 1.0) to scale with screen size
const CONSTELLATIONS = [
  { name: 'Ursa Major (Big Dipper)', points: [{ x: 0.18, y: 0.32 }, { x: 0.35, y: 0.40 }, { x: 0.48, y: 0.48 }, { x: 0.65, y: 0.45 }, { x: 0.78, y: 0.60 }, { x: 0.55, y: 0.68 }] },
  { name: 'Cassiopeia (Queen Crown)', points: [{ x: 0.18, y: 0.58 }, { x: 0.32, y: 0.35 }, { x: 0.50, y: 0.52 }, { x: 0.68, y: 0.33 }, { x: 0.82, y: 0.55 }] },
  { name: 'Cygnus (The Swan)', points: [{ x: 0.50, y: 0.25 }, { x: 0.50, y: 0.45 }, { x: 0.22, y: 0.48 }, { x: 0.78, y: 0.48 }, { x: 0.50, y: 0.75 }] },
  { name: "Orion's Belt", points: [{ x: 0.25, y: 0.50 }, { x: 0.50, y: 0.50 }, { x: 0.75, y: 0.50 }] },
  { name: 'Leo (The Lion)', points: [{ x: 0.20, y: 0.60 }, { x: 0.35, y: 0.45 }, { x: 0.50, y: 0.30 }, { x: 0.68, y: 0.35 }, { x: 0.80, y: 0.55 }, { x: 0.55, y: 0.65 }] },
  { name: 'Scorpius (The Scorpion)', points: [{ x: 0.20, y: 0.30 }, { x: 0.35, y: 0.25 }, { x: 0.45, y: 0.40 }, { x: 0.55, y: 0.60 }, { x: 0.70, y: 0.70 }, { x: 0.82, y: 0.58 }] },
  { name: 'Pegasus (Winged Horse)', points: [{ x: 0.25, y: 0.30 }, { x: 0.75, y: 0.30 }, { x: 0.75, y: 0.70 }, { x: 0.25, y: 0.70 }, { x: 0.25, y: 0.30 }] },
  { name: 'Taurus (The Bull)', points: [{ x: 0.20, y: 0.35 }, { x: 0.45, y: 0.45 }, { x: 0.70, y: 0.30 }, { x: 0.80, y: 0.60 }] },
  { name: 'Canis Major (Great Dog)', points: [{ x: 0.30, y: 0.30 }, { x: 0.50, y: 0.45 }, { x: 0.70, y: 0.65 }, { x: 0.40, y: 0.70 }] },
  { name: 'Aquarius (Water Bearer)', points: [{ x: 0.20, y: 0.40 }, { x: 0.40, y: 0.30 }, { x: 0.60, y: 0.50 }, { x: 0.80, y: 0.40 }] },
  { name: 'Andromeda (Chained Maiden)', points: [{ x: 0.15, y: 0.65 }, { x: 0.35, y: 0.45 }, { x: 0.55, y: 0.35 }, { x: 0.80, y: 0.25 }] },
  { name: 'Aquila (The Eagle)', points: [{ x: 0.50, y: 0.25 }, { x: 0.20, y: 0.50 }, { x: 0.50, y: 0.70 }, { x: 0.80, y: 0.50 }] },
  { name: 'Ara (The Altar)', points: [{ x: 0.30, y: 0.30 }, { x: 0.70, y: 0.30 }, { x: 0.60, y: 0.70 }, { x: 0.40, y: 0.70 }] },
  { name: 'Aries (The Ram)', points: [{ x: 0.20, y: 0.60 }, { x: 0.50, y: 0.40 }, { x: 0.80, y: 0.30 }] },
  { name: 'Auriga (The Charioteer)', points: [{ x: 0.50, y: 0.20 }, { x: 0.75, y: 0.40 }, { x: 0.65, y: 0.70 }, { x: 0.35, y: 0.70 }, { x: 0.25, y: 0.40 }] },
  { name: 'Boötes (The Herdsman)', points: [{ x: 0.50, y: 0.75 }, { x: 0.30, y: 0.45 }, { x: 0.50, y: 0.25 }, { x: 0.70, y: 0.45 }] },
  { name: 'Cancer (The Crab)', points: [{ x: 0.50, y: 0.50 }, { x: 0.25, y: 0.30 }, { x: 0.75, y: 0.30 }, { x: 0.50, y: 0.75 }] },
  { name: 'Canis Minor (Little Dog)', points: [{ x: 0.35, y: 0.50 }, { x: 0.65, y: 0.50 }] },
  { name: 'Capricornus (Sea Goat)', points: [{ x: 0.20, y: 0.40 }, { x: 0.40, y: 0.65 }, { x: 0.65, y: 0.65 }, { x: 0.80, y: 0.35 }] },
  { name: 'Centaurus (The Centaur)', points: [{ x: 0.25, y: 0.70 }, { x: 0.45, y: 0.50 }, { x: 0.55, y: 0.30 }, { x: 0.75, y: 0.45 }] },
  { name: 'Cepheus (King House)', points: [{ x: 0.50, y: 0.25 }, { x: 0.75, y: 0.48 }, { x: 0.75, y: 0.75 }, { x: 0.25, y: 0.75 }, { x: 0.25, y: 0.48 }] },
  { name: 'Cetus (Sea Monster)', points: [{ x: 0.20, y: 0.40 }, { x: 0.35, y: 0.30 }, { x: 0.55, y: 0.50 }, { x: 0.75, y: 0.40 }, { x: 0.85, y: 0.60 }] },
  { name: 'Columba (Celestial Dove)', points: [{ x: 0.30, y: 0.40 }, { x: 0.50, y: 0.30 }, { x: 0.70, y: 0.45 }, { x: 0.50, y: 0.65 }] },
  { name: 'Corvus (The Crow)', points: [{ x: 0.30, y: 0.35 }, { x: 0.70, y: 0.35 }, { x: 0.60, y: 0.68 }, { x: 0.25, y: 0.60 }] },
  { name: 'Crater (Star Goblet)', points: [{ x: 0.30, y: 0.30 }, { x: 0.70, y: 0.30 }, { x: 0.60, y: 0.55 }, { x: 0.50, y: 0.75 }] },
  { name: 'Draco (The Dragon)', points: [{ x: 0.20, y: 0.30 }, { x: 0.40, y: 0.25 }, { x: 0.65, y: 0.40 }, { x: 0.50, y: 0.60 }, { x: 0.75, y: 0.70 }] },
  { name: 'Gemini (The Twins)', points: [{ x: 0.30, y: 0.25 }, { x: 0.30, y: 0.75 }, { x: 0.70, y: 0.75 }, { x: 0.70, y: 0.25 }] },
  { name: 'Hercules (Hero Shield)', points: [{ x: 0.35, y: 0.30 }, { x: 0.65, y: 0.30 }, { x: 0.75, y: 0.55 }, { x: 0.50, y: 0.75 }, { x: 0.25, y: 0.55 }] },
  { name: 'Hydra (Water Snake)', points: [{ x: 0.15, y: 0.45 }, { x: 0.32, y: 0.35 }, { x: 0.50, y: 0.55 }, { x: 0.70, y: 0.40 }, { x: 0.88, y: 0.60 }] },
  { name: 'Hydra Minor (Little Serpent)', points: [{ x: 0.25, y: 0.55 }, { x: 0.45, y: 0.38 }, { x: 0.75, y: 0.55 }] },
  { name: 'Libra (The Scales)', points: [{ x: 0.50, y: 0.30 }, { x: 0.25, y: 0.50 }, { x: 0.75, y: 0.50 }, { x: 0.50, y: 0.72 }] },
  { name: 'Lupus (Star Wolf)', points: [{ x: 0.25, y: 0.40 }, { x: 0.45, y: 0.30 }, { x: 0.65, y: 0.50 }, { x: 0.55, y: 0.75 }] },
  { name: 'Lynx (The Lynx)', points: [{ x: 0.18, y: 0.65 }, { x: 0.40, y: 0.50 }, { x: 0.62, y: 0.40 }, { x: 0.82, y: 0.30 }] },
  { name: 'Monoceros (The Unicorn)', points: [{ x: 0.50, y: 0.25 }, { x: 0.35, y: 0.50 }, { x: 0.65, y: 0.65 }, { x: 0.75, y: 0.45 }] },
  { name: 'Ophiuchus (Serpent Bearer)', points: [{ x: 0.50, y: 0.25 }, { x: 0.25, y: 0.45 }, { x: 0.35, y: 0.75 }, { x: 0.65, y: 0.75 }] },
  { name: 'Orion (Great Hunter)', points: [{ x: 0.30, y: 0.25 }, { x: 0.70, y: 0.25 }, { x: 0.50, y: 0.50 }, { x: 0.25, y: 0.75 }, { x: 0.75, y: 0.75 }] },
  { name: 'Pisces (The Fishes)', points: [{ x: 0.20, y: 0.30 }, { x: 0.40, y: 0.65 }, { x: 0.60, y: 0.65 }, { x: 0.80, y: 0.30 }] },
  { name: 'Piscis Austrinus (Fish)', points: [{ x: 0.25, y: 0.50 }, { x: 0.50, y: 0.32 }, { x: 0.75, y: 0.50 }, { x: 0.50, y: 0.68 }] },
  { name: 'Sagitta (The Arrow)', points: [{ x: 0.20, y: 0.50 }, { x: 0.70, y: 0.50 }, { x: 0.85, y: 0.35 }] },
  { name: 'Sagittarius (The Archer)', points: [{ x: 0.25, y: 0.60 }, { x: 0.45, y: 0.40 }, { x: 0.70, y: 0.30 }, { x: 0.75, y: 0.55 }] },
  { name: 'Serpens (The Snake)', points: [{ x: 0.20, y: 0.65 }, { x: 0.35, y: 0.40 }, { x: 0.55, y: 0.60 }, { x: 0.75, y: 0.35 }] },
  { name: 'Ursa Minor (Little Dipper)', points: [{ x: 0.80, y: 0.25 }, { x: 0.65, y: 0.35 }, { x: 0.50, y: 0.42 }, { x: 0.35, y: 0.50 }, { x: 0.20, y: 0.65 }] },
  { name: 'Vela (The Sails)', points: [{ x: 0.30, y: 0.70 }, { x: 0.50, y: 0.25 }, { x: 0.75, y: 0.60 }] },
  { name: 'Virgo (The Maiden)', points: [{ x: 0.25, y: 0.30 }, { x: 0.45, y: 0.45 }, { x: 0.65, y: 0.35 }, { x: 0.75, y: 0.65 }] },
  { name: 'Volans (Flying Fish)', points: [{ x: 0.50, y: 0.30 }, { x: 0.25, y: 0.55 }, { x: 0.50, y: 0.75 }, { x: 0.75, y: 0.55 }] },
  { name: 'Vulpecula (The Fox)', points: [{ x: 0.20, y: 0.45 }, { x: 0.50, y: 0.45 }, { x: 0.80, y: 0.55 }] }
];

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

class StarDustParticle {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
  size: number = 0;
  color: string = '#BEF264';
  life: number = 0;
  maxLife: number = 0;
  active: boolean = false;

  spawn(x: number, y: number) {
    this.x = x + (Math.random() - 0.5) * 10;
    this.y = y + (Math.random() - 0.5) * 10;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5 - 0.5;
    this.size = Math.random() * 3 + 1.5;
    this.color = ['#BEF264', '#F6C774', '#5C9EAD', '#FFFFFF'][Math.floor(Math.random() * 4)];
    this.life = 0;
    this.maxLife = Math.random() * 30 + 20;
    this.active = true;
  }

  update() {
    if (!this.active) return;
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life >= this.maxLife) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.active) return;
    const alpha = 1 - (this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export const ConstellationTracerOverlay = ({ onClose, mode = 'constellations', letterMode = 'print', letterLang = 'eng', onModeChange, onLangChange }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [itemIndex, setItemIndex] = useState(0);

  const stateRef = useRef({
    width: 0,
    height: 0,
    pointerActive: false,
    pointerX: -100,
    pointerY: -100,
    connectedStars: [0],
    successState: false,
    userDrawnStrokes: [] as { x: number; y: number }[][],
    currentStroke: [] as { x: number; y: number }[],
    particles: Array.from({ length: 150 }, () => new StarDustParticle()),
    completed: false,
  });

  useEffect(() => {
    stateRef.current.userDrawnStrokes = [];
    stateRef.current.currentStroke = [];
    stateRef.current.connectedStars = [0];
    stateRef.current.successState = false;
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
      const { width, height, userDrawnStrokes, currentStroke, particles, connectedStars, pointerActive, pointerX, pointerY, successState } = state;
      
      ctx.clearRect(0, 0, width | 0, height | 0);

      let nameText = '';
      let charToDraw = '';

      if (mode === 'abc') {
        const list = letterLang === 'ukr' ? ABC_UKR : ABC_ENG;
        charToDraw = list[itemIndex % list.length];
        nameText = `Letter ${charToDraw}`;
      } else if (mode === 'digits') {
        charToDraw = DIGITS_DATA[itemIndex % DIGITS_DATA.length];
        nameText = `Number ${charToDraw}`;
      } else {
        const constellation = CONSTELLATIONS[itemIndex % CONSTELLATIONS.length];
        nameText = constellation.name;
      }

      // Constellations Mode: Golden magic star tracer with proximity snapping
      if (mode === 'constellations') {
        const constellation = CONSTELLATIONS[itemIndex % CONSTELLATIONS.length];
        const points = constellation.points.map(p => ({
          x: (p.x * width) | 0,
          y: (p.y * height) | 0
        }));

        // Draw current constellation name centered under top header in clean white text (with letterSpacing emulation)
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '500 20px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        // Add tiny letter spacing by drawing with custom tracking spaces
        const spacedName = nameText.split('').join('\u200A');
        ctx.fillText(spacedName, width / 2, 110);

        // 1. Dashed guide lines
        // 1. Dashed guide lines (more white)
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.setLineDash([8, 12]);
        ctx.beginPath();
        for (let i = 0; i < points.length - 1; i++) {
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[i+1].x, points[i+1].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // 2. White solid line for connected stars
        if (connectedStars.length > 1) {
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.moveTo(points[connectedStars[0]].x, points[connectedStars[0]].y);
          for (let i = 1; i < connectedStars.length; i++) {
            ctx.lineTo(points[connectedStars[i]].x, points[connectedStars[i]].y);
          }
          ctx.stroke();
        }

        // 3. Live active golden beam line to finger/pointer
        if (pointerActive && !successState && connectedStars.length > 0) {
          const lastConnectedIndex = connectedStars[connectedStars.length - 1];
          const startPoint = points[lastConnectedIndex];
          
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(pointerX, pointerY);
          ctx.stroke();

          if (Math.random() > 0.4) {
            spawnStarDust(pointerX, pointerY, 1);
          }
        }

        // 4. Star nodes with golden aura
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          const isConnected = connectedStars.includes(i);
          const isNext = !successState && i === connectedStars.length;

          const gradient = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, isNext ? 22 : 16);
          gradient.addColorStop(0, isConnected || successState ? '#F6C774' : 'rgba(246, 199, 116, 0.45)');
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, isNext ? 22 : 16, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(p.x, p.y, isNext ? 5 : 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Proximity snapping logic for constellations
        if (pointerActive && !successState) {
          const nextIndex = connectedStars.length;
          if (nextIndex < points.length) {
            const target = points[nextIndex];
            const dx = pointerX - target.x;
            const dy = pointerY - target.y;
            if (dx * dx + dy * dy < 55 * 55) {
              connectedStars.push(nextIndex);
              spawnStarDust(target.x, target.y, 12);
              if (connectedStars.length === points.length) {
                state.successState = true;
              }
            }
          }
        }
      }

      // ABC / Digits Handwriting Mode: Smooth freehand ink strokes
      if (mode === 'abc' || mode === 'digits') {
        // No title text rendered inside letters and digits tracing screens
        ctx.save();
        ctx.fillStyle = 'transparent';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)'; // More white dashes
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 10]);
        // Restrained standard letter slant: Nunito / system fonts (removed extreme italic right incline for cursive)
        ctx.font = (letterMode === 'cursive' && mode !== 'digits')
          ? 'italic 500 240px "Dancing Script", "Comic Sans MS", "Caveat", cursive' 
          : '500 250px system-ui, -apple-system, "Nunito", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(charToDraw, width / 2, height / 2 - 20);
        ctx.restore();

        ctx.save();
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#5C9EAD';

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
      }

      // Update and draw star dust particles
      for (const p of particles) {
        if (p.active) {
          p.update();
          p.draw(ctx);
        }
      }

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
    stateRef.current.pointerX = pt.x;
    stateRef.current.pointerY = pt.y;
    if (mode !== 'constellations') {
      stateRef.current.currentStroke = [pt];
    }
    spawnStarDust(pt.x, pt.y, 3);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (stateRef.current.pointerActive) {
      const pt = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
      stateRef.current.pointerX = pt.x;
      stateRef.current.pointerY = pt.y;
      if (mode !== 'constellations') {
        stateRef.current.currentStroke.push(pt);
      }
      if (Math.random() > 0.3) {
        spawnStarDust(pt.x, pt.y, 2);
      }
    }
  };

  const spawnStarDust = (x: number, y: number, count: number) => {
    let spawned = 0;
    for (const p of stateRef.current.particles) {
      if (!p.active) {
        p.spawn(x, y);
        spawned++;
        if (spawned >= count) break;
      }
    }
  };

  const handlePointerUp = () => {
    if (stateRef.current.pointerActive) {
      stateRef.current.pointerActive = false;
      if (mode !== 'constellations' && stateRef.current.currentStroke.length > 0) {
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
      {/* Dark overlay to match puzzle screen darkness and boost tracing lines legibility */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(11, 15, 25, 0.45)', zIndex: 2 }]} pointerEvents="none" />
      <canvas
        ref={canvasRef}
        style={{ ...styles.canvas, touchAction: 'none' } as any}
        onPointerDown={handlePointerDown as any}
        onPointerMove={handlePointerMove as any}
        onPointerUp={handlePointerUp as any}
        onPointerCancel={handlePointerUp as any}
      />
      {/* Custom back button and green folder name tag centered under header exactly matching Puzzle screen style */}
      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', paddingTop: 24, marginBottom: theme.spacing.md, zIndex: 30, paddingHorizontal: theme.spacing.md, position: 'absolute', top: 0, left: 0, right: 0 }}>
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <Pressable 
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, marginLeft: -4 }}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={{ flex: 2, alignItems: 'center' }}>
          <View style={{
            minWidth: 120,
            backgroundColor: '#BEF264',
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderWidth: 0,
            borderRadius: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            {mode === 'constellations' ? (
              <Ionicons name="star-outline" size={16} color="#0C4A6E" style={{ marginRight: 4 }} />
            ) : mode === 'abc' ? (
              <Ionicons name="text-outline" size={16} color="#0C4A6E" style={{ marginRight: 4 }} />
            ) : (
              <Ionicons name="calculator-outline" size={16} color="#0C4A6E" style={{ marginRight: 4 }} />
            )}
            <Text style={{
              fontFamily: FONTS.regular,
              fontSize: 14,
              fontWeight: '600',
              color: '#0C4A6E',
              letterSpacing: 0,
            }} numberOfLines={1}>
              {mode === 'constellations' ? 'Constellations' : mode === 'abc' ? 'ABC Letters' : 'Numbers'}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1, alignItems: 'flex-end' }} />
      </View>

      {/* 20% shorter navigation arrows (67px) in tag green color (#BEF264), hiding left arrow on first item */}
      <View style={styles.navControls}>
        <View style={{ width: 80, height: 44, opacity: itemIndex === 0 ? 0 : 1 }} pointerEvents={itemIndex === 0 ? 'none' : 'auto'}>
          <Pressable style={styles.navChipLong} onPress={handlePrevItem} hitSlop={15}>
            <Svg width={67} height={20} viewBox="0 0 67 20">
              <Path 
                d="M 62 10 L 5 10 M 15 2 L 5 10 L 15 18" 
                stroke="#BEF264" 
                strokeOpacity={0.45}
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </Pressable>
        </View>

        <Pressable style={styles.navChipLong} onPress={handleNextItem} hitSlop={15}>
          <Svg width={67} height={20} viewBox="0 0 67 20">
            <Path 
              d="M 5 10 L 62 10 M 52 2 L 62 10 L 52 18" 
              stroke="#BEF264" 
              strokeOpacity={0.95}
              strokeWidth="1.8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </Pressable>
      </View>

      {/* Centered Toggles strictly for ABC Letters screen */}
      {mode === 'abc' && (
        <View style={styles.centeredControls}>
          <Pressable 
            onPress={() => onLangChange && onLangChange(letterLang === 'eng' ? 'ukr' : 'eng')}
            style={[styles.controlChipCircular, styles.controlChipActive]}
          >
            <Text style={[styles.controlText, { fontSize: 13, fontWeight: '700', lineHeight: 18 }]}>
              {letterLang === 'eng' ? 'EN' : 'UA'}
            </Text>
          </Pressable>

          <Pressable 
            onPress={() => onModeChange && onModeChange(letterMode === 'print' ? 'cursive' : 'print')}
            style={[styles.controlChipCircular, styles.controlChipActive]}
          >
            <Text style={[styles.controlText, { fontSize: 17, fontWeight: '700', lineHeight: 20 }]}>
              {letterMode === 'print' ? 'A' : '𝓐'}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Full screen immersive tracing without footer */}
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
    bottom: 95,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 60,
    zIndex: 30,
  },
  navChipLong: {
    width: 80,
    height: 44,
    backgroundColor: 'transparent',
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredControls: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    zIndex: 30,
  },
  controlChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  controlChipCircular: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
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
