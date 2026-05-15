import { useEffect, useRef } from "react";

/**
 * Hex background — two-layer approach:
 *
 *  1. CSS hex-pattern  — tiled SVG background-image, pure GPU paint, zero JS.
 *  2. SVG pop overlay  — built imperatively once.
 *     Desktop: ~900 cells driven by mousemove proximity math.
 *     Mobile:  ~144 cells (viewport only) driven by ambient sine drift +
 *              touchmove. A setInterval at 100 ms (10 fps) moves the focal
 *              point; CSS transitions animate everything on the GPU compositor
 *              — no RAF loop, no canvas, minimal main-thread work.
 */

const HEX_SIZE = 32;
const HEX_H    = Math.sqrt(3) * HEX_SIZE;  // ≈ 55.43
const HORIZ    = 1.5 * HEX_SIZE;           // 48

const TRANSITION = "transform 0.55s ease-out, opacity 0.4s ease-out";

const HEX_PTS = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 3) * i;
  return `${(HEX_SIZE * Math.cos(a)).toFixed(1)},${(HEX_SIZE * Math.sin(a)).toFixed(1)}`;
}).join(" ");

type Cell = { x: number; y: number; el: SVGGElement; active: boolean };

// ─── Desktop constants ────────────────────────────────────────────────────────
const D_INFLUENCE   = 190;
const D_PUSH        = 11;
const D_SCALE_BOOST = 0.22;
const D_MAX_OPACITY = 0.78;
const D_R2          = D_INFLUENCE * D_INFLUENCE;

// ─── Mobile constants (subtler, fewer active cells) ───────────────────────────
const M_INFLUENCE   = 140;
const M_PUSH        = 8;
const M_SCALE_BOOST = 0.16;
const M_MAX_OPACITY = 0.60;
const M_R2          = M_INFLUENCE * M_INFLUENCE;

function buildGrid(svg: SVGSVGElement, cols: number, rows: number): Cell[] {
  const cells: Cell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * HORIZ;
      const y = r * HEX_H + (c % 2 ? HEX_H / 2 : 0);

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.style.cssText = [
        `transform:translate(${x}px,${y}px) scale(1)`,
        "transform-origin:0 0",
        "opacity:0",
        `transition:${TRANSITION}`,
      ].join(";");

      const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      poly.setAttribute("points",        HEX_PTS);
      poly.setAttribute("fill",          "rgba(61,210,165,0.09)");
      poly.setAttribute("stroke",        "#3DD2A5");
      poly.setAttribute("stroke-width",  "1");
      poly.setAttribute("stroke-opacity","0.95");

      g.appendChild(poly);
      svg.appendChild(g);
      cells.push({ x, y, el: g, active: false });
    }
  }
  return cells;
}

function applyFocalPoint(
  cells: Cell[],
  mx: number,
  my: number,
  influence: number,
  r2: number,
  push: number,
  scaleBoost: number,
  maxOpacity: number,
) {
  for (const cell of cells) {
    const dx = cell.x - mx;
    const dy = cell.y - my;
    const d2 = dx * dx + dy * dy;
    if (d2 < r2) {
      const d        = Math.sqrt(d2) || 0.001;
      const strength = 1 - d / influence;
      const tx       = (dx / d) * push * strength;
      const ty       = (dy / d) * push * strength;
      const scale    = (1 + scaleBoost * strength).toFixed(3);
      const opacity  = (maxOpacity * strength).toFixed(3);
      cell.el.style.transform = `translate(${cell.x + tx}px,${cell.y + ty}px) scale(${scale})`;
      cell.el.style.opacity   = opacity;
      cell.active = true;
    } else if (cell.active) {
      cell.el.style.transform = `translate(${cell.x}px,${cell.y}px) scale(1)`;
      cell.el.style.opacity   = "0";
      cell.active = false;
    }
  }
}

