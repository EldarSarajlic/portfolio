import { useRef, useEffect, useCallback } from "react";

const BASE_BG =
  "radial-gradient(ellipse 50% 100% at 50% 50%, rgba(61,210,165,0.8), rgba(94,227,179,0.3) 40%, rgba(255,255,255,0.07) 70%)";
const BASE_SHADOW = "0 0 16px 5px rgba(61,210,165,0.18)";

export default function SectionDivider() {
  const lineRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: MouseEvent) => {
    if (!lineRef.current) return;
    const { top, left, width } = lineRef.current.getBoundingClientRect();
    const dist = Math.abs(e.clientY - top);
    const strength = Math.max(0, 1 - dist / 200);
    const xPct = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));

    if (strength < 0.01) {
      lineRef.current.style.background = BASE_BG;
      lineRef.current.style.boxShadow = BASE_SHADOW;
    } else {
      const spreadPct = (50 - 6 * strength).toFixed(0);
      const alpha = (0.8 + 0.1 * strength).toFixed(2);
      const alpha2 = (0.3 + 0.1 * strength).toFixed(2);
      const blur = (16 + 6 * strength).toFixed(0);
      const spread = (5 + 3 * strength).toFixed(0);
      const shadowAlpha = (0.18 + 0.1 * strength).toFixed(2);
      lineRef.current.style.background = `radial-gradient(ellipse ${spreadPct}% 100% at ${xPct.toFixed(1)}% 50%, rgba(61,210,165,${alpha}), rgba(94,227,179,${alpha2}) 40%, rgba(255,255,255,0.07) 70%)`;
      lineRef.current.style.boxShadow = `0 0 ${blur}px ${spread}px rgba(61,210,165,${shadowAlpha})`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [onMove]);

  return (
    <div
      ref={lineRef}
      className="h-px w-full"
      style={{ background: BASE_BG, boxShadow: BASE_SHADOW }}
    />
  );
}
