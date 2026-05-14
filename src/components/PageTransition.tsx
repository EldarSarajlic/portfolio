import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link, type LinkProps, useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

/**
 * Hex page-transition system.
 *
 *  - `<PageTransitionProvider>` wraps the routed app.
 *  - `usePageTransition()` exposes `navigateWithTransition(path)`.
 *  - `<TransitionLink>` is a drop-in `<Link>` that triggers the animation.
 *
 * Animation:
 *  1. central hex bumps in (scale up → settle),
 *  2. concentric rings fly outward toward the screen edges,
 *  3. mid-flight the route swaps under a dark mint-tinted veil,
 *  4. the rings continue off-screen and the veil fades.
 */

const HEX_SIZE = 56;
const RINGS = 5;
const TOTAL_DURATION = 1.15; // seconds
const NAVIGATE_AT = 0.6; // seconds (when the route swaps under the veil)

type Hex = { q: number; r: number; ring: number; x: number; y: number };

function hexRingCoords(radius: number): Array<[number, number]> {
  if (radius === 0) return [[0, 0]];
  const out: Array<[number, number]> = [];
  const dirs: Array<[number, number]> = [
    [1, 0],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [0, -1],
    [1, -1],
  ];
  let q = dirs[4][0] * radius;
  let r = dirs[4][1] * radius;
  for (let side = 0; side < 6; side++) {
    for (let step = 0; step < radius; step++) {
      out.push([q, r]);
      q += dirs[side][0];
      r += dirs[side][1];
    }
  }
  return out;
}

function axialToPixel(q: number, r: number, size: number): [number, number] {
  // flat-top axial → pixel
  const x = size * 1.5 * q;
  const y = size * Math.sqrt(3) * (r + q / 2);
  return [x, y];
}

const HEXES: Hex[] = (() => {
  const out: Hex[] = [];
  for (let ring = 0; ring <= RINGS; ring++) {
    for (const [q, r] of hexRingCoords(ring)) {
      const [x, y] = axialToPixel(q, r, HEX_SIZE);
      out.push({ q, r, ring, x, y });
    }
  }
  return out;
})();

const HEX_POINTS = (() => {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    pts.push(
      `${(HEX_SIZE * Math.cos(angle)).toFixed(2)},${(
        HEX_SIZE * Math.sin(angle)
      ).toFixed(2)}`
    );
  }
  return pts.join(" ");
})();

/* ───────────────────────── Context ───────────────────────── */

type TransitionContextValue = {
  navigateWithTransition: (path: string) => void;
  isTransitioning: boolean;
};

const TransitionCtx = createContext<TransitionContextValue | null>(null);

export function usePageTransition() {
  const ctx = useContext(TransitionCtx);
  if (!ctx) {
    throw new Error(
      "usePageTransition must be used within <PageTransitionProvider>"
    );
  }
  return ctx;
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const [runId, setRunId] = useState(0);
  const pendingRef = useRef<string | null>(null);

  const navigateWithTransition = useCallback(
    (path: string) => {
      if (reduced) {
        navigate(path);
        return;
      }
      if (active) {
        // already transitioning — just hop to the new path
        navigate(path);
        return;
      }
      pendingRef.current = path;
      setRunId((n) => n + 1);
      setActive(true);
    },
    [active, navigate, reduced]
  );

  useEffect(() => {
    if (!active) return;
    const swap = window.setTimeout(() => {
      if (pendingRef.current) {
        navigate(pendingRef.current);
        pendingRef.current = null;
      }
    }, NAVIGATE_AT * 1000);
    const done = window.setTimeout(
      () => setActive(false),
      TOTAL_DURATION * 1000 + 60
    );
    return () => {
      window.clearTimeout(swap);
      window.clearTimeout(done);
    };
  }, [active, runId, navigate]);

  const value = useMemo(
    () => ({ navigateWithTransition, isTransitioning: active }),
    [navigateWithTransition, active]
  );

  return (
    <TransitionCtx.Provider value={value}>
      {children}
      <HexTransitionOverlay active={active} runId={runId} />
    </TransitionCtx.Provider>
  );
}

/* ───────────────────────── Link wrapper ───────────────────────── */

export function TransitionLink(props: LinkProps) {
  const { navigateWithTransition } = usePageTransition();
  const { to, onClick, ...rest } = props;

  const target =
    typeof to === "string"
      ? to
      : `${to.pathname ?? ""}${to.search ?? ""}${to.hash ?? ""}`;

  return (
    <Link
      to={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0
        ) {
          return;
        }
        e.preventDefault();
        navigateWithTransition(target);
      }}
      {...rest}
    />
  );
}

/* ───────────────────────── Overlay ───────────────────────── */

function HexTransitionOverlay({
  active,
  runId,
}: {
  active: boolean;
  runId: number;
}) {
  return (
    <AnimatePresence>
      {active && <OverlayBody key={runId} />}
    </AnimatePresence>
  );
}

