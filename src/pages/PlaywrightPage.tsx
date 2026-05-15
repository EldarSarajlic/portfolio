import { useEffect, useRef, useState } from "react";
import { TransitionLink as Link } from "../components/PageTransition";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  AnimatePresence,
  useInView,
  type MotionValue,
} from "framer-motion";
import {
  FiArrowLeft,
  FiGithub,
  FiCpu,
  FiZap,
  FiBookOpen,
  FiArrowUpRight,
  FiTerminal,
  FiServer,
  FiKey,
  FiMousePointer,
  FiCalendar,
  FiList,
  FiUpload,
  FiCode,
  FiLayers,
  FiCheckCircle,
  FiUser,
  FiClock,
  FiMessageSquare,
} from "react-icons/fi";
import Reveal from "../components/Reveal";
import DecryptedText from "../components/DecryptedText";
import Aurora from "../components/Aurora";
import TiltCard from "../components/TiltCard";
import FlipCard from "../components/FlipCard";

/* ───────────────────────── Chapter metadata ───────────────────────── */

type Chapter = {
  id: string;
  num: string;
  kicker: string;
  title: string;
};

const chapters: Chapter[] = [
  { id: "ch1", num: "01", kicker: "Day one", title: "No experience" },
  { id: "ch2", num: "02", kicker: "Mistral", title: "Testing by hand" },
  { id: "ch3", num: "03", kicker: "Playwright", title: "The toolbox" },
  { id: "ch4", num: "04", kicker: "OrangeHRM, raw", title: "First real specs" },
  { id: "ch5", num: "05", kicker: "Climax", title: "Building the framework" },
  { id: "ch6", num: "06", kicker: "DeepEval", title: "When the judge is an LLM" },
  { id: "ch7", num: "07", kicker: "Self-driven", title: "K6 + GitHub Actions" },
  { id: "ch8", num: "08", kicker: "Epilogue", title: "What stuck" },
];

/* ───────────────────────── Scroll-progress bar (top of page) ───────────────────────── */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.4,
  });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-gradient-to-r from-mint-500 via-mint-400 to-mint-500"
    />
  );
}

/* ───────────────────────── Chapter rail (sticky left) ───────────────────────── */

function ChapterRail({ active }: { active: string }) {
  return (
    <aside className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-3">
      {chapters.map((c) => {
        const isActive = c.id === active;
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="group flex items-center gap-3"
            aria-label={`Chapter ${c.num}: ${c.title}`}
          >
            <span
              className={`font-mono text-[10px] tracking-widest tabular-nums transition-colors ${
                isActive ? "text-mint-400" : "text-slate-600 group-hover:text-slate-300"
              }`}
            >
              {c.num}
            </span>
            <span
              className={`h-px transition-all duration-300 ${
                isActive
                  ? "w-10 bg-mint-400"
                  : "w-4 bg-slate-700 group-hover:w-6 group-hover:bg-slate-500"
              }`}
            />
            <span
              className={`text-[11px] uppercase tracking-[0.25em] transition-all duration-300 ${
                isActive
                  ? "opacity-100 translate-x-0 text-slate-200"
                  : "opacity-0 -translate-x-2 text-slate-400 group-hover:opacity-100 group-hover:translate-x-0"
              }`}
            >
              {c.title}
            </span>
          </a>
        );
      })}
    </aside>
  );
}

/* ───────────────────────── Marquee tech rail ───────────────────────── */

const techRail = [
  "Playwright 1.57",
  "TypeScript",
  "Node.js",
  "Page Object Model",
  "Custom fixtures",
  "Storage state",
  "Global setup",
  "request context API",
  "dotenv",
  "HTML reporter",
  "Trace on retry",
  "Postman",
  "DeepEval",
  "Grafana K6",
  "GitHub Actions",
  "Jira",
];

