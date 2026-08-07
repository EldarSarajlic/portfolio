import { useEffect, useRef } from "react";

/**
 * Hex background — two-layer, no motion:
 *
 *  1. CSS hex-pattern  — tiled SVG background-image, pure GPU paint, zero JS.
 *  2. SVG highlight     — cells under the cursor fade in (opacity only).
 *
 * No transforms, no push/scale, no ambient drift, no glow, no RAF loop.
 * The only thing that changes is opacity, so the compositor does all the
 * work and the main thread stays idle.
 */

const HEX_SIZE = 32;
const HEX_H    = Math.sqrt(3) * HEX_SIZE;  // ≈ 55.43
const HORIZ    = 1.5 * HEX_SIZE;           // 48

// Opacity-only fade so a highlight doesn't pop harshly. Cheap on the GPU.
const TRANSITION = "opacity 0.25s ease-out";

const HEX_PTS = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 3) * i;
  return `${(HEX_SIZE * Math.cos(a)).toFixed(1)},${(HEX_SIZE * Math.sin(a)).toFixed(1)}`;
}).join(" ");

type Cell = { x: number; y: number; el: SVGGElement; active: boolean };

const INFLUENCE   = 150;
const MAX_OPACITY = 0.7;
const R2          = INFLUENCE * INFLUENCE;

function buildGrid(svg: SVGSVGElement, cols: number, rows: number): Cell[] {
  const cells: Cell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * HORIZ;
      const y = r * HEX_H + (c % 2 ? HEX_H / 2 : 0);

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.style.cssText = [
        `transform:translate(${x}px,${y}px)`,
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

function highlight(cells: Cell[], mx: number, my: number) {
  for (const cell of cells) {
    const dx = cell.x - mx;
    const dy = cell.y - my;
    const d2 = dx * dx + dy * dy;
    if (d2 < R2) {
      const strength = 1 - Math.sqrt(d2) / INFLUENCE;
      cell.el.style.opacity = (MAX_OPACITY * strength).toFixed(3);
      cell.active = true;
    } else if (cell.active) {
      cell.el.style.opacity = "0";
      cell.active = false;
    }
  }
}

function clearAll(cells: Cell[]) {
  for (const cell of cells) {
    if (cell.active) {
      cell.el.style.opacity = "0";
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

    // Touch devices have no cursor to highlight with — skip the overlay
    // entirely and leave only the static CSS hex grid.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible";

    const vw   = section.offsetWidth;
    const vh   = section.offsetHeight;
    const cols = Math.ceil(vw / HORIZ) + 2;
    const rows = Math.ceil(vh / HEX_H) + 2;
    const cells = buildGrid(svg, cols, rows);
    container.appendChild(svg);

    let rafPending = false;
    let pendingMx  = -9999;
    let pendingMy  = -9999;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      pendingMx = e.clientX - rect.left;
      pendingMy = e.clientY - rect.top;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
          rafPending = false;
          highlight(cells, pendingMx, pendingMy);
        });
      }
    };

    const onLeave = () => {
      rafPending = false;
      clearAll(cells);
    };

    section.addEventListener("mousemove",  onMove,  { passive: true });
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
      {/* Layer 2 — SVG highlight overlay, built imperatively in useEffect */}
    </div>
  );
}
