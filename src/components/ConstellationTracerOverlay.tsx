import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const isWeb = Platform.OS === 'web';

interface Point {
  x: number;
  y: number;
}

const SPACE_COLORS = ['#F6C774', '#5C9EAD', '#F4F4F4', '#E8D5B7'];

interface Constellation {
  name: string;
  points: Point[];
}

// Normalized constellations (0.0 to 1.0) to scale with screen size
const CONSTELLATIONS: Constellation[] = [
  // 1. Ursa Major (Big Dipper)
  {
    name: 'Ursa Major (Big Dipper)',
    points: [
      { x: 0.18, y: 0.32 },
      { x: 0.35, y: 0.40 },
      { x: 0.48, y: 0.48 },
      { x: 0.65, y: 0.45 },
      { x: 0.78, y: 0.60 },
      { x: 0.55, y: 0.68 },
    ]
  },
  // 2. Cassiopeia (The Queen's Crown)
  {
    name: 'Cassiopeia (Queen Crown)',
    points: [
      { x: 0.18, y: 0.58 },
      { x: 0.32, y: 0.35 },
      { x: 0.50, y: 0.52 },
      { x: 0.68, y: 0.33 },
      { x: 0.82, y: 0.55 },
    ]
  },
  // 3. Cygnus (The Celestial Swan)
  {
    name: 'Cygnus (The Swan)',
    points: [
      { x: 0.50, y: 0.25 },
      { x: 0.50, y: 0.45 },
      { x: 0.22, y: 0.48 },
      { x: 0.78, y: 0.48 },
      { x: 0.50, y: 0.75 },
    ]
  },
  // 4. Orion's Belt
  {
    name: "Orion's Belt",
    points: [
      { x: 0.28, y: 0.30 },
      { x: 0.35, y: 0.50 },
      { x: 0.50, y: 0.50 },
      { x: 0.65, y: 0.50 },
      { x: 0.72, y: 0.70 },
    ]
  },
  // 5. Delphinus (The Playful Dolphin)
  {
    name: 'Delphinus (Dolphin)',
    points: [
      { x: 0.50, y: 0.30 },
      { x: 0.32, y: 0.45 },
      { x: 0.50, y: 0.60 },
      { x: 0.68, y: 0.45 },
      { x: 0.62, y: 0.78 },
    ]
  },
  // 6. Leo (The Majestic Lion)
  {
    name: 'Leo (The Lion)',
    points: [
      { x: 0.20, y: 0.62 },
      { x: 0.42, y: 0.62 },
      { x: 0.55, y: 0.45 },
      { x: 0.72, y: 0.32 },
      { x: 0.82, y: 0.48 },
    ]
  },
  // 7. Pegasus (Winged Horse)
  {
    name: 'Pegasus (Winged Horse)',
    points: [
      { x: 0.25, y: 0.32 },
      { x: 0.75, y: 0.32 },
      { x: 0.75, y: 0.65 },
      { x: 0.25, y: 0.65 },
      { x: 0.15, y: 0.78 },
    ]
  },
  // 8. Taurus (The Mighty Bull)
  {
    name: 'Taurus (The Bull)',
    points: [
      { x: 0.20, y: 0.30 },
      { x: 0.42, y: 0.48 },
      { x: 0.50, y: 0.62 },
      { x: 0.68, y: 0.48 },
      { x: 0.80, y: 0.28 },
    ]
  },
  // 9. Phoenix (Firebird)
  {
    name: 'Phoenix (Firebird)',
    points: [
      { x: 0.50, y: 0.72 },
      { x: 0.50, y: 0.48 },
      { x: 0.18, y: 0.35 },
      { x: 0.50, y: 0.28 },
      { x: 0.82, y: 0.35 },
    ]
  },
  // 10. Lyra (Magic Diamond)
  {
    name: 'Lyra (Magic Diamond)',
    points: [
      { x: 0.50, y: 0.28 },
      { x: 0.75, y: 0.48 },
      { x: 0.50, y: 0.68 },
      { x: 0.25, y: 0.48 },
      { x: 0.50, y: 0.28 },
    ]
  },
  // 11. Crux (Southern Cross)
  {
    name: 'Crux (Southern Cross)',
    points: [
      { x: 0.50, y: 0.28 },
      { x: 0.50, y: 0.72 },
      { x: 0.22, y: 0.48 },
      { x: 0.78, y: 0.48 },
    ]
  },
  // 12. Corona Australis (Star Arc)
  {
    name: 'Corona Australis (Star Arc)',
    points: [
      { x: 0.18, y: 0.40 },
      { x: 0.32, y: 0.58 },
      { x: 0.50, y: 0.65 },
      { x: 0.68, y: 0.58 },
      { x: 0.82, y: 0.40 },
    ]
  },
  // 13. Triangulum (Star Triangle)
  {
    name: 'Triangulum (Star Triangle)',
    points: [
      { x: 0.50, y: 0.28 },
      { x: 0.80, y: 0.65 },
      { x: 0.20, y: 0.65 },
      { x: 0.50, y: 0.28 },
    ]
  },
  // 14. Aquila (The Eagle)
  {
    name: 'Aquila (The Eagle)',
    points: [
      { x: 0.50, y: 0.25 },
      { x: 0.20, y: 0.45 },
      { x: 0.50, y: 0.55 },
      { x: 0.80, y: 0.45 },
      { x: 0.50, y: 0.75 },
    ]
  },
  // 15. Scorpius (Star Hook)
  {
    name: 'Scorpius (Star Hook)',
    points: [
      { x: 0.25, y: 0.30 },
      { x: 0.45, y: 0.38 },
      { x: 0.55, y: 0.52 },
      { x: 0.55, y: 0.68 },
      { x: 0.72, y: 0.72 },
      { x: 0.78, y: 0.60 },
    ]
  }
];