function TechMarquee() {
  return (
    <div className="relative overflow-hidden mask-fade-x py-3">
      <div className="flex items-center gap-10 animate-marquee whitespace-nowrap">
        {[...techRail, ...techRail].map((t, i) => (
          <span key={`${t}-${i}`} className="flex items-center gap-10">
            <span className="text-xs font-mono text-slate-500 tracking-wide">{t}</span>
            <span className="h-3 w-px bg-white/15 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Big chapter number (parallax + spring entrance) ───────────────────────── */

function ChapterNumeral({ num }: { num: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.0, 0.08, 0.08, 0.0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      aria-hidden
      className="relative font-display text-[140px] md:text-[200px] lg:text-[260px] leading-[0.85] font-bold text-white select-none pointer-events-none"
    >
      {num}
    </motion.div>
  );
}

/* ───────────────────────── Chapter title pair (kicker + headline) ───────────────────────── */

function ChapterTitle({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  return (
    <Reveal>
      <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-3">{kicker}</div>
      <h2 className="font-display text-3xl md:text-5xl text-white font-bold tracking-tight">
        {title}
      </h2>
    </Reveal>
  );
}

/* ───────────────────────── Typewriter list (Ch 04 manual cases) ───────────────────────── */

function TypewriterLine({ text, index, start }: { text: string; index: number; start: boolean }) {
  const reduce = useReducedMotion();
  const [animOut, setAnimOut] = useState("");

  useEffect(() => {
    if (reduce || !start) return;
    let interval: number | undefined;
    const baseDelay = index * 240;
    const timer = window.setTimeout(() => {
      let i = 0;
      setAnimOut("");
      interval = window.setInterval(() => {
        i += 1;
        setAnimOut(text.slice(0, i));
        if (i >= text.length) window.clearInterval(interval);
      }, 16);
    }, baseDelay);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, [text, index, start, reduce]);

  const out = reduce ? text : animOut;

  return (
    <li className="flex items-baseline gap-3 font-mono text-[13px]">
      <span className="text-slate-600 tabular-nums w-6 shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="text-slate-300">
        {out}
        {start && out.length < text.length && (
          <span className="inline-block w-1.5 h-3.5 bg-mint-400 ml-0.5 align-middle animate-pulse" />
        )}
      </span>
    </li>
  );
}

const manualCases = [
  "Login · valid credentials → dashboard",
  "Login · invalid username → error toast",
  "Login · invalid password → error toast",
  "Login · empty fields → required hints",
  "Dashboard · sidebar items render in order",
  "Dashboard · all widgets visible",
  "Admin · create user with timestamped name",
  "Admin · find the just-created user via filters",
];

function ManualCasesTypewriter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25%" });
  return (
    <div ref={ref} className="space-y-2">
      <div className="text-slate-500 text-[10px] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
        <span className="h-px w-6 bg-slate-700" />
        Pen first, code second
      </div>
      <ul className="space-y-2">
        {manualCases.map((c, i) => (
          <TypewriterLine key={c} text={c} index={i} start={inView} />
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────── Jira-ticket card (Ch 02) ───────────────────────── */

function JiraTicket() {
  const ticketId = 247;

  const Front = (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.03]">
        <span className="text-[11px] text-slate-500 uppercase tracking-widest">
          Manual test pass
        </span>
        <span className="text-[11px] text-amber-300/70 uppercase tracking-widest">
          Private
        </span>
      </div>

      <div className="px-5 pt-5 pb-4">
        <div className="text-slate-200 font-medium leading-snug">
          Execute regression pass across product flows · happy / negative / edge
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <FiUser className="text-[10px]" />
            Reporter — Eldar
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FiClock className="text-[10px]" />
            Sprint cycle
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FiMessageSquare className="text-[10px]" />
            Documented in Jira
          </span>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-400 leading-relaxed">
          <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-2">
            Description
          </div>
          First real work was manual regression across an old app where I built a test
          plan from the spec, wrote test steps and expected outcomes, executed by hand, logged outcomes per case in internal
          Jira.
        </div>
      </div>

      <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02] flex items-center justify-between text-[11px] text-slate-500 italic">
        <span>Hover to flip — see what got covered.</span>
        <span className="not-italic font-mono text-slate-600">↻</span>
      </div>
    </div>
  );

  const tones = [
    {
      h: "Happy paths",
      d: "Expected flow first — valid credentials, credit card information etc.",
      tone: "mint",
    },
    {
      h: "Negative paths",
      d: "Wrong inputs, wrong order, wrong permissions.",
      tone: "amber",
    },
    {
      h: "Edge cases",
      d: "Double checking the developer implementation of edge values.",
      tone: "rose",
    },
  ];

  const Back = (
    <div className="rounded-2xl border border-mint-500/30 bg-gradient-to-b from-mint-500/[0.06] to-white/[0.02] overflow-hidden h-full shadow-[0_30px_80px_-20px_rgba(61,210,165,0.35)]">
      <div className="px-5 py-3 border-b border-white/5 bg-mint-500/[0.06] flex items-center justify-between">
        <span className="font-mono text-mint-300 text-[11px] tracking-widest">
          MSTRL-{ticketId} · COVERAGE
        </span>
        <span className="text-[10px] uppercase tracking-widest text-mint-300/70">
          The back of the ticket
        </span>
      </div>
      <div className="p-5 space-y-3">
        {tones.map((b) => (
          <div
            key={b.h}
            className={`rounded-xl border bg-white/[0.02] p-4 ${
              b.tone === "mint"
                ? "border-mint-500/30"
                : b.tone === "amber"
                ? "border-amber-400/30"
                : "border-rose-400/30"
            }`}
          >
            <div
              className={`flex items-center gap-2 text-[10px] uppercase tracking-widest mb-2 ${
                b.tone === "mint"
                  ? "text-mint-400"
                  : b.tone === "amber"
                  ? "text-amber-300"
                  : "text-rose-300"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  b.tone === "mint"
                    ? "bg-mint-400"
                    : b.tone === "amber"
                    ? "bg-amber-300"
                    : "bg-rose-300"
                }`}
              />
              {b.h}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{b.d}</p>
          </div>
        ))}
      </div>
      <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02] text-[11px] text-slate-500 italic">
        “This work doesn't live on GitHub — it lives in Jira.”
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <FlipCard front={Front} back={Back} />
    </motion.div>
  );
}

/* ───────────────────────── Locator tile with hover-reveal snippet (Ch 03) ───────────────────────── */

type Tool = {
  icon: React.ReactNode;
  label: string;
  hint: string;
  snippet: string;
};

const tools: Tool[] = [
  {
    icon: <FiKey />,
    label: "Playwright locators",
    hint: "getBy{Role,Text,Label,Placeholder,TestId}",
    snippet: "page.getByRole('button', { name: /login/i })",
  },
  {
    icon: <FiCode />,
    label: "CSS selectors",
    hint: "Class, attribute, descendant — fast and familiar.",
    snippet: "page.locator(\"input[name='username']\")",
  },
  {
    icon: <FiTerminal />,
    label: "XPath axes",
    hint: "ancestor, following-sibling — when the DOM forces your hand.",
    snippet: "page.locator(\"//label[text()='Email']/following-sibling::input\")",
  },
  {
    icon: <FiList />,
    label: "Dropdowns",
    hint: "Native, custom, multi-select, duplicate, hidden.",
    snippet: "await page.getByRole('combobox').selectOption('Admin')",
  },
  {
    icon: <FiCalendar />,
    label: "Date picker (jQuery)",
    hint: "Month-grid, role-based selection, no input typing.",
    snippet: "await calendar.getByRole('gridcell', { name: '15' }).click()",
  },
  {
    icon: <FiLayers />,
    label: "Tables",
    hint: "Static, dynamic, paginated — row scoping by cell text.",
    snippet: "page.getByRole('row', { name: /eldar/i }).getByRole('button')",
  },
  {
    icon: <FiMousePointer />,
    label: "Mouse + keyboard",
    hint: "Hover chains, drag-and-drop, key combos, focus traps.",
    snippet: "await page.keyboard.press('Control+Shift+P')",
  },
  {
    icon: <FiZap />,
    label: "Dialogs & frames",
    hint: "page.on('dialog'), frameLocator, popup contexts.",
    snippet: "page.frameLocator('#widget').getByRole('button')",
  },
  {
    icon: <FiUpload />,
    label: "Scroll + uploads",
    hint: "Infinite scroll, file inputs, multi-file uploads.",
    snippet: "await page.setInputFiles('input[type=file]', 'fixtures/cv.pdf')",
  },
];

function LocatorTile({ tool, i }: { tool: Tool; i: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard max={10} lift={14} spotlight glowBorder>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-5 overflow-hidden h-[220px]"
        >
          <div
            className="text-mint-400 text-xl mb-3"
            style={{ transform: "translateZ(45px)" }}
          >
            {tool.icon}
          </div>
          <div
            className="text-slate-200 font-medium text-sm"
            style={{ transform: "translateZ(30px)" }}
          >
            {tool.label}
          </div>
          <div
            className="text-slate-500 text-xs mt-1 leading-relaxed"
            style={{ transform: "translateZ(20px)" }}
          >
            {tool.hint}
          </div>

          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 8, z: 0 }}
                animate={{ opacity: 1, y: 0, z: 60 }}
                exit={{ opacity: 0, y: 4, z: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: "preserve-3d" }}
                className="mt-4 rounded-md border border-mint-500/30 bg-[#0a1622] p-3 font-mono text-[11px] text-mint-300 leading-relaxed break-all shadow-[0_18px_40px_-12px_rgba(61,210,165,0.35)]"
              >
                {tool.snippet}
              </motion.div>
            )}
          </AnimatePresence>

          <span
            className="absolute right-3 top-3 text-[10px] font-mono text-slate-700 tabular-nums"
            style={{ transform: "translateZ(20px)" }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ───────────────────────── Architecture diagram with flowing particles (Ch 05) ───────────────────────── */

function ArchDiagram() {
  const reduce = useReducedMotion();
  return (
    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 md:p-10 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-mint-400 text-xs uppercase tracking-[0.3em]">
            The session-reuse pipeline
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-mint-500/40 to-transparent" />
        </div>

        <svg
          viewBox="0 0 900 280"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="#3dd2a5" />
            </marker>
            <linearGradient id="lane" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#3dd2a5" stopOpacity="0" />
              <stop offset="50%" stopColor="#3dd2a5" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3dd2a5" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="pulseGrad" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#5ee3b3" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#5ee3b3" stopOpacity="0" />
            </radialGradient>
            <path id="flowPath" d="M 220 130 L 295 130 L 410 130 L 515 130 L 600 130" />
          </defs>

          {/* Lane line */}
          <line x1="60" y1="130" x2="840" y2="130" stroke="url(#lane)" strokeWidth="1" />

          {/* Pulse behind auth-validator */}
          {!reduce && (
            <circle cx="410" cy="130" r="65" fill="url(#pulseGrad)">
              <animate
                attributeName="r"
                values="55;75;55"
                dur="2.4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.55;0.15;0.55"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>
          )}

          {/* Node 1: global-setup */}
          <g>
            <rect
              x="40"
              y="80"
              width="180"
              height="100"
              rx="14"
              fill="rgba(61,210,165,0.05)"
              stroke="rgba(61,210,165,0.35)"
            />
            <text x="130" y="108" textAnchor="middle" fill="#5ee3b3" fontSize="11" fontFamily="ui-monospace" letterSpacing="2">
              GLOBAL-SETUP
            </text>
            <text x="130" y="135" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontFamily="Inter">
              Log in once
            </text>
            <text x="130" y="155" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter">
              save storageState
            </text>
          </g>

          <line x1="225" y1="130" x2="295" y2="130" stroke="#3dd2a5" strokeWidth="1.5" markerEnd="url(#arrow)" />

          {/* Flowing particles along the pipeline */}
          {!reduce && (
            <>
              {[0, 0.33, 0.66].map((delay) => (
                <circle key={delay} r="3.5" fill="#5ee3b3">
                  <animateMotion
                    dur="3.6s"
                    repeatCount="indefinite"
                    begin={`${delay * 3.6}s`}
                    rotate="auto"
                  >
                    <mpath href="#flowPath" />
                  </animateMotion>
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.15;0.85;1"
                    dur="3.6s"
                    repeatCount="indefinite"
                    begin={`${delay * 3.6}s`}
                  />
                </circle>
              ))}
            </>
          )}

          {/* Node 2: auth-validator */}
          <g>
            <rect x="310" y="60" width="200" height="140" rx="14" fill="#06121f" />
            <rect
              x="310"
              y="60"
              width="200"
              height="140"
              rx="14"
              fill="rgba(61,210,165,0.07)"
              stroke="rgba(61,210,165,0.5)"
            />
            <text x="410" y="88" textAnchor="middle" fill="#5ee3b3" fontSize="11" fontFamily="ui-monospace" letterSpacing="2">
              AUTH-VALIDATOR
            </text>
            <text x="410" y="115" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontFamily="Inter">
              Live API ping
            </text>
            <text x="410" y="135" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter">
              cookie still good?
            </text>
            <text x="410" y="165" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="ui-monospace" letterSpacing="1">
              redirect → /auth/login = stale
            </text>
            <text x="410" y="182" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="Inter" fontStyle="italic">
              re-login if expired
            </text>
          </g>

          <line x1="515" y1="130" x2="585" y2="130" stroke="#3dd2a5" strokeWidth="1.5" markerEnd="url(#arrow)" />

          {/* Node 3: pages fixture */}
          <g>
            <rect
              x="600"
              y="80"
              width="200"
              height="100"
              rx="14"
              fill="rgba(61,210,165,0.05)"
              stroke="rgba(61,210,165,0.35)"
            />
            <text x="700" y="108" textAnchor="middle" fill="#5ee3b3" fontSize="11" fontFamily="ui-monospace" letterSpacing="2">
              PAGES FIXTURE
            </text>
            <text x="700" y="135" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontFamily="Inter">
              7 POMs, fresh per spec
            </text>
            <text x="700" y="155" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter">
              test.extend(...)
            </text>
          </g>

          {/* Tail label */}
          <text x="450" y="245" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="Inter" fontStyle="italic">
            log in once · validate · reuse — the framework respects its own state
          </text>
        </svg>
      </div>
    </div>
  );
}

/* ───────────────────────── PR stepper (Ch 05) ───────────────────────── */

type PRCard =
  | { key: string; kind: "raw";      id: string; title: string; pr: string }
  | { key: string; kind: "refactor"; id: string; title: string; pr: string }
  | { key: string; kind: "api";      id: string; title: string; pr: string }
  | { key: string; kind: "ai";       id: string; title: string; branch: string };

const allCards: PRCard[] = [
  { key: "t1-raw", kind: "raw",      id: "T1", title: "Login",           pr: "PR #4"  },
  { key: "t2-raw", kind: "raw",      id: "T2", title: "Dashboard",        pr: "PR #5"  },
  { key: "t3-raw", kind: "raw",      id: "T3", title: "Admin Users",      pr: "PR #6"  },
  { key: "t4-api", kind: "api",      id: "T4", title: "Login API",        pr: "PR #7"  },
  { key: "t5-api", kind: "api",      id: "T5", title: "Dashboard API",    pr: "PR #8"  },
  { key: "t6-api", kind: "api",      id: "T6", title: "User Mgmt API",    pr: "PR #9"  },
  { key: "t1-ref", kind: "refactor", id: "T1", title: "Login",           pr: "PR #10" },
  { key: "t2-ref", kind: "refactor", id: "T2", title: "Dashboard",        pr: "PR #11" },
  { key: "t3-ref", kind: "refactor", id: "T3", title: "Admin Users",      pr: "PR #12" },
  { key: "t7-ai",  kind: "ai",       id: "T7", title: "PIM, AI-assisted", branch: "ai/pim-page-tests" },
];

function PRStepper() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => Math.max(0, a - 1));
  const next = () => setActive((a) => Math.min(allCards.length - 1, a + 1));

  return (
    <div className="relative select-none">
      <div className="[perspective:1600px]">
        {/* side-fade masks so distant cards don't bleed */}
        <div className="relative h-[280px] md:h-[300px] flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)]">
          {allCards.map((s, i) => {
            const offset = i - active;
            const abs = Math.abs(offset);
            return (
              <motion.button
                key={s.key}
                onClick={() => setActive(i)}
                animate={{
                  x: offset * 240,
                  z: -abs * 100,
                  rotateY: offset * -8,
                  opacity: abs === 0 ? 1 : abs === 1 ? 0.12 : 0,
                  scale: abs === 0 ? 1 : 1 - abs * 0.06,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  transformStyle: "preserve-3d",
                  zIndex: 50 - abs,
                  pointerEvents: abs > 1 ? "none" : "auto",
                }}
                className="absolute w-64 md:w-72 will-change-transform"
              >
                {s.kind === "raw" && (
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 text-left shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-xs tracking-widest text-slate-400">{s.id}</span>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500">Raw</span>
                    </div>
                    <div className="text-slate-100 font-semibold mt-2 text-lg">{s.title}</div>
                    <div className="mt-5 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Spec</span>
                        <span className="font-mono text-slate-300">{s.pr}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Structure</span>
                        <span className="font-mono">No POM</span>
                      </div>
                    </div>
                  </div>
                )}
                {s.kind === "refactor" && (
                  <div className="rounded-2xl border border-mint-500/40 bg-gradient-to-b from-mint-500/[0.09] to-mint-500/[0.02] p-5 text-left shadow-[0_24px_60px_-20px_rgba(61,210,165,0.3)]">
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-xs tracking-widest text-mint-400">{s.id}</span>
                      <span className="text-[10px] uppercase tracking-widest text-mint-400/60">Refactor</span>
                    </div>
                    <div className="text-slate-100 font-semibold mt-2 text-lg">{s.title}</div>
                    <div className="mt-5 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-mint-400">POM + fixture</span>
                        <span className="font-mono text-mint-300">{s.pr}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Structure</span>
                        <span className="font-mono text-slate-400">POM</span>
                      </div>
                    </div>
                  </div>
                )}
                {s.kind === "api" && (
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 text-left shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-xs tracking-widest text-sky-400">{s.id}</span>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500">API</span>
                    </div>
                    <div className="text-slate-100 font-semibold mt-2 text-lg">{s.title}</div>
                    <div className="mt-5 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Spec</span>
                        <span className="font-mono text-slate-300">{s.pr}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Context</span>
                        <span className="font-mono">request ctx</span>
                      </div>
                    </div>
                  </div>
                )}
                {s.kind === "ai" && (
                  <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-amber-400/[0.08] to-white/[0.01] p-5 text-left shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-xs tracking-widest text-amber-300">{s.id}</span>
                      <span className="text-[10px] uppercase tracking-widest text-amber-300/60">AI-assisted</span>
                    </div>
                    <div className="text-slate-100 font-semibold mt-2 text-lg">{s.title}</div>
                    <div className="mt-5 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Branch</span>
                        <span className="font-mono text-slate-300">{s.branch}</span>
                      </div>
                      <div className="flex justify-between text-amber-300">
                        <span>Status</span>
                        <span className="font-mono">(branch)</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* controls row */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          disabled={active === 0}
          aria-label="Previous"
          className="h-7 w-7 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-slate-500 hover:text-slate-200 hover:border-white/20 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        >
          ‹
        </button>

        <div className="flex items-center gap-2">
          {allCards.map((c, i) => (
            <button
              key={c.key}
              onClick={() => setActive(i)}
              aria-label={`Show card ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                active === i
                  ? c.kind === "refactor"
                    ? "w-8 bg-mint-400"
                    : c.kind === "ai"
                    ? "w-8 bg-amber-400"
                    : c.kind === "api"
                    ? "w-8 bg-sky-400"
                    : "w-8 bg-slate-400"
                  : "w-1.5 bg-slate-700 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={active === allCards.length - 1}
          aria-label="Next"
          className="h-7 w-7 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-slate-500 hover:text-slate-200 hover:border-white/20 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        >
          ›
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── Stat counter with tabular nums ───────────────────────── */

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display text-2xl text-white font-bold tabular-nums">{k}</span>
      <span className="text-xs uppercase tracking-widest text-slate-500">{v}</span>
    </div>
  );
}

/* ───────────────────────── Conversation mock (Ch 06 — DeepEval) ───────────────────────── */

function ConversationMock() {
  return (
    <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
      {/* Human-written */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.02] p-5"
      >
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <FiUser className="text-slate-400" />
          <span className="uppercase tracking-widest">Human · convention</span>
        </div>
        <pre className="font-mono text-[11.5px] leading-relaxed text-slate-300 whitespace-pre-wrap">
{`test('admin creates a user', async ({ pages }) => {
  const username = dataHelper.username();
  await test.step('add user', async () => {
    await pages.adminAdd.create({ role: 'Admin', username });
  });
  await test.step('find it', async () => {
    await pages.userList.search(username);
    await pages.userList.expectRow(username);
  });
});`}
        </pre>
      </motion.div>

      {/* LLM-generated */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl rounded-br-sm border border-mint-500/30 bg-mint-500/[0.04] p-5"
      >
        <div className="flex items-center gap-2 text-xs text-mint-300 mb-3">
          <FiCpu />
          <span className="uppercase tracking-widest">LLM · learns human convention</span>
        </div>
        <pre className="font-mono text-[11.5px] leading-relaxed text-mint-100/90 whitespace-pre-wrap">
{`test('admin disables a user', async ({ pages }) => {
  const username = dataHelper.username();
  await test.step('seed user', async () => {
    await pages.adminAdd.create({ role: 'ESS', username });
  });
  await test.step('disable', async () => {
    await pages.userList.search(username);
    await pages.userList.toggleStatus(username, 'Disabled');
    await pages.userList.expectStatus(username, 'Disabled');
  });
});`}
        </pre>
      </motion.div>
    </div>
  );
}

/* ───────────────────────── K6 sparkline (Ch 07) ───────────────────────── */

function K6Sparkline() {
  const reduce = useReducedMotion();
  // Synthetic VU ramp: smoke → load → stress → spike → cooldown
  const points = [
    [0, 95],
    [40, 92],
    [80, 88],
    [120, 80],
    [160, 70],
    [200, 60],
    [240, 56],
    [280, 50],
    [320, 48],
    [360, 28],
    [400, 18],
    [440, 26],
    [480, 32],
    [520, 64],
    [560, 84],
  ];
  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");
  const area = `${path} L 560 100 L 0 100 Z`;

  return (
    <svg viewBox="0 0 560 100" className="w-full h-24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="k6area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#5ee3b3" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5ee3b3" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* gridlines */}
      {[25, 50, 75].map((y) => (
        <line
          key={y}
          x1="0"
          x2="560"
          y1={y}
          y2={y}
          stroke="rgba(255,255,255,0.04)"
          strokeDasharray="2 4"
        />
      ))}
      <motion.path
        d={area}
        fill="url(#k6area)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.4, delay: 0.4 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="#5ee3b3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: reduce ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* spike marker */}
      <circle cx="400" cy="18" r="4" fill="#5ee3b3">
        {!reduce && (
          <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
        )}
      </circle>
      <text x="408" y="14" fontSize="10" fill="#5ee3b3" fontFamily="ui-monospace">
        peak VUs
      </text>
    </svg>
  );
}

/* ───────────────────────── GitHub Actions step list (Ch 07) ───────────────────────── */

const ghSteps = [
  "actions/checkout@v4",
  "setup-node · cache npm",
  "install playwright browsers",
  "run · npx playwright test",
  "upload · playwright-report",
  "artifact · traces on failure",
];

function GHActionsSteps() {
  return (
    <ul className="space-y-2">
      {ghSteps.map((s, i) => (
        <motion.li
          key={s}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
          className="flex items-center gap-3 font-mono text-[11.5px] text-slate-300"
        >
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.3, delay: i * 0.06 + 0.1, type: "spring", stiffness: 320, damping: 18 }}
            className="shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full bg-mint-500/20 text-mint-400"
          >
            <FiCheckCircle className="text-[11px]" />
          </motion.span>
          <span className="text-slate-600 tabular-nums w-5">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{s}</span>
        </motion.li>
      ))}
    </ul>
  );
}

/* ───────────────────────── Hero 3D scene (depth-layered test report card) ───────────────────────── */

function HeroScene() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [12, -12]);
  const rotY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-18, 18]);

  // Pointer-driven tilt overlay
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.4 });
  const smy = useSpring(my, { stiffness: 180, damping: 22, mass: 0.4 });
  const ptrRotY = useTransform(smx, (v) => (reduce ? 0 : v * 8));
  const ptrRotX = useTransform(smy, (v) => (reduce ? 0 : -v * 8));

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const rxCombined = useTransform<number, number>(
    [rotX as MotionValue<number>, ptrRotX as MotionValue<number>],
    ([a, b]) => a + b
  );
  const ryCombined = useTransform<number, number>(
    [rotY as MotionValue<number>, ptrRotY as MotionValue<number>],
    ([a, b]) => a + b
  );

  return (
    <div ref={ref} className="relative [perspective:1600px] w-full h-full" onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div
        style={{
          rotateX: rxCombined,
          rotateY: ryCombined,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full will-change-transform"
      >
        {/* Back layer — grid + spec count */}
        <div
          className="absolute inset-x-6 top-10 rounded-2xl border border-white/10 bg-ink-900/60 p-5 backdrop-blur-sm shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]"
          style={{ transform: "translateZ(-40px)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] tracking-widest text-slate-500">
              PLAYWRIGHT.CONFIG.TS
            </span>
            <span className="text-[10px] uppercase tracking-widest text-mint-400">
              ready
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-[11px] font-mono text-slate-400">
            <div>
              <div className="text-slate-300">retries</div>
              <div className="text-mint-400 tabular-nums">2 on CI</div>
            </div>
            <div>
              <div className="text-slate-300">workers</div>
              <div className="text-mint-400 tabular-nums">1 on CI</div>
            </div>
            <div>
              <div className="text-slate-300">trace</div>
              <div className="text-mint-400">on retry</div>
            </div>
          </div>
        </div>

        {/* Middle layer — auth check */}
        <div
          className="absolute right-4 top-32 w-60 rounded-2xl border border-mint-500/30 bg-mint-500/[0.07] p-4 shadow-[0_30px_60px_-20px_rgba(61,210,165,0.4)]"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="flex items-center gap-2 text-mint-300 text-[10px] uppercase tracking-[0.3em] mb-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint-400" />
            </span>
            auth-validator
          </div>
          <div className="text-slate-200 text-sm font-medium">cookie still good</div>
          <div className="text-slate-500 text-xs mt-1 font-mono">200 · GET /api/me</div>
        </div>

        {/* Front layer — passing run */}
        <div
          className="absolute left-4 bottom-6 w-72 rounded-2xl border border-white/10 bg-ink-950/80 backdrop-blur-md p-4 shadow-[0_40px_80px_-25px_rgba(0,0,0,0.8)]"
          style={{ transform: "translateZ(60px)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] tracking-widest text-slate-500">
              LAST RUN · CHROMIUM
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-mint-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-mint-400" />
              passed
            </span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
            {[
              ["login.spec.ts", "6/6"],
              ["dashboard.spec.ts", "2/2"],
              ["admin-user-mgmt.spec.ts", "5/5"],
              ["pim-employee-list.spec.ts", "2/2"],
            ].map(([f, c]) => (
              <div key={f} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-mint-400 text-[11px]" />
                  <span className="text-slate-300">{f}</span>
                </span>
                <span className="text-mint-400 tabular-nums">{c}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-baseline justify-between">
            <span className="text-[10px] uppercase tracking-widest text-slate-500">
              Total
            </span>
            <span className="font-display text-2xl text-white font-bold tabular-nums">
              15<span className="text-mint-400">/15</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ───────────────────────── Page ───────────────────────── */

export default function PlaywrightPage() {
  const [active, setActive] = useState<string>("ch1");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const ids = chapters.map((c) => c.id);
    let frame = 0;

    const update = () => {
      frame = 0;
      const probe = window.innerHeight * 0.45;
      let best: { id: string; dist: number } | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - probe);
        if (!best || dist < best.dist) best = { id, dist };
      }
      if (best) setActive(best.id);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-ink-950 text-slate-300">
      <ScrollProgress />

      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink-950/70 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-mint-400 transition-colors"
          >
            <FiArrowLeft />
            <span className="text-sm">Back to portfolio</span>
          </Link>
          <a
            href="https://github.com/EldarSarajlic/htec-playwright-automation"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-mint-400 transition-colors text-sm"
          >
            <FiGithub />
            GitHub
          </a>
        </div>
      </header>

      <ChapterRail active={active} />

      {/* ───────── Hero — title card ───────── */}
      <section className="relative px-6 pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-8">
                  QA Automation Internship · HTEC
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <h1 className="font-display text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02]">
                  <DecryptedText text="From a blank page" />
                  <br />
                  <span className="text-gradient">
                    <DecryptedText text="to a framework." speed={42} iterations={18} />
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="mt-8 text-slate-300 leading-relaxed text-lg">
                  An eight chapter story of an internship at HTEC, starting with zero
                  QA experience, learning to test by hand, then building a full
                  Playwright framework around OrangeHRM with the Page Object Model,
                  custom fixtures, and cookie based session reuse. What follows is the
                  actual route, chapter by chapter.
                </p>
              </Reveal>

              <Reveal delay={0.22}>
                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
                  <Stat k="8" v="chapters" />
                  <Stat k="37" v="commits" />
                  <Stat k="13" v="mentor-reviewed PRs" />
                  <Stat k="~60" v="test cases" />
                  <Stat k="7" v="page objects" />
                </div>
              </Reveal>
            </div>

            {/* 3D depth-layered hero scene */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="relative h-[420px] w-full">
                <HeroScene />
              </div>
            </div>
          </div>

          <Reveal delay={0.28}>
            <div className="mt-12">
              <TechMarquee />
            </div>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-2 max-w-4xl">
              {chapters.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="group flex items-baseline gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 hover:border-mint-500/30 hover:bg-white/[0.04] transition-colors"
                >
                  <span className="font-mono text-mint-400 text-xs tracking-widest tabular-nums">
                    {c.num}
                  </span>
                  <span className="text-slate-300 text-sm group-hover:text-white transition-colors">
                    {c.title}
                  </span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═════════ Chapter 01 — sparse, almost empty (the blank page) ═════════ */}
      <section id="ch1" className="relative px-6 py-32 border-t border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <ChapterNumeral num="01" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-4">Day one</div>
            <h2 className="font-display text-3xl md:text-5xl text-white font-bold tracking-tight">
              No experience.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 text-slate-400 leading-relaxed">
              I walked into HTEC with zero QA background. The first weeks were quiet on
              purpose: Scrum ceremonies, what a test case actually is, equivalence
              partitioning, how a useful defect report reads.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-3 text-slate-500 italic text-sm text underline">
              The boring foundation everyone skips and then regrets.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
              {["Agile / Scrum", "Manual QA", "Test case design", "Defect reporting"].map(
                (t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="text-xs text-slate-500 border-b border-mint-400/50 pb-px"
                  >
                    {t}
                  </motion.span>
                )
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═════════ Chapter 02 — Mistral (Jira-style ticket) ═════════ */}
      <section id="ch2" className="relative px-6 py-28 border-t border-white/5 overflow-hidden">
        <div className="absolute top-12 right-12 lg:right-24 pointer-events-none">
          <ChapterNumeral num="02" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5">
              <ChapterTitle kicker="The Mistral project" title="Testing by hand." />
              <Reveal delay={0.1}>
                <p className="mt-6 text-slate-300 leading-relaxed">
                  First real client work: a closed Mistral project, manually tested
                  end-to-end. Wrote and executed cases across happy paths, negative
                  inputs, and the edge cases that only show up when you actually click
                  through.
                </p>
                <p className="mt-3 text-slate-500 text-sm italic">
                  No GitHub link, this work lives in Jira.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <JiraTicket />
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ Chapter 03 — Playwright toolbox (hover-reveal tiles) ═════════ */}
      <section id="ch3" className="relative px-6 py-28 border-t border-white/5 overflow-hidden">
        <div className="absolute top-12 left-12 pointer-events-none">
          <ChapterNumeral num="03" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <ChapterTitle kicker="Meeting Playwright" title="The toolbox." />
            <Reveal delay={0.1}>
              <p className="mt-6 text-slate-300 leading-relaxed">
                The pivot from manual to automation. Playwright's locator philosophy
                from the inside out — built-in locators first, then CSS, then XPath
                axes for the cases the others can't reach. Drilled every awkward DOM
                widget the real world throws at you, one labbed spec at a time.
              </p>
              <p className="mt-3 text-slate-500 text-sm italic">
                Hover any tile to see the locator I'd actually reach for.
              </p>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tools.map((t, i) => (
              <LocatorTile key={t.label} tool={t} i={i} />
            ))}
          </div>

          <Reveal delay={0.2}>
            <a
              href="https://github.com/EldarSarajlic/htec-playwright-automation/tree/main/tests"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-mint-400 hover:text-mint-300 transition-colors text-sm"
            >
              Browse the course / lab specs on GitHub
              <FiArrowUpRight />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ═════════ Chapter 04 — OrangeHRM raw (typewriter + terminal) ═════════ */}
      <section id="ch4" className="relative px-6 py-28 border-t border-white/5 overflow-hidden">
        <div className="absolute -bottom-8 right-12 pointer-events-none">
          <ChapterNumeral num="04" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <ChapterTitle kicker="OrangeHRM, raw" title="First real specs." />
            <Reveal delay={0.1}>
              <p className="mt-6 text-slate-300 leading-relaxed">
                The practice site. Same discipline as the old Mistral project: manual test cases
                first, by hand, for the login page, the dashboard, and finally creating a user as an admin. Then the
                first automation pass: no Page Object Model, no fixtures, just specs
                and selectors.
              </p>
              <p className="mt-3 text-slate-500 text-sm italic">
                Deliberately the "before" picture I'd refactor later.
              </p>
            </Reveal>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            <Reveal className="lg:col-span-2" delay={0.05}>
              <TiltCard max={6} lift={6}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 h-full">
                  <ManualCasesTypewriter />
                </div>
              </TiltCard>
            </Reveal>
            <Reveal className="lg:col-span-3" delay={0.12}>
              <TiltCard max={9} lift={16} spotlight>
              <div className="rounded-2xl border border-white/10 bg-[#0a1622] overflow-hidden h-full shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/40" />
                    <span className="h-2.5 w-2.5 rounded-full bg-mint-400/40" />
                    <span className="ml-3 font-mono">login.spec.ts</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-300/70">
                    Raw — no POM
                  </span>
                </div>
                <pre className="p-5 text-[12.5px] leading-relaxed text-slate-300 overflow-x-auto font-mono">
                  <code>
                    <span className="text-slate-500">// before fixtures, before POM</span>
                    {"\n"}
                    <span className="text-pink-300">test</span>(
                    <span className="text-mint-400">'logs in with valid creds'</span>,{" "}
                    <span className="text-sky-300">async</span> ({"{"} page {"}"}) {"=>"}{" "}
                    {"{"}
                    {"\n"}
                    {"  "}
                    <span className="text-sky-300">await</span> page.
                    <span className="text-pink-300">goto</span>(
                    <span className="text-mint-400">'/auth/login'</span>);{"\n"}
                    {"  "}
                    <span className="text-sky-300">await</span> page.
                    <span className="text-pink-300">locator</span>(
                    <span className="text-mint-400">"input[name='username']"</span>).
                    <span className="text-pink-300">fill</span>(
                    <span className="text-mint-400">'Admin'</span>);{"\n"}
                    {"  "}
                    <span className="text-sky-300">await</span> page.
                    <span className="text-pink-300">locator</span>(
                    <span className="text-mint-400">"input[name='password']"</span>).
                    <span className="text-pink-300">fill</span>(
                    <span className="text-mint-400">'admin123'</span>);{"\n"}
                    {"  "}
                    <span className="text-sky-300">await</span> page.
                    <span className="text-pink-300">getByRole</span>(
                    <span className="text-mint-400">'button'</span>, {"{"} name:{" "}
                    <span className="text-mint-400">/login/i</span> {"}"}).
                    <span className="text-pink-300">click</span>();{"\n"}
                    {"  "}
                    <span className="text-sky-300">await</span>{" "}
                    <span className="text-pink-300">expect</span>(page).
                    <span className="text-pink-300">toHaveURL</span>(
                    <span className="text-mint-400">/dashboard/</span>);{"\n"}
                    {"}"});{"\n\n"}
                    <span className="text-slate-500">// every spec repeated the same login.</span>
                    {"\n"}
                    <span className="text-slate-500">// that's the smell that drove ch. 05.</span>
                  </code>
                </pre>
              </div>
              </TiltCard>
            </Reveal>
          </div>

          <Reveal delay={0.18}>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
              {["Raw Playwright", "No POM", "No fixtures", "Selector-by-selector"].map((t) => (
                <span key={t} className="text-xs text-slate-500 border-b border-mint-400/50 pb-px">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═════════ Chapter 05 — climax ═════════ */}
      <section id="ch5" className="relative px-6 py-32 border-t border-white/5 overflow-hidden">
        <Aurora />
        <div className="absolute top-12 right-12 pointer-events-none">
          <ChapterNumeral num="05" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl mb-14">
            <Reveal>
              <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-mint-300 mb-4">
                Climax
              </div>
              <h2 className="font-display text-4xl md:text-6xl text-white font-bold tracking-tight leading-[1.02]">
                Building the <span className="text-gradient">framework.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-slate-300 leading-relaxed text-lg">
                Studied how OrangeHRM actually worked under the hood: cookies, auth
                headers, API shapes (Postman did the response analysis). Then rewrote
                the suite as a proper framework: seven page objects under a shared
                BasePage, a custom <span className="font-mono text-mint-300">pages</span>{" "}
                fixture, cookie based session reuse with a live API validator, a
                two-project split for authenticated vs. unauthenticated specs, and dotenv-driven
                config. Every module went through a two step rhythm — raw spec first,
                then refactor onto the POM and fixture once the patterns settled.
              </p>
              <p className="mt-3 font-signature text-mint-300 text-xl">
                The 13 PRs are the curriculum.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.14}>
            <ArchDiagram />
          </Reveal>

          <div className="mt-10 grid lg:grid-cols-3 gap-4">
            <Reveal delay={0.05}>
              <TiltCard max={8} lift={10} spotlight>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 h-full">
                <div className="flex items-center gap-2 text-mint-400 mb-3">
                  <FiLayers />
                  <span className="text-xs uppercase tracking-[0.25em]">Page objects · 7</span>
                </div>
                <ul className="space-y-1.5 text-sm text-slate-300 font-mono">
                  {[
                    "BasePage",
                    "LoginPage",
                    "DashboardPage",
                    "AdminUserManagementPage",
                    "AdminAddUserPage",
                    "PimEmployeeListPage",
                    "PimAddEmployeePage",
                  ].map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <span className="text-mint-400/60">·</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                  Shared waiters and validators on BasePage; every spec gets a fresh
                  bundle through the <span className="font-mono text-slate-400">pages</span>{" "}
                  fixture.
                </p>
              </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={0.1}>
              <TiltCard max={10} lift={14} spotlight glowBorder>
              <div className="rounded-2xl border border-mint-500/30 bg-mint-500/[0.04] p-6 h-full shadow-[0_30px_60px_-25px_rgba(61,210,165,0.4)]">
                <div className="flex items-center gap-2 text-mint-400 mb-3">
                  <FiKey />
                  <span className="text-xs uppercase tracking-[0.25em]">Session reuse</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Log in once. Save{" "}
                  <span className="font-mono text-mint-300">storageState</span> to{" "}
                  <span className="font-mono text-mint-300">
                    playwright/.auth/admin.json
                  </span>
                  . Before every run, the{" "}
                  <span className="font-mono text-mint-300">auth-validator</span> makes a
                  real API call — if it redirects to{" "}
                  <span className="font-mono text-mint-300">/auth/login</span>, the cookie
                  is stale and the file is deleted so a fresh login runs. The suite never
                  wastes time on expired auth and never silently runs against half-broken
                  sessions.
                </p>
              </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={0.15}>
              <TiltCard max={8} lift={10} spotlight>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 h-full">
                <div className="flex items-center gap-2 text-mint-400 mb-3">
                  <FiServer />
                  <span className="text-xs uppercase tracking-[0.25em]">API testing</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Pure <span className="font-mono text-slate-400">request</span> context —
                  no browser, no UI. Login, Dashboard, and User Management endpoints
                  validated against the real OrangeHRM API; the Restful-Booker lab specs
                  sit alongside as the course-driven intro to API testing.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md border border-white/5 bg-white/[0.02] px-3 py-2">
                    <div className="text-slate-200 tabular-nums">4 + 2 + 7</div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-widest mt-0.5">
                      OrangeHRM API cases
                    </div>
                  </div>
                  <div className="rounded-md border border-white/5 bg-white/[0.02] px-3 py-2">
                    <div className="text-slate-200 tabular-nums">5</div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-widest mt-0.5">
                      Restful-Booker lab
                    </div>
                  </div>
                </div>
              </div>
              </TiltCard>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-3 border-t border-white/5 pt-6">
              <Stat k="47" v="UI cases" />
              <Stat k="13" v="API cases" />
              <Stat k="10" v="OrangeHRM spec files" />
              <Stat k="13" v="mentor-reviewed PRs" />
              <Stat k="2" v="project split (auth · unauth)" />
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-10">
              <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-4">
                The raw → refactor rhythm
              </div>
              <PRStepper />
              <p className="mt-3 text-xs text-slate-500 italic">
                Every UI module shipped twice — once to learn, once to last.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═════════ Chapter 06 — DeepEval (conversation mock) ═════════ */}
      <section id="ch6" className="relative px-6 py-28 border-t border-white/5 overflow-hidden">
        <div className="absolute -top-8 left-12 pointer-events-none">
          <ChapterNumeral num="06" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <ChapterTitle kicker="DeepEval" title="When the judge is an LLM." />
            <Reveal delay={0.1}>
              <p className="mt-6 text-slate-300 leading-relaxed">
                Stepped sideways to study DeepEval and the LLM-as-judge pattern. The
                interesting part wasn't just scoring outputs, it was thinking about
                how a model, given a framework's conventions as context, could generate
                test cases in the same shape I'd just written by hand.
              </p>
              <p className="mt-3 text-slate-500 text-sm italic">
                The conventions become the curriculum the model learns from.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <FiCpu className="text-[11px]" />
                  Studied · not implemented in repo
                </span>
              </div>
            </Reveal>
          </div>

          <ConversationMock />

          <Reveal delay={0.25}>
            <div className="mt-10 grid md:grid-cols-3 gap-4">
              {[
                {
                  h: "LLM-as-judge fundamentals",
                  d: "Rubric design, deterministic prompts, where judges agree with humans and where they don't.",
                },
                {
                  h: "Test generation from conventions",
                  d: "Feed the model your POM, naming patterns, and existing specs, it produces new cases in the same shape, not generic ones.",
                },
                {
                  h: "Why conventions matter more, not less",
                  d: "The cleaner the framework's voice, the more useful the model gets at speaking it back.",
                },
              ].map((b, i) => (
                <motion.div
                  key={b.h}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <div className="text-slate-200 font-medium text-sm">{b.h}</div>
                  <div className="text-slate-500 text-xs mt-2 leading-relaxed">{b.d}</div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═════════ Chapter 07 — K6 + GH Actions (visualized) ═════════ */}
      <section id="ch7" className="relative px-6 py-28 border-t border-white/5 overflow-hidden">
        <div className="absolute -bottom-6 right-16 pointer-events-none">
          <ChapterNumeral num="07" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <ChapterTitle kicker="Beyond the curriculum" title="K6 + GitHub Actions." />
            <Reveal delay={0.1}>
              <p className="mt-6 text-slate-300 leading-relaxed">
                On my own time, took Udemy courses to round out the toolkit: load
                testing with Grafana K6 and CI pipelines with GitHub Actions. Neither
                was required; both are the next things I'd reach for after the
                framework was shipped.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 text-xs text-mint-400/60 font-mono">
                  <FiBookOpen className="text-[11px]" />
                  Self-driven · Udemy
                </span>
              </div>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Reveal delay={0.06}>
              <TiltCard max={9} lift={14} spotlight glowBorder>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-mint-400 text-xs tracking-widest">
                      GRAFANA · K6
                    </span>
                    <FiZap className="text-mint-400" />
                  </div>
                  <div className="text-slate-200 font-medium mb-1">Load + performance</div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Smoke → average load → stress → spike, then cooldown. A typical VU ramp:
                  </p>
                  <K6Sparkline />
                  <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-widest text-slate-500">
                    <div>Smoke</div>
                    <div className="text-center text-mint-400">Stress · spike</div>
                    <div className="text-right">Cooldown</div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={0.12}>
              <TiltCard max={9} lift={14} spotlight glowBorder>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-mint-400 text-xs tracking-widest">
                      GITHUB · ACTIONS
                    </span>
                    <FiGithub className="text-mint-400" />
                  </div>
                  <div className="text-slate-200 font-medium mb-1">CI for QA suites</div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-5">
                    Workflow triggers, matrix browsers, caching, artifacts on failure.
                  </p>
                  <GHActionsSteps />
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═════════ Chapter 08 — epilogue (handwritten accent) ═════════ */}
      <section id="ch8" className="relative px-6 py-32 border-t border-white/5 overflow-hidden">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 pointer-events-none">
          <ChapterNumeral num="08" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-3">
                Epilogue
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight">
                What stuck.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 font-signature text-mint-300 text-2xl">
                Three things stayed with me.
              </p>
            </Reveal>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {[
              {
                h: "Think like a tester first, automator second.",
                d: "If I can't write a failing manual test for it, the automation is fiction. The Mistral and OrangeHRM manual passes are the reason the automation reads honestly.",
              },
              {
                h: "Mentor PR review changed how I read code.",
                d: "Thirteen rounds of structured feedback compressed years of reading-other-people's-code into one internship. The PR history is the actual curriculum.",
              },
              {
                h: "The least glamorous decision turned out to be the proudest one.",
                d: "Cookie based session reuse with a live validator isn't a flashy feature, but it's the difference between a suite that runs fast and reliably and one that wastes the first minute every run silently logging in again.",
              },
            ].map((b, i) => (
              <motion.div
                key={b.h}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <TiltCard max={6} lift={8} spotlight>
                  <div className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                    <div
                      className="font-display text-3xl text-mint-400/40 font-bold leading-none shrink-0 w-12 tabular-nums"
                      style={{ transform: "translateZ(40px)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div
                        className="text-slate-100 font-medium"
                        style={{ transform: "translateZ(20px)" }}
                      >
                        {b.h}
                      </div>
                      <div className="text-sm text-slate-400 mt-2 leading-relaxed">{b.d}</div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-20 text-center">
              <h3 className="font-display text-3xl md:text-4xl text-white font-bold tracking-tight">
                Want the technical walk-through?
              </h3>
              <p className="mt-4 text-slate-400 max-w-xl mx-auto">
                Happy to walk through any spec, the POM / fixture split, the
                session-reuse strategy, or the API-test approach.
              </p>
              <div className="mt-8 flex flex-wrap justify-center items-center gap-x-10 gap-y-5">
                <a
                  href="https://github.com/EldarSarajlic/htec-playwright-automation"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm"
                >
                  <FiGithub className="text-mint-400 shrink-0" />
                  <span className="relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-mint-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                    Read the repo
                  </span>
                  <FiArrowUpRight className="text-mint-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <span className="h-4 w-px bg-white/10 hidden sm:block" aria-hidden />
                <a
                  href="mailto:eldarsarajlic525@gmail.com"
                  className="group flex items-center gap-2 text-slate-200 hover:text-white transition-colors text-sm"
                >
                  <span className="relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-mint-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                    Get in touch
                  </span>
                  <FiArrowUpRight className="text-mint-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <span className="h-4 w-px bg-white/10 hidden sm:block" aria-hidden />
                <Link
                  to="/#projects"
                  className="group flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm"
                >
                  <FiArrowLeft className="transition-transform group-hover:-translate-x-0.5" />
                  <span className="relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-slate-500 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                    Back to portfolio
                  </span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
