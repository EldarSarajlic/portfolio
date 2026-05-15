import { motion, useReducedMotion } from "framer-motion";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
};

// Evaluated once at module load — stable across re-renders, no hook needed.
const isTouch =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

export default function SplitText({ text, className = "", delay = 0, stagger = 0.04 }: Props) {
  const prefersReduced = useReducedMotion();
  const words = text.split(" ");

  // On touch/mobile: animate at word level (avoids spawning 50+ motion.span nodes)
  if (isTouch || prefersReduced) {
    return (
      <span className={className} aria-label={text}>
        {words.map((word, wi) => (
          <motion.span
            key={wi}
            className="inline-block whitespace-nowrap mr-[0.15em]"
            initial={{ y: "0.5em", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: delay * 0.3 + wi * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    );
  }

  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap mr-[0.15em]">
          {word.split("").map((char, ci) => (
            <motion.span
              key={ci}
              className="inline-block"
              initial={{ y: "1.1em", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: delay + (wi * 0.06) + ci * stagger,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}
