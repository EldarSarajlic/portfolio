import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  front: ReactNode;
  back: ReactNode;
  className?: string;
};

/**
 * 3D flip card. The hover listeners live on the OUTER (non-rotating) wrapper so
 * the card can tilt freely without its rotating bounds re-triggering enter/leave
 * at the cursor's edge — that's the classic flicker bug.
 *
 * Both rotateX (mouse) and rotateY (flip) are driven by MotionValues so there's
 * a single transform source of truth (no `animate`-vs-`style` conflict).
 */
export default function FlipCard({ front, back, className = "" }: Props) {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  // Flip target
  const flipTarget = useMotionValue(0);
  const rotateY = useSpring(flipTarget, {
    stiffness: 80,
    damping: 18,
    mass: 0.9,
  });

  // Mouse-Y tilt
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(mouseY, {
    stiffness: 200,
    damping: 24,
    mass: 0.4,
  });

  useEffect(() => {
    flipTarget.set(flipped ? 180 : 0);
  }, [flipped, flipTarget]);

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseY.set(-y * 8);
  };

  const onEnter = () => setFlipped(true);
  const onLeave = () => {
    mouseY.set(0);
    setFlipped(false);
  };

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      className={`[perspective:1400px] ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          pointerEvents: "none",
        }}
        className="relative w-full will-change-transform"
      >
        <div style={{ backfaceVisibility: "hidden" }} className="relative">
          {front}
        </div>
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="absolute inset-0"
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
