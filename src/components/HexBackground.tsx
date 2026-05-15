import { useEffect, useRef } from "react";

/**
 * Hex background — two-layer approach:
 *
 *  1. CSS hex-pattern  — tiled SVG background-image, pure GPU paint, zero JS.
 *  2. SVG pop overlay  — ~900 invisible <g> elements built imperatively once.
 *     On mousemove: proximity math (O(n) arithmetic, <0.2 ms) writes transform
 *     + opacity to ~50-65 active cells.  CSS transitions animate everything —
 *     no requestAnimationFrame, no canvas, Lenis scroll runs uncontested.
 *
 * Key insight: `transform-origin: 0 0` on each <g> means
 *   translate(cx+tx, cy+ty) scale(s)
 * correctly scales the polygon from its own centre (cx,cy) AND pushes it
 * outward by (tx,ty) — purely via the CSS transform matrix, no extra maths.
 *
 * During wheel-scroll: mousemove never fires → 0 JS runs.
 * Active cell transitions complete on the GPU compositor without any
 * main-thread involvement.
 */

const HEX_SIZE    = 32;
const INFLUENCE   = 190;         // px — influence radius
const PUSH        = 11;          // px — max outward displacement
const SCALE_BOOST = 0.22;        // fraction above 1 at cursor centre
const MAX_OPACITY = 0.78;        // <g> opacity at cursor centre
const R2          = INFLUENCE * INFLUENCE;
const HEX_H       = Math.sqrt(3) * HEX_SIZE;   // ≈ 55.43
const HORIZ       = 1.5 * HEX_SIZE;            // 48

const TRANSITION  = "transform 0.38s ease-out, opacity 0.25s ease-out";

// Polygon points centred at SVG origin (0,0) — reused for every cell.
// The parent <g> positions each cell via translate().
const HEX_PTS = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 3) * i;
  return `${(HEX_SIZE * Math.cos(a)).toFixed(1)},${(HEX_SIZE * Math.sin(a)).toFixed(1)}`;
}).join(" ");

type Cell = { x: number; y: number; el: SVGGElement; active: boolean };

export default function HexBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const section = container.closest("section") as HTMLElement | null;
    if (!section) return;

    const vw   = section.offsetWidth;
    const vh   = section.offsetHeight;
    const cols = Math.ceil(vw / HORIZ) + 2;
    const rows = Math.ceil(vh / HEX_H)  + 2;

    // ── Build SVG overlay imperatively ──────────────────────────────────────
    // Bypasses React's reconciler for ~900 nodes — mount is one-time only.
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible";

    const cells: Cell[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * HORIZ;
        const y = r * HEX_H + (c % 2 ? HEX_H / 2 : 0);

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        // transform-origin:0 0  ← SVG viewport origin = polygon centre for
        // our layout (polygon pts are at SVG origin; <g> translates to cell).
        // translate(cx,cy) scale(s) with origin 0,0 correctly places the
        // scaled polygon at (cx,cy).  See component comment for full proof.
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

    container.appendChild(svg);

    // ── Mouse handlers ───────────────────────────────────────────────────────
    const glowEl = container.querySelector<HTMLDivElement>(".hex-glow");

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const mx   = e.clientX - rect.left;
      const my   = e.clientY - rect.top;

      // Spotlight radial glow
      if (glowEl) {
        const gx = (mx / rect.width)  * 100;
        const gy = (my / rect.height) * 100;
        glowEl.style.background =
          `radial-gradient(circle 300px at ${gx}% ${gy}%, rgba(61,210,165,0.07) 0%, transparent 70%)`;
      }

      // Per-cell proximity → push + scale + fade-in
      for (const cell of cells) {
        const dx = cell.x - mx;
        const dy = cell.y - my;
        const d2 = dx * dx + dy * dy;

        if (d2 < R2) {
          const d        = Math.sqrt(d2) || 0.001;
          const strength = 1 - d / INFLUENCE;
          const tx       = (dx / d) * PUSH * strength;
          const ty       = (dy / d) * PUSH * strength;
          const scale    = (1 + SCALE_BOOST * strength).toFixed(3);
          const opacity  = (MAX_OPACITY * strength).toFixed(3);

          cell.el.style.transform = `translate(${cell.x + tx}px,${cell.y + ty}px) scale(${scale})`;
          cell.el.style.opacity   = opacity;
          cell.active = true;
        } else if (cell.active) {
          // Reset only previously-active cells — skips the silent majority
          cell.el.style.transform = `translate(${cell.x}px,${cell.y}px) scale(1)`;
          cell.el.style.opacity   = "0";
          cell.active = false;
        }
      }
    };

    const onLeave = () => {
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
      {/* Layer 2 — radial spotlight glow */}
      <div className="hex-glow absolute inset-0" />
      {/* Layer 3 — SVG pop overlay, built imperatively in useEffect */}
    </div>
  );
}
