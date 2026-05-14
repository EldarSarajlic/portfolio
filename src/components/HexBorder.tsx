import { useEffect, useRef } from "react";

/**
 * Interactive hexagonal divider strip — placed between sections.
 *
 * Larger hexagons than the background HexGrid, drawn in a two-row honeycomb
 * pattern across the gap. Same cursor-reactive lift + glow behavior as the
 * background grid (per-cell lerp toward a target, rAF auto-pauses when idle).
 */

const HEX_SIZE = 42;            // a bit larger than bg's 32
const INFLUENCE = 220;          // cursor influence radius (px)
const PUSH = 20;                // max translate when pushed
const SCALE_BOOST = 0.45;       // max scale boost on top of 1
const OPACITY_BASE = 0.4;       // resting visibility (border is more present than bg)
const OPACITY_BOOST = 0.7;      // peak brightness near cursor
const LERP = 0.18;
const REST_EPS = 0.05;
const STRIP_HEIGHT = 150;       // total height of the divider strip

type Cell = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  scale: number;
  opacity: number;
};

export default function HexBorder() {
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

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cw = 0;
    let ch = 0;

    const buildCells = () => {
      const rect = canvas.getBoundingClientRect();
      cw = rect.width;
      ch = rect.height;

      const horiz = 1.5 * HEX_SIZE;
      const hexH = Math.sqrt(3) * HEX_SIZE;
      const cols = Math.ceil(cw / horiz) + 2;

      const out: Cell[] = [];
      // Two interleaved rows centered vertically — feels like teeth from
      // the section above + the section below meeting in the middle.
      const yMid = ch / 2;
      for (let c = 0; c < cols; c++) {
        const x = c * horiz;
        const y = yMid + (c % 2 ? hexH / 4 : -hexH / 4);
        out.push({ x, y, tx: 0, ty: 0, scale: 1, opacity: OPACITY_BASE });
      }
      cellsRef.current = out;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildCells();
      kick();
    };

    const buildHexPath = (size: number) => {
      const path = new Path2D();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = size * Math.cos(angle);
        const py = size * Math.sin(angle);
        if (i === 0) path.moveTo(px, py);
        else path.lineTo(px, py);
      }
      path.closePath();
      return path;
    };

    const hexPath = buildHexPath(HEX_SIZE);
    const r2 = INFLUENCE * INFLUENCE;

    const step = () => {
      runningRef.current = true;
      cancelAnimationFrame(rafRef.current);
      const cells = cellsRef.current;
      const rect = canvas.getBoundingClientRect();
      const mx = mouseRef.current.x - rect.left;
      const my = mouseRef.current.y - rect.top;

      let stillMoving = false;

      ctx.clearRect(0, 0, cw, ch);

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];

        const dx = cell.x - mx;
        const dy = cell.y - my;
        const d2 = dx * dx + dy * dy;

        let ttx = 0;
        let tty = 0;
        let tscale = 1;
        let topacity = OPACITY_BASE;

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

        ctx.save();
        ctx.translate(cell.x + cell.tx, cell.y + cell.ty);
        ctx.scale(cell.scale, cell.scale);
        ctx.strokeStyle = `rgba(61, 210, 165, ${cell.opacity})`;
        ctx.lineWidth = 1;
        ctx.fillStyle = `rgba(61, 210, 165, ${cell.opacity * 0.08})`;
        ctx.fill(hexPath);
        ctx.stroke(hexPath);
        ctx.restore();
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

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="relative w-full pointer-events-none"
      style={{ height: STRIP_HEIGHT }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
}
