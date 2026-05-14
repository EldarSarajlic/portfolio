import { motion } from "framer-motion";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
};

export default function SplitText({ text, className = "", delay = 0, stagger = 0.04 }: Props) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
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
