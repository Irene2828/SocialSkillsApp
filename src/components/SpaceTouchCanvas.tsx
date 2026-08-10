/**
 * SpaceTouchCanvas — Ultra-lightweight 2D canvas particle overlay.
 *
 * Architecture (all non-negotiable for iPhone 8 / 2GB RAM @ 60fps):
 *   • Pre-allocated object pool of 50 particles — zero allocations inside rAF.
 *   • Integer-locked (| 0) coordinates for ctx.arc to eliminate sub-pixel GPU work.
 *   • IntersectionObserver gates the rAF loop: fully paused when off-screen.
 *   • Max 8 particles per touch burst, 400–600ms lifetime with friction decay.
 *   • pointer-events: none so the Start button underneath is never blocked.
 *   • Handles both touchstart + mousedown; resize without leaks.
 *
 * Color palette: Scandinavian-toy matte tones.
 */
import React, { useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';

// ── Palette ──────────────────────────────────────────────────────────────────
const COLORS = [
  '#F6C774', // soft matte gold
  '#F6C774',
  '#5C9EAD', // muted teal
  '#5C9EAD',
  '#F4F4F4', // pale off-white
  '#E8D5B7', // warm sand
];

// Pre-parse colors to [r, g, b] once so we never call parseInt inside rAF.
const COLOR_RGB: [number, number, number][] = COLORS.map((hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
});

// ── Pool sizing ──────────────────────────────────────────────────────────────
const POOL_SIZE = 50;
const BURST_COUNT = 7; // 6–8 per touch; 7 is the sweet-spot.
const PARTICLE_LIFETIME_MIN = 400; // ms
const PARTICLE_LIFETIME_MAX = 600;
const FRICTION = 0.96;
const INITIAL_SPEED_MIN = 1.2;
const INITIAL_SPEED_MAX = 3.5;
const INITIAL_RADIUS_MIN = 1.5;
const INITIAL_RADIUS_MAX = 3.5;

// ── Particle shape (flat struct, no class) ───────────────────────────────────
interface Particle {
  alive: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  initialRadius: number;
  opacity: number;
  colorIdx: number;
  life: number;    // remaining ms
  maxLife: number;  // total ms (for normalised t)
}

/** Create a dead particle (pool slot). */
const deadParticle = (): Particle => ({
  alive: false,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  radius: 0,
  initialRadius: 0,
  opacity: 0,
  colorIdx: 0,
  life: 0,
  maxLife: 1,
});

// ── Component ────────────────────────────────────────────────────────────────

export const SpaceTouchCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const poolRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const visibleRef = useRef<boolean>(true);
  const runningRef = useRef<boolean>(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // ── Burst spawner (no allocations) ───────────────────────────────────────
  const burst = useCallback((cx: number, cy: number) => {
    const pool = poolRef.current;
    let spawned = 0;
    for (let i = 0; i < POOL_SIZE && spawned < BURST_COUNT; i++) {
      const p = pool[i];
      if (p.alive) continue;

      const angle = Math.random() * 6.283185307; // 2π
      const speed =
        INITIAL_SPEED_MIN + Math.random() * (INITIAL_SPEED_MAX - INITIAL_SPEED_MIN);
      const r =
        INITIAL_RADIUS_MIN + Math.random() * (INITIAL_RADIUS_MAX - INITIAL_RADIUS_MIN);
      const lifetime =
        PARTICLE_LIFETIME_MIN +
        Math.random() * (PARTICLE_LIFETIME_MAX - PARTICLE_LIFETIME_MIN);

      p.alive = true;
      p.x = cx;
      p.y = cy;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.radius = r;
      p.initialRadius = r;
      p.opacity = 0.85 + Math.random() * 0.15;
      p.colorIdx = (Math.random() * COLOR_RGB.length) | 0;
      p.life = lifetime;
      p.maxLife = lifetime;
      spawned++;
    }
  }, []);

  // ── Main loop (zero allocs) ──────────────────────────────────────────────
  const tick = useCallback((now: number) => {
    if (!visibleRef.current) {
      runningRef.current = false;
      return;
    }

    const dt = lastTimeRef.current === 0 ? 16 : now - lastTimeRef.current;
    lastTimeRef.current = now;

    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const pool = poolRef.current;
    let anyAlive = false;

    for (let i = 0; i < POOL_SIZE; i++) {
      const p = pool[i];
      if (!p.alive) continue;

      // Physics step
      p.life -= dt;
      if (p.life <= 0) {
        p.alive = false;
        continue;
      }

      anyAlive = true;
      p.vx *= FRICTION;
      p.vy *= FRICTION;
      p.x += p.vx;
      p.y += p.vy;

      // Normalised progress 0→1
      const t = 1 - p.life / p.maxLife;
      p.opacity = 1 - t;                             // linear fade
      p.radius = p.initialRadius * (1 - t * 0.7);    // shrink to 30%

      // Draw — integer-locked coords, no sub-pixel work
      const rgb = COLOR_RGB[p.colorIdx];
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
      ctx.beginPath();
      ctx.arc(p.x | 0, p.y | 0, p.radius > 0.5 ? p.radius : 0.5, 0, 6.283185307);
      ctx.fill();
    }

    if (anyAlive) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      // Nothing to render — sleep until next burst wakes us.
      ctx.clearRect(0, 0, w, h);
      runningRef.current = false;
      lastTimeRef.current = 0;
    }
  }, []);

  const ensureRunning = useCallback(() => {
    if (runningRef.current || !visibleRef.current) return;
    runningRef.current = true;
    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // ── Event handlers ───────────────────────────────────────────────────────
  const handlePointer = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const cx = (clientX - rect.left) * dpr;
      const cy = (clientY - rect.top) * dpr;
      burst(cx, cy);
      ensureRunning();
    },
    [burst, ensureRunning],
  );

  // ── Setup / teardown ─────────────────────────────────────────────────────
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Initialise pool
    const pool: Particle[] = new Array(POOL_SIZE);
    for (let i = 0; i < POOL_SIZE; i++) pool[i] = deadParticle();
    poolRef.current = pool;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    // ── Size helper (DPR-aware, no leaks) ──────────────────────────────────
    const sizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = (w * dpr) | 0;
      canvas.height = (h * dpr) | 0;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    sizeCanvas();

    // ResizeObserver for efficient resize without window listener leaks
    const ro = new ResizeObserver(() => sizeCanvas());
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    resizeObserverRef.current = ro;

    // ── IntersectionObserver — pause rAF when off-screen ───────────────────
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          // Restart loop if particles still alive
          const anyAlive = pool.some((p) => p.alive);
          if (anyAlive) ensureRunning();
        } else {
          // Will naturally stop at next tick check
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    // ── Touch / Mouse (on document — canvas has pointer-events:none) ──────
    const onTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        handlePointer(t.clientX, t.clientY);
      }
    };
    const onMouseDown = (e: MouseEvent) => {
      handlePointer(e.clientX, e.clientY);
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('mousedown', onMouseDown);

    return () => {
      cancelAnimationFrame(rafRef.current);
      runningRef.current = false;
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('mousedown', onMouseDown);
      io.disconnect();
      ro.disconnect();
      resizeObserverRef.current = null;
    };
  }, [burst, ensureRunning, handlePointer]);

  if (Platform.OS !== 'web') return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',  // Let clicks pass through to the Start button
        zIndex: 5,
      }}
    />
  );
};
