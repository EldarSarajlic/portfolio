import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode, type CSSProperties } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Max rotation in degrees on each axis */
  max?: number;
  /** Pixels of z-translation while hovered */
  lift?: number;
  /** Show a moving radial spotlight under the cursor */
  spotlight?: boolean;
  /** Border highlight that follows the cursor */
  glowBorder?: boolean;
};

/**
 * 3D mouse-tracked tilt card. Uses transform-style: preserve-3d so children with
 * their own translateZ float at different depths. Respects prefers-reduced-motion.
 *
 * Children that should "pop out" can opt-in with style={{ transform: 'translateZ(40px)' }}.
 */
export default function TiltCard({
  children,
  className = "",
  style,
  max = 8,
  lift = 8,
  spotlight = false,
  glowBorder = false,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Normalized mouse position in [-0.5, 0.5]
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Spring smoothing
  const smx = useSpring(mx, { stiffness: 220, damping: 22, mass: 0.4 });
  const smy = useSpring(my, { stiffness: 220, damping: 22, mass: 0.4 });

  // Map to rotations
  const rotateY = useTransform(smx, (v) => (reduce ? 0 : v * max * 2));
  const rotateX = useTransform(smy, (v) => (reduce ? 0 : -v * max * 2));
  const translateZ = useMotionValue(0);
  const sZ = useSpring(translateZ, { stiffness: 240, damping: 24 });

  // Spotlight position (raw px) for radial gradient
  const sx = useMotionValue(50);
  const sy = useMotionValue(50);
  const ssx = useSpring(sx, { stiffness: 220, damping: 24 });
  const ssy = useSpring(sy, { stiffness: 220, damping: 24 });

  const background = useTransform([ssx, ssy], ([x, y]) =>
    spotlight
      ? `radial-gradient(420px circle at ${x}% ${y}%, rgba(94,227,179,0.10), transparent 45%)`
      : "transparent"
  );

  const borderImage = useTransform([ssx, ssy], ([x, y]) =>
    glowBorder
      ? `radial-gradient(220px circle at ${x}% ${y}%, rgba(94,227,179,0.55), rgba(255,255,255,0.08) 60%) 1`
      : "none"
  );

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x);
    my.set(y);
    sx.set(((e.clientX - rect.left) / rect.width) * 100);
    sy.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const onEnter = () => translateZ.set(lift);
  const onLeave = () => {
    mx.set(0);
    my.set(0);
    translateZ.set(0);
  };

  return (
    <div className="[perspective:1100px]" style={style}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{
          rotateX,
          rotateY,
          z: sZ,
          transformStyle: "preserve-3d",
        }}
        className={`relative will-change-transform ${className}`}
      >
        {/* Spotlight wash */}
        {spotlight && (
          <motion.div
            aria-hidden
            style={{ background }}
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
          />
        )}
        {/* Cursor-glow border (subtle) */}
        {glowBorder && (
          <motion.div
            aria-hidden
            style={{ borderImageSource: borderImage }}
            className="absolute inset-0 rounded-[inherit] pointer-events-none border-[1.5px] [border-image-slice:1]"
          />
        )}
        {children}
      </motion.div>
    </div>
  );
}