const COLORS = {
  bg: '#0F172A',
  star: '#F6C774',
  guide: 'rgba(255, 255, 255, 0.2)',
  trace: '#5C9EAD',
  burst: '#FFD700',
};

const SNAP_RADIUS = 50;

class Particle {
  active = false;
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  life = 0;
  maxLife = 0;
  color = COLORS.trace;
  size = 2;

  spawn(x: number, y: number, isBurst = false) {
    this.active = true;
    this.x = x;
    this.y = y;
    this.color = SPACE_COLORS[Math.floor(Math.random() * SPACE_COLORS.length)];
    if (isBurst) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.maxLife = Math.random() * 30 + 30; // 30-60 frames
      this.size = Math.random() * 3 + 2;
    } else {
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.maxLife = Math.random() * 15 + 15; // 15-30 frames
      this.size = Math.random() * 2 + 1;
    }
    this.life = this.maxLife;
  }

  update() {
    if (!this.active) return;
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    if (this.life <= 0) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.active) return;
    const alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x | 0, this.y | 0, this.size | 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
}

interface Props {
  onClose: () => void;
}

export const ConstellationTracerOverlay = ({ onClose }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Game state refs (to avoid re-renders in animation loop)
  const stateRef = useRef({
    width: 0,
    height: 0,
    constellationIndex: 0,
    connectedStars: [0], // always start at first star
    pointerActive: false,
    pointerX: -100,
    pointerY: -100,
    successState: false,
    successTimer: 0,
    particles: Array.from({ length: 200 }, () => new Particle()),
  });

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

    const spawnParticles = (x: number, y: number, count: number, isBurst = false) => {
      let spawned = 0;
      for (const p of stateRef.current.particles) {
        if (!p.active) {
          p.spawn(x, y, isBurst);
          spawned++;
          if (spawned >= count) break;
        }
      }
    };

    const draw = () => {
      const state = stateRef.current;
      const { width, height, constellationIndex, connectedStars, pointerActive, pointerX, pointerY, successState } = state;
      
      // Clear background
      ctx.clearRect(0, 0, width | 0, height | 0);

      const constellation = CONSTELLATIONS[constellationIndex];
      const normalizedPoints = constellation.points;
      const points = normalizedPoints.map(p => ({
        x: (p.x * width) | 0,
        y: (p.y * height) | 0
      }));

      // Draw constellation name at bottom
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '500 20px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(constellation.name, width / 2, height - 40);

      // Draw dashed guide lines
      ctx.lineWidth = 2;
      ctx.strokeStyle = COLORS.guide;
      ctx.setLineDash([10, 15]);
      ctx.beginPath();
      for (let i = 0; i < points.length - 1; i++) {
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[i+1].x, points[i+1].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw solid lines for connected stars
      if (connectedStars.length > 1) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = successState ? COLORS.burst : COLORS.trace;
        ctx.beginPath();
        ctx.moveTo(points[connectedStars[0]].x, points[connectedStars[0]].y);
        for (let i = 1; i < connectedStars.length; i++) {
          ctx.lineTo(points[connectedStars[i]].x, points[connectedStars[i]].y);
        }
        ctx.stroke();
      }

      // Draw current trace line to pointer
      if (pointerActive && !successState && connectedStars.length > 0) {
        const lastConnectedIndex = connectedStars[connectedStars.length - 1];
        const startPoint = points[lastConnectedIndex];
        
        ctx.lineWidth = 3;
        ctx.strokeStyle = COLORS.trace;
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(pointerX | 0, pointerY | 0);
        ctx.stroke();

        // Emit dust trail
        if (Math.random() > 0.5) {
          spawnParticles(pointerX, pointerY, 1, false);
        }
      }

      // Draw star nodes
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const isConnected = connectedStars.includes(i);
        const isNext = !successState && i === connectedStars.length;

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, isNext ? 20 : 15);
        gradient.addColorStop(0, isConnected || successState ? COLORS.star : 'rgba(246, 199, 116, 0.5)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(p.x, p.y, isNext ? 4 : 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw particles
      for (const p of state.particles) {
        if (p.active) {
          p.update();
          p.draw(ctx);
        }
      }

      // Handle success state transition
      if (successState) {
        state.successTimer -= 16; // approx 16ms per frame
        if (state.successTimer <= 0) {
          // Next constellation
          state.constellationIndex = (state.constellationIndex + 1) % CONSTELLATIONS.length;
          state.connectedStars = [0];
          state.successState = false;
        }
      } else if (pointerActive) {
        // Proximity snapping check for the next star
        const nextIndex = connectedStars.length;
        if (nextIndex < points.length) {
          const nextTarget = points[nextIndex];
          const dx = pointerX - nextTarget.x;
          const dy = pointerY - nextTarget.y;
          const distSq = dx * dx + dy * dy;
          
          if (distSq < SNAP_RADIUS * SNAP_RADIUS) {
            // Snapped!
            state.connectedStars.push(nextIndex);
            
            // Check for completion
            if (state.connectedStars.length === points.length) {
              state.successState = true;
              state.successTimer = 1500; // 1.5 seconds pause
              
              // Celebrate burst
              for (let i = 0; i < points.length; i++) {
                spawnParticles(points[i].x, points[i].y, 15, true);
              }
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    stateRef.current.pointerActive = true;
    stateRef.current.pointerX = e.nativeEvent.offsetX;
    stateRef.current.pointerY = e.nativeEvent.offsetY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (stateRef.current.pointerActive) {
      stateRef.current.pointerX = e.nativeEvent.offsetX;
      stateRef.current.pointerY = e.nativeEvent.offsetY;
    }
  };

  const handlePointerUp = () => {
    stateRef.current.pointerActive = false;
  };

  if (!isWeb) {
    return (
      <View style={styles.container}>
        <Text style={{color: 'white'}}>Constellation Tracer requires Web Environment</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 15, 25, 0.35)',
    zIndex: 100,
  },
  canvas: {
    flex: 1,
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
  },
});
