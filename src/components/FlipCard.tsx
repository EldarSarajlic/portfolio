import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  front: ReactNode;
  back: ReactNode;
  className?: string;
};

/**
 * 3D flip card. Hover (mouse) flips on enter/leave; tap (touch/pen) toggles on click.
 * Pointer events + pointerType filtering prevent synthesized mouse events on mobile
 * from causing the card to flip and immediately flip back.
 */
export default function FlipCard({ front, back, className = "" }: Props) {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const lastPointerType = useRef<string>("mouse");

  const [isTouch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
  );

  const flipTarget = useMotionValue(0);
  const rotateY = useSpring(flipTarget, { stiffness: 80, damping: 18, mass: 0.9 });

  const mouseY = useMotionValue(0);
  const rotateX = useSpring(mouseY, { stiffness: 200, damping: 24, mass: 0.4 });

  useEffect(() => {
    flipTarget.set(flipped ? 180 : 0);
  }, [flipped, flipTarget]);

  const onPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || reduce) return;
    setFlipped(true);
  };

  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    mouseY.set(0);
    setFlipped(false);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || reduce) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseY.set(-y * 8);
  };

  // Track pointerType so onClick can distinguish mouse clicks from touch taps
  const onPointerDown = (e: React.PointerEvent) => {
    lastPointerType.current = e.pointerType;
  };

  const onClick = () => {
    if (lastPointerType.current !== "mouse") setFlipped((f) => !f);
  };

  return (
    <div
      ref={wrapperRef}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onClick={onClick}
      className={`[perspective:1400px] ${isTouch ? "cursor-pointer" : ""} ${className}`}
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
        {/* CSS grid trick: both ghosts share one cell → container = max(front, back) height */}
        <div className="grid invisible pointer-events-none" aria-hidden="true">
          <div className="[grid-area:1/1]">{front}</div>
          <div className="[grid-area:1/1]">{back}</div>
        </div>

        <div style={{ backfaceVisibility: "hidden" }} className="absolute inset-0">
          {front}
        </div>
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0"
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