export default function HexBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const section = container.closest("section") as HTMLElement | null;
    if (!section) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible";

    if (isTouch) {
      // ── Mobile path: viewport-sized grid + ambient drift + touch ──────────
      const vw   = window.innerWidth;
      const vh   = window.innerHeight;
      const cols = Math.ceil(vw / HORIZ) + 1;
      const rows = Math.ceil(vh / HEX_H) + 1;
      const cells = buildGrid(svg, cols, rows);
      container.appendChild(svg);

      let isTouching  = false;
      let phase       = 0;

      // Ambient drift — setInterval at 100 ms (10 fps).
      // CSS transitions (0.55 s) interpolate between steps on the GPU.
      const timer = window.setInterval(() => {
        if (isTouching) return;
        phase += 0.04;
        const mx = vw * 0.5 + Math.sin(phase)        * vw  * 0.28;
        const my = vh * 0.4 + Math.cos(phase * 0.65) * vh  * 0.18;
        applyFocalPoint(cells, mx, my, M_INFLUENCE, M_R2, M_PUSH, M_SCALE_BOOST, M_MAX_OPACITY);
      }, 100);

      // Touch follow — passive, no RAF needed
      const onTouchMove = (e: TouchEvent) => {
        isTouching = true;
        const t    = e.touches[0];
        const rect = section.getBoundingClientRect();
        applyFocalPoint(
          cells,
          t.clientX - rect.left,
          t.clientY - rect.top,
          M_INFLUENCE, M_R2, M_PUSH, M_SCALE_BOOST, M_MAX_OPACITY,
        );
      };
      const onTouchEnd = () => { isTouching = false; };

      section.addEventListener("touchmove", onTouchMove, { passive: true });
      section.addEventListener("touchend",  onTouchEnd,  { passive: true });

      return () => {
        window.clearInterval(timer);
        section.removeEventListener("touchmove", onTouchMove);
        section.removeEventListener("touchend",  onTouchEnd);
        svg.remove();
      };
    }

    // ── Desktop path: full grid + mousemove proximity ──────────────────────
    const vw   = section.offsetWidth;
    const vh   = section.offsetHeight;
    const cols = Math.ceil(vw / HORIZ) + 2;
    const rows = Math.ceil(vh / HEX_H) + 2;
    const cells = buildGrid(svg, cols, rows);
    container.appendChild(svg);

    const glowEl = container.querySelector<HTMLDivElement>(".hex-glow");

    let rafPending = false;
    let pendingMx  = -9999;
    let pendingMy  = -9999;

    const processMove = () => {
      rafPending = false;
      const mx = pendingMx;
      const my = pendingMy;

      if (glowEl) {
        const rect = section.getBoundingClientRect();
        const gx = (mx / rect.width)  * 100;
        const gy = (my / rect.height) * 100;
        glowEl.style.background =
          `radial-gradient(circle 300px at ${gx}% ${gy}%, rgba(61,210,165,0.07) 0%, transparent 70%)`;
      }

      applyFocalPoint(cells, mx, my, D_INFLUENCE, D_R2, D_PUSH, D_SCALE_BOOST, D_MAX_OPACITY);
    };

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      pendingMx = e.clientX - rect.left;
      pendingMy = e.clientY - rect.top;
      if (!rafPending) { rafPending = true; requestAnimationFrame(processMove); }
    };

    const onLeave = () => {
      rafPending = false;
      pendingMx  = -9999;
      pendingMy  = -9999;
      if (glowEl) glowEl.style.background = "";
      for (const cell of cells) {
        if (cell.active) {
          cell.el.style.transform = `translate(${cell.x}px,${cell.y}px) scale(1)`;
          cell.el.style.opacity   = "0";
          cell.active = false;
        }
      }
    };

    section.addEventListener("mousemove",  onMove,   { passive: true });
    section.addEventListener("mouseleave", onLeave);

    return () => {
      section.removeEventListener("mousemove",  onMove);
      section.removeEventListener("mouseleave", onLeave);
      svg.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Layer 1 — static CSS hex grid, zero runtime cost */}
      <div className="absolute inset-0 hex-pattern" />
      {/* Layer 2 — radial spotlight glow (desktop only) */}
      <div className="hex-glow absolute inset-0" />
      {/* Layer 3 — SVG pop overlay, built imperatively in useEffect */}
    </div>
  );
}