function OverlayBody() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      {/* Dark veil — covers the swap moment */}
      <motion.div
        className="absolute inset-0 bg-ink-950"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.92, 0.92, 0] }}
        transition={{
          duration: TOTAL_DURATION,
          times: [0, 0.32, 0.66, 1],
          ease: "easeInOut",
        }}
      />
      {/* Soft mint radial glow that grows then dissipates */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(94,227,179,0.45) 0%, rgba(61,210,165,0.18) 28%, transparent 62%)",
        }}
        initial={{ opacity: 0, scale: 0.25 }}
        animate={{
          opacity: [0, 0.9, 1, 0],
          scale: [0.25, 1.1, 2.4, 4],
        }}
        transition={{
          duration: TOTAL_DURATION,
          times: [0, 0.3, 0.7, 1],
          ease: "easeOut",
        }}
      />

      {/* Hex container — origin is dead-center of viewport */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: 1, height: 1 }}>
          {HEXES.map((h, i) => (
            <HexCell key={i} hex={h} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function HexCell({ hex }: { hex: Hex }) {
  const { ring, x, y } = hex;

  // The further the ring, the further the hex must travel to reach the edge.
  // Scale outward by a generous multiplier so even 4K screens are covered
  // by the mint glow + expanding hexes.
  const expand = useViewportExpand();

  // shared SVG framing — gives each cell a bit of headroom for stroke + glow
  const box = HEX_SIZE * 2.6;
  const half = box / 2;

  if (ring === 0) {
    // Centerpiece: bumps in, sits, then blooms outward & fades.
    return (
      <motion.svg
        width={box}
        height={box}
        viewBox={`${-half} ${-half} ${box} ${box}`}
        className="absolute"
        style={{
          left: -half,
          top: -half,
          filter:
            "drop-shadow(0 0 28px rgba(94,227,179,0.85)) drop-shadow(0 0 12px rgba(168,239,206,0.6))",
        }}
        initial={{ scale: 0, opacity: 0, rotate: -10 }}
        animate={{
          scale: [0, 1.55, 1, 1.05, 4.2],
          opacity: [0, 1, 1, 1, 0],
          rotate: [-10, 6, 0, 0, 0],
        }}
        transition={{
          duration: TOTAL_DURATION,
          times: [0, 0.18, 0.32, 0.45, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <polygon
          points={HEX_POINTS}
          fill="rgba(61,210,165,0.32)"
          stroke="rgba(214,247,232,0.95)"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {/* inner highlight ring */}
        <polygon
          points={HEX_POINTS}
          fill="none"
          stroke="rgba(168,239,206,0.7)"
          strokeWidth={1.2}
          strokeLinejoin="round"
          transform="scale(0.6)"
        />
        {/* core dot */}
        <circle r={HEX_SIZE * 0.12} fill="rgba(214,247,232,0.85)" />
      </motion.svg>
    );
  }

  const ringOpacity = 1 - (ring - 1) * 0.13; // ring 1 ≈ 1, ring 5 ≈ 0.48
  const delay = 0.18 + ring * 0.045;

  return (
    <motion.svg
      width={box}
      height={box}
      viewBox={`${-half} ${-half} ${box} ${box}`}
      className="absolute"
      style={{
        left: -half,
        top: -half,
        filter: `drop-shadow(0 0 ${10 + (RINGS - ring) * 2}px rgba(94,227,179,${0.35 + (RINGS - ring) * 0.04}))`,
      }}
      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
      animate={{
        x: [0, x, x * expand],
        y: [0, y, y * expand],
        scale: [0, 1, 1.18],
        opacity: [0, ringOpacity, 0],
      }}
      transition={{
        duration: TOTAL_DURATION - delay,
        delay,
        times: [0, 0.32, 1],
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <polygon
        points={HEX_POINTS}
        fill="rgba(61,210,165,0.18)"
        stroke="rgba(94,227,179,0.9)"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <polygon
        points={HEX_POINTS}
        fill="none"
        stroke="rgba(214,247,232,0.35)"
        strokeWidth={0.8}
        strokeLinejoin="round"
        transform="scale(0.62)"
      />
    </motion.svg>
  );
}

/**
 * Pick an outward-expansion multiplier large enough to push the outermost
 * ring past the viewport diagonal on the current screen.
 */
function useViewportExpand() {
  const [exp, setExp] = useState(() => computeExpand());
  useEffect(() => {
    const update = () => setExp(computeExpand());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return exp;
}

function computeExpand() {
  if (typeof window === "undefined") return 5;
  const diag = Math.hypot(window.innerWidth, window.innerHeight);
  // outermost ring's natural distance from center
  const ringReach = RINGS * HEX_SIZE * Math.sqrt(3);
  // overshoot ~10% so the hexes clearly exit the viewport
  return Math.max(3.5, (diag * 0.6) / ringReach);
}
