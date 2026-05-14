import { useEffect, useRef } from "react";

/**
 * Canvas honeycomb backdrop that reacts to the cursor.
 *
 * Why canvas instead of DOM:
 *  - One <canvas> repaint per frame beats 200+ DOM nodes transitioning transform
 *    + background-color simultaneously.
 *  - Per-cell state is plain numbers — we lerp toward a target so we keep the
 *    "stepping on plates" elastic feel without CSS transitions.
 *  - rAF loop auto-pauses once every cell is at rest, so the page costs zero
 *    while the cursor isn't moving.
 */

const HEX_SIZE = 32; // half-width (radius for flat-top hex)
const INFLUENCE = 220;
const PUSH = 14;
const SCALE_BOOST = 0.35;
const OPACITY_BASE = 0.16; // visible at rest
const OPACITY_BOOST = 0.5; // peak brightness near cursor
const LERP = 0.18;
const REST_EPS = 0.05;

type Cell = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  scale: number;
  opacity: number;
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

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    const buildCells = () => {
      const size = HEX_SIZE;
      const hexH = Math.sqrt(3) * size;
      const horiz = 1.5 * size;
      const cols = Math.ceil(vw / horiz) + 2;
      const rows = Math.ceil(vh / hexH) + 2;
      const out: Cell[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * horiz;
          const y = r * hexH + (c % 2 ? hexH / 2 : 0);
          out.push({ x, y, tx: 0, ty: 0, scale: 1, opacity: OPACITY_BASE });
        }
      }
      cellsRef.current = out;
    };

    const resize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(vw * dpr);
      canvas.height = Math.floor(vh * dpr);
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildCells();
      kick();
    };

    // Reusable hexagon path so we don't recompute corners each cell.
    const buildHexPath = (size: number) => {
      const path = new Path2D();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i; // flat-top: angles 0, 60, 120, ...
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
      const { x: mx, y: my } = mouseRef.current;

      let stillMoving = false;

      ctx.clearRect(0, 0, vw, vh);

      // Subtle radial fade so we don't visually compete with content edges.
      // (Drawing is per-frame anyway — cheaper than a separate masked DOM layer.)

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];

        // Compute target
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

        // Lerp current -> target
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

        // Soft circular fade — gentle falloff toward the corners.
        const distFromCenter = Math.hypot(cell.x - vw / 2, cell.y - vh / 2);
        const fade = 1 - Math.min(1, distFromCenter / (Math.hypot(vw, vh) / 1.3));
        const drawOpacity = cell.opacity * (0.5 + fade * 0.5);

        if (
          Math.abs(cell.tx - ttx) > REST_EPS ||
          Math.abs(cell.ty - tty) > REST_EPS ||
          Math.abs(cell.scale - tscale) > REST_EPS / 5 ||
          Math.abs(cell.opacity - topacity) > REST_EPS / 5
        ) {
          stillMoving = true;
        }

        // Draw
        ctx.save();
        ctx.translate(cell.x + cell.tx, cell.y + cell.ty);
        ctx.scale(cell.scale, cell.scale);
        ctx.strokeStyle = `rgba(61, 210, 165, ${drawOpacity * 0.95})`;
        ctx.lineWidth = 1;
        ctx.fillStyle = `rgba(61, 210, 165, ${drawOpacity * 0.08})`;
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

    const onResize = () => {
      resize();
    };

    resize();
    // Initial paint at rest
    runningRef.current = true;
    rafRef.current = requestAnimationFrame(step);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
