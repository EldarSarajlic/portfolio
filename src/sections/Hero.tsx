import { motion } from "framer-motion";
import { FiArrowDownRight, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import SplitText from "../components/SplitText";
import Aurora from "../components/Aurora";
import Magnetic from "../components/Magnetic";
import HexBackground from "../components/HexBackground";

const isTouch =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const lineVariant = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.1 + i * 0.18, duration: 0.55, ease: EASE },
  }),
};

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center overflow-hidden">
      <HexBackground />
      <Aurora />

      <div className="relative max-w-6xl mx-auto w-full px-6 pt-32 pb-20">
        <h1 className="font-display text-white text-5xl sm:text-6xl md:text-7xl lg:text-[88px] leading-[1.02] tracking-tight font-bold">
          {isTouch ? (
            <>
              <motion.span
                className="block"
                custom={0}
                initial="hidden"
                animate="show"
                variants={lineVariant}
              >
                Building{" "}
                <span className="text-gradient">quality software,</span>
              </motion.span>
              <motion.span
                className="block"
                custom={1}
                initial="hidden"
                animate="show"
                variants={lineVariant}
              >
                teaching code,
              </motion.span>
              <motion.span
                className="block"
                custom={2}
                initial="hidden"
                animate="show"
                variants={lineVariant}
              >
                and shaping communities.
              </motion.span>
            </>
          ) : (
            <>
              <SplitText text="Building" />{" "}
              <span className="text-gradient">
                <SplitText text="quality software," delay={0.05} />
              </span>
              <br />
              <SplitText text="teaching code," delay={0.4} />
              <br />
              <SplitText text="and shaping" delay={0.7} />{" "}
              <SplitText text="communities." delay={0.95} />
            </>
          )}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isTouch ? 0.65 : 1.6, duration: isTouch ? 0.4 : 0.7 }}
          className="mt-10 flex flex-col sm:flex-row sm:items-center gap-6"
        >
          <div className="h-px w-12 bg-mint-500" />
          <p className="text-slate-400 max-w-xl text-base sm:text-lg">
            <span className="font-display font-semibold tracking-tight text-2xl text-mint-400 mr-2">Eldar Sarajlić</span>
            <span className="hidden sm:inline">·</span> Software Engineer · Backend Engineering & QA Automation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isTouch ? 0.85 : 1.85, duration: isTouch ? 0.4 : 0.7 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-mint-500 text-ink-950 px-6 py-3 font-semibold hover:bg-mint-400 transition-colors glow-mint"
            >
              View my work
              <FiArrowDownRight className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border bg-ink-950/90 border-white/15 text-white px-6 py-3 font-medium hover:border-mint-500/50 hover:text-mint-400 transition-colors"
            >
              Get in touch
            </a>
          </Magnetic>

          <div className="sm:ml-auto flex items-center gap-3 text-slate-400">
            <a
              href="https://github.com/EldarSarajlic"
              target="_blank"
              rel="noreferrer"
              className="grid place-items-center w-10 h-10 rounded-full border bg-ink-950/90 border-white/10 hover:border-mint-500/50 hover:text-mint-400 transition-colors"
              aria-label="GitHub"
            >
              <FiGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/eldar-sarajli%C4%87-3a695b304/"
              target="_blank"
              rel="noreferrer"
              className="grid place-items-center w-10 h-10 rounded-full border bg-ink-950/90 border-white/10 hover:border-mint-500/50 hover:text-mint-400 transition-colors"
              aria-label="LinkedIn"
            >
              <FiLinkedin />
            </a>
            <a
              href="mailto:eldarsarajlic525@gmail.com"
              className="grid place-items-center w-10 h-10 rounded-full border bg-ink-950/90 border-white/10 hover:border-mint-500/50 hover:text-mint-400 transition-colors"
              aria-label="Email"
            >
              <FiMail />
            </a>
          </div>
        </motion.div>


      </div>
    </section>
  );
}
