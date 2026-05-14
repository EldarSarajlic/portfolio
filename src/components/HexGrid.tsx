import { useEffect, useRef } from "react";

const HEX_SIZE = 32;
const INFLUENCE = 220;
const PUSH = 14;
const SCALE_BOOST = 0.35;
const OPACITY_BASE = 0.16;
const OPACITY_BOOST = 0.5;
const LERP = 0.18;
const REST_EPS = 0.05;

// Precomputed once — avoids 12 trig calls per cell per frame.
const HEX_COS = Array.from({ length: 6 }, (_, i) => Math.cos((Math.PI / 3) * i));
const HEX_SIN = Array.from({ length: 6 }, (_, i) => Math.sin((Math.PI / 3) * i));

// 128-level color lookup — eliminates string allocation per cell per frame.
const COLOR_LEVELS = 128;
const STROKE_COLORS = Array.from({ length: COLOR_LEVELS + 1 }, (_, i) => {
  const o = ((i / COLOR_LEVELS) * 0.95).toFixed(3);
  return `rgba(61,210,165,${o})`;
});
const FILL_COLORS = Array.from({ length: COLOR_LEVELS + 1 }, (_, i) => {
  const o = ((i / COLOR_LEVELS) * 0.08).toFixed(3);
  return `rgba(61,210,165,${o})`;
});

type Cell = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  scale: number;
  opacity: number;
  fade: number; // precomputed at build time, fixed until resize
};

export default function HexGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<Cell[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);
  const runningRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // DPR capped at 1 — decorative background, retina sharpness not needed.
    // Avoids a 4× canvas texture on retina displays.
    const dpr = 1;
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    const buildCells = () => {
      const hexH = Math.sqrt(3) * HEX_SIZE;
      const horiz = 1.5 * HEX_SIZE;
      const cols = Math.ceil(vw / horiz) + 2;
      const rows = Math.ceil(vh / hexH) + 2;
      // Precompute per-cell fade — cell positions are fixed, so this never
      // needs to run inside the animation loop.
      const diagHalf = Math.hypot(vw, vh) / 1.3;
      const cx = vw / 2;
      const cy = vh / 2;
      const out: Cell[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * horiz;
          const y = r * hexH + (c % 2 ? hexH / 2 : 0);
          const fade = 1 - Math.min(1, Math.hypot(x - cx, y - cy) / diagHalf);
          out.push({ x, y, tx: 0, ty: 0, scale: 1, opacity: OPACITY_BASE, fade });
        }
      }
      cellsRef.current = out;
    };

    const resize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      canvas.width = Math.floor(vw * dpr);
      canvas.height = Math.floor(vh * dpr);
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildCells();
      kick();
    };

    const r2 = INFLUENCE * INFLUENCE;

    const step = () => {
      runningRef.current = true;
      cancelAnimationFrame(rafRef.current);
      const cells = cellsRef.current;
      const { x: mx, y: my } = mouseRef.current;

      let stillMoving = false;

      ctx.clearRect(0, 0, vw, vh);
      ctx.lineWidth = 1;

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];

        const dx = cell.x - mx;
        const dy = cell.y - my;
        const d2 = dx * dx + dy * dy;

        let ttx = 0,
          tty = 0,
          tscale = 1,
          topacity = OPACITY_BASE;

        if (d2 < r2) {
          const d = Math.sqrt(d2) || 0.0001;
          const strength = 1 - d / INFLUENCE;
          const ux = dx / d;
          const uy = dy / d;
          ttx = ux * PUSH * strength;
          tty = uy * PUSH * strength;
          tscale = 1 + strength * SCALE_BOOST;
          topacity = OPACITY_BASE + strength * OPACITY_BOOST;
        }

        if (reducedMotion) {
          cell.tx = ttx;
          cell.ty = tty;
          cell.scale = tscale;
          cell.opacity = topacity;
        } else {
          cell.tx += (ttx - cell.tx) * LERP;
          cell.ty += (tty - cell.ty) * LERP;
          cell.scale += (tscale - cell.scale) * LERP;
          cell.opacity += (topacity - cell.opacity) * LERP;
        }

        if (
          Math.abs(cell.tx - ttx) > REST_EPS ||
          Math.abs(cell.ty - tty) > REST_EPS ||
          Math.abs(cell.scale - tscale) > REST_EPS / 5 ||
          Math.abs(cell.opacity - topacity) > REST_EPS / 5
        ) {
          stillMoving = true;
        }

        const drawOpacity = cell.opacity * (0.5 + cell.fade * 0.5);
        const colorIdx = Math.max(0, Math.min(COLOR_LEVELS, Math.round(drawOpacity * COLOR_LEVELS)));

        // Draw with absolute coordinates — no save/restore/translate/scale per cell.
        const ox = cell.x + cell.tx;
        const oy = cell.y + cell.ty;
        const s = HEX_SIZE * cell.scale;

        ctx.beginPath();
        ctx.moveTo(ox + s * HEX_COS[0], oy + s * HEX_SIN[0]);
        ctx.lineTo(ox + s * HEX_COS[1], oy + s * HEX_SIN[1]);
        ctx.lineTo(ox + s * HEX_COS[2], oy + s * HEX_SIN[2]);
        ctx.lineTo(ox + s * HEX_COS[3], oy + s * HEX_SIN[3]);
        ctx.lineTo(ox + s * HEX_COS[4], oy + s * HEX_SIN[4]);
        ctx.lineTo(ox + s * HEX_COS[5], oy + s * HEX_SIN[5]);
        ctx.closePath();

        ctx.fillStyle = FILL_COLORS[colorIdx];
        ctx.fill();
        ctx.strokeStyle = STROKE_COLORS[colorIdx];
        ctx.stroke();
      }

      if (stillMoving) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        runningRef.current = false;
      }
    };

    const kick = () => {
      if (!runningRef.current) {
        runningRef.current = true;
        rafRef.current = requestAnimationFrame(step);
      }
    };

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      kick();
    };

    const onLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      kick();
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      mouseRef.current.x = t.clientX;
      mouseRef.current.y = t.clientY;
      step();
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      mouseRef.current.x = t.clientX;
      mouseRef.current.y = t.clientY;
      step();
    };

    const onTouchEnd = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      kick();
    };

    resize();
    runningRef.current = true;
    rafRef.current = requestAnimationFrame(step);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ willChange: "transform" }}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
