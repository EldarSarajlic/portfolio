import { useEffect, useRef, useState } from "react";
import { TransitionLink as Link } from "../components/PageTransition";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiCheckCircle,
  FiMessageSquare,
  FiPhone,
  FiMapPin,
  FiUsers,
  FiTruck,
  FiBox,
  FiShield,
  FiLock,
  FiKey,
  FiHash,
  FiMail,
  FiServer,
  FiDatabase,
  FiLayers,
  FiActivity,
  FiCpu,
  FiRadio,
  FiMap,
  FiSend,
  FiFileText,
} from "react-icons/fi";
import Reveal from "../components/Reveal";
import DecryptedText from "../components/DecryptedText";
import Aurora from "../components/Aurora";
import TiltCard from "../components/TiltCard";
import FlipCard from "../components/FlipCard";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ───────────────────────── Chapter metadata ───────────────────────── */

type Chapter = {
  id: string;
  num: string;
  kicker: string;
  title: string;
};

const chapters: Chapter[] = [
  { id: "ch1", num: "01", kicker: "Day zero", title: "The brief" },
  { id: "ch2", num: "02", kicker: "Field research", title: "Field research" },
  { id: "ch3", num: "03", kicker: "Before", title: "Four apps, one mess" },
  { id: "ch4", num: "04", kicker: "After", title: "Four roles, one thread" },
  { id: "ch5", num: "05", kicker: "Locked by design", title: "The closed door" },
  { id: "ch6", num: "06", kicker: "Lifecycle", title: "Order → Shipment → Dispatch" },
  { id: "ch7", num: "07", kicker: "Status", title: "The build" },
  { id: "ch8", num: "08", kicker: "Roadmap", title: "Live telematics" },
  { id: "ch9", num: "09", kicker: "Epilogue", title: "What it taught me" },
];

/* ───────────────────────── Feature breakdown data ───────────────────────── */

type FeatureGroup = { title: string; subtitle: string };

// High-level map of what the platform covers. Kept deliberately brief —
// enough to show the engineering surface, not a blueprint of the product.
const groups: FeatureGroup[] = [
  {
    title: "Authentication & Identity",
    subtitle: "A complete, security-first auth surface: sign-in, multi-factor, third-party login, invite-based onboarding and role-based access.",
  },
  {
    title: "User Management",
    subtitle: "Account lifecycle and self-service profiles, including photo uploads and verified email changes.",
  },
  {
    title: "Fleet — Trucks & Trailers",
    subtitle: "Managing the vehicle fleet with a clear enable / disable and status lifecycle.",
  },
  {
    title: "Vehicle Statuses",
    subtitle: "Shared reference data that keeps trucks and trailers on one status taxonomy.",
  },
  {
    title: "Inventory",
    subtitle: "An admin-managed product catalogue with stock levels and imagery.",
  },
  {
    title: "Dashboard & Analytics",
    subtitle: "Operational overview metrics and order analytics wired to live backend queries.",
  },
  {
    title: "Shipments & Routes",
    subtitle: "The logistics core — turning an approved order into a moving shipment.",
  },
  {
    title: "Dispatches",
    subtitle: "Assigning the right truck, trailer and driver to each shipment.",
  },
  {
    title: "Locations",
    subtitle: "Country and city reference data used across the platform's forms.",
  },
  {
    title: "Real-time & Messaging",
    subtitle: "The infrastructure behind the per-shipment live thread and notifications.",
  },
  {
    title: "Service & Maintenance",
    subtitle: "Tracking vehicle maintenance and the service providers behind it.",
  },
  {
    title: "Cross-cutting Platform",
    subtitle: "Localisation, theming, validation and the shared UI foundations the app is built on.",
  },
];

/* ───────────────────────── Progress mosaic card (Ch 07) ───────────────────────── */

function GroupCard({ g, i }: { g: FeatureGroup; i: number }) {
  return (
    <Reveal delay={i * 0.03}>
      <article className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent p-6 flex flex-col h-full">
        <div className="flex items-baseline gap-3 mb-2">
          <FiCheckCircle className="shrink-0 text-mint-400 text-sm translate-y-0.5" />
          <h3 className="font-display text-lg text-white font-semibold tracking-tight leading-snug">
            {g.title}
          </h3>
        </div>
        <p className="mt-1 text-sm text-slate-400 leading-relaxed">{g.subtitle}</p>
      </article>
    </Reveal>
  );
}

/* ───────────────────────── Scroll progress bar ───────────────────────── */

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
              className={`text-[11px] uppercase tracking-[0.25em] transition-all duration-300 whitespace-nowrap ${
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

/* ───────────────────────── Chapter numeral background ───────────────────────── */

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

/* ───────────────────────── Chapter title pair ───────────────────────── */

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

/* ───────────────────────── Stat counter ───────────────────────── */

function Stat({ k, v }: { k: string | number; v: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display text-2xl text-white font-bold tabular-nums">{k}</span>
      <span className="text-xs uppercase tracking-widest text-slate-500">{v}</span>
    </div>
  );
}

/* ───────────────────────── Kakanj map (Ch 02) ───────────────────────── */

const KAKANJ: [number, number] = [44.1361, 18.1186];

function KakanjPin() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    const el = mapRef.current;
    if (!el || mapInstance.current) return;

    const map = L.map(el, {
      center: KAKANJ,
      zoom: 12,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: true,
    });
    mapInstance.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap &copy; CARTO",
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    const pin = L.divIcon({
      className: "kakanj-pin",
      html:
        '<svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M14 0C6.27 0 0 6.06 0 13.53 0 23.6 14 38 14 38s14-14.4 14-24.47C28 6.06 21.73 0 14 0z" fill="#3dd2a5"/>' +
        '<circle cx="14" cy="13.5" r="5" fill="#06121f"/>' +
        "</svg>",
      iconSize: [28, 38],
      iconAnchor: [14, 38],
      tooltipAnchor: [0, -38],
    });

    L.marker(KAKANJ, { icon: pin })
      .addTo(map)
      .bindTooltip("Kakanj", {
        permanent: true,
        direction: "top",
        className: "kakanj-tooltip",
      })
      .openTooltip();

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const settle = window.setTimeout(() => map.invalidateSize(), 200);

    return () => {
      window.clearTimeout(settle);
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 md:p-10 overflow-hidden">
      <div className="relative flex items-center justify-between mb-5">
        <span className="text-mint-400 text-xs uppercase tracking-[0.3em]">
          The conversation
        </span>
        <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">
          Kakanj · Bosnia
        </span>
      </div>

      <div
        ref={mapRef}
        className="relative z-0 h-56 md:h-72 w-full rounded-2xl overflow-hidden border border-white/10"
        role="img"
        aria-label="Map of Kakanj, Bosnia, with a pin on the town"
      />

      <div className="relative mt-4 text-xs text-slate-500 italic text-center">
        I didn't sketch a wireframe. I drove home and asked.
      </div>
    </div>
  );
}

/* ───────────────────────── Scattered message bubbles (Ch 03) ───────────────────────── */

type Msg = {
  app: string;
  who: string;
  text: string;
  tone: "green" | "blue" | "violet" | "amber";
  x: number;
  y: number;
  delay: number;
};

const scattered: Msg[] = [
  {
    app: "WhatsApp",
    who: "Dispatcher",
    text: "Truck for Zenica?",
    tone: "green",
    x: 4,
    y: 6,
    delay: 0,
  },
  {
    app: "SMS",
    who: "Driver",
    text: "Stuck at customs, 1h delay",
    tone: "blue",
    x: 52,
    y: 14,
    delay: 0.2,
  },
  {
    app: "Viber",
    who: "Client",
    text: "Where is my load?",
    tone: "violet",
    x: 18,
    y: 36,
    delay: 0.35,
  },
  {
    app: "Call · missed",
    who: "Driver",
    text: "(2 missed)",
    tone: "amber",
    x: 58,
    y: 48,
    delay: 0.5,
  },
  {
    app: "WhatsApp",
    who: "Owner",
    text: "Trailer at workshop?",
    tone: "green",
    x: 8,
    y: 62,
    delay: 0.6,
  },
  {
    app: "SMS",
    who: "Client",
    text: "Pickup time changed",
    tone: "blue",
    x: 60,
    y: 72,
    delay: 0.7,
  },
];

function ScatteredMessages() {
  return (
    <div className="relative h-[420px] md:h-[480px] rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-15 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />

      {/* Scattered overlapping bubbles */}
      {scattered.map((m, i) => {
        const toneClass = {
          green: "border-emerald-400/30 bg-emerald-500/[0.06]",
          blue: "border-sky-400/30 bg-sky-500/[0.06]",
          violet: "border-violet-400/30 bg-violet-500/[0.06]",
          amber: "border-amber-400/30 bg-amber-500/[0.06]",
        }[m.tone];
        const labelClass = {
          green: "text-emerald-300",
          blue: "text-sky-300",
          violet: "text-violet-300",
          amber: "text-amber-300",
        }[m.tone];
        const rot = (i % 2 === 0 ? -1 : 1) * (1 + (i % 3));

        return (
          <motion.div
            key={`${m.app}-${i}`}
            initial={{ opacity: 0, y: 12, rotate: rot }}
            whileInView={{ opacity: 1, y: 0, rotate: rot }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.5, delay: m.delay, ease: [0.22, 1, 0.36, 1] }}
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
            className={`absolute w-[210px] md:w-[240px] rounded-2xl border ${toneClass} backdrop-blur-sm p-3 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.7)]`}
          >
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest mb-1.5">
              <span className={labelClass}>{m.app}</span>
              <span className="text-slate-500">{m.who}</span>
            </div>
            <div className="text-sm text-slate-200">{m.text}</div>
          </motion.div>
        );
      })}

      {/* Center anchor — the human caught in the middle */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.45, delay: 0.9 }}
          className="relative"
        >
          <div className="rounded-2xl border border-amber-400/40 bg-ink-950/85 backdrop-blur-md px-5 py-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2 text-amber-300 text-[10px] uppercase tracking-[0.3em] mb-1">
              <FiPhone className="text-[11px]" />
              The dispatcher
            </div>
            <div className="text-slate-100 text-sm font-medium">
              4 apps, 1 brain.
            </div>
            <div className="text-slate-500 text-xs mt-0.5">
              Nothing in one place.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ───────────────────────── Role cards (Ch 04) ───────────────────────── */

type Role = {
  icon: React.ReactNode;
  name: string;
  job: string;
  tag: string;
};

const roles: Role[] = [
  {
    icon: <FiShield />,
    name: "Admin",
    job: "Onboards every account. Owns the keys.",
    tag: "Closed-door gatekeeper",
  },
  {
    icon: <FiUsers />,
    name: "Dispatcher",
    job: "Approves orders, plans shipments, runs the thread.",
    tag: "Central operational role",
  },
  {
    icon: <FiTruck />,
    name: "Driver",
    job: "Gets the assignment, updates status from the cab.",
    tag: "On the road",
  },
  {
    icon: <FiBox />,
    name: "Client",
    job: "Places the order, tracks it with a single use code.",
    tag: "Self-service, no signup",
  },
];

function RolesRow() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {roles.map((r, i) => (
        <motion.div
          key={r.name}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          <TiltCard max={8} lift={10} spotlight>
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-5 h-full overflow-hidden">
              <div
                className="text-mint-400 text-xl mb-3"
                style={{ transform: "translateZ(40px)" }}
              >
                {r.icon}
              </div>
              <div
                className="text-slate-100 font-medium"
                style={{ transform: "translateZ(25px)" }}
              >
                {r.name}
              </div>
              <div className="text-slate-400 text-xs mt-2 leading-relaxed">{r.job}</div>
              <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-mint-400/80 border-t border-white/5 pt-3 w-full">
                <span className="h-1 w-1 rounded-full bg-mint-400" />
                {r.tag}
              </div>
            </div>
          </TiltCard>
        </motion.div>
      ))}
    </div>
  );
}

/* ───────────────────────── Thread mock (Ch 04) ───────────────────────── */

type ThreadMsg = {
  role: "dispatcher" | "driver" | "client";
  text: string;
  time: string;
};

const threadMsgs: ThreadMsg[] = [
  { role: "dispatcher", text: "Pickup tomorrow 07:30. Sarajevo → Zenica.", time: "09:42" },
  { role: "client", text: "Confirmed. Loading dock B.", time: "09:45" },
  { role: "driver", text: "On the way to depot. ETA 07:15.", time: "07:02" },
  { role: "driver", text: "Loaded. Heading out.", time: "07:48" },
  { role: "client", text: "Anything I should know about traffic?", time: "08:10" },
  { role: "dispatcher", text: "Light delay near M17, should still be on time.", time: "08:12" },
];

function ThreadMock() {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden shadow-[0_40px_80px_-25px_rgba(0,0,0,0.7)]">
      {/* Thread header */}
      <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-400" />
          <div>
            <div className="text-slate-100 font-medium text-sm">Shipment #SH-1042</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">
              Sarajevo → Zenica · 12,400 kg
            </div>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-mint-400 font-mono">
          <FiActivity className="text-[11px]" />
          live
        </span>
      </div>

      {/* Messages */}
      <div className="px-5 py-5 space-y-3 max-h-[420px] overflow-hidden">
        {threadMsgs.map((m, i) => {
          const isClient = m.role === "client";
          const isDispatcher = m.role === "dispatcher";
          const align = isClient ? "items-end" : "items-start";
          const bubble = isDispatcher
            ? "bg-mint-500/[0.07] border-mint-500/30 text-slate-200"
            : isClient
            ? "bg-violet-500/[0.07] border-violet-400/30 text-slate-200"
            : "bg-sky-500/[0.07] border-sky-400/30 text-slate-200";
          const tag = isDispatcher
            ? "text-mint-300"
            : isClient
            ? "text-violet-300"
            : "text-sky-300";
          const Icon = isDispatcher ? FiUsers : isClient ? FiBox : FiTruck;

          return (
            <motion.div
              key={`${m.role}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className={`flex flex-col ${align}`}
            >
              <div className={`flex items-center gap-2 text-[10px] uppercase tracking-widest mb-1 ${tag}`}>
                <Icon className="text-[10px]" />
                {m.role}
                <span className="text-slate-600 font-mono normal-case tracking-normal">
                  · {m.time}
                </span>
              </div>
              <div
                className={`max-w-[78%] rounded-2xl border px-3.5 py-2 text-[13px] leading-relaxed ${bubble} ${
                  isClient ? "rounded-br-sm" : "rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02] flex items-center gap-2">
        <div className="flex-1 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-xs text-slate-500">
          Message #SH-1042…
        </div>
        <button
          type="button"
          aria-label="Send"
          className="h-8 w-8 rounded-full bg-mint-500/20 text-mint-300 inline-flex items-center justify-center"
        >
          <FiSend className="text-sm" />
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── Closed-door flip card (Ch 05) ───────────────────────── */

function ClosedDoorFlip() {
  const Front = (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] overflow-hidden h-full shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.03]">
        <span className="text-[11px] text-slate-500 uppercase tracking-widest">
          Registration
        </span>
        <span className="text-[11px] text-amber-300/70 uppercase tracking-widest">
          Closed
        </span>
      </div>

      <div className="px-5 pt-6 pb-5 text-center flex-1 flex flex-col items-center justify-center">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300">
          <FiLock className="text-xl" />
        </div>
        <div className="text-slate-100 font-medium leading-snug">
          No public signup.
        </div>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          The platform is for one company at a time. Anyone with a role exists
          because the admin onboarded them.
        </p>
      </div>

      <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02] text-[11px] text-slate-500 italic flex items-center justify-between">
        <span className="[@media(pointer:coarse)]:hidden">Hover to see how the keys actually move.</span>
        <span className="hidden [@media(pointer:coarse)]:inline">Tap to see how the keys actually move.</span>
        <span className="not-italic font-mono text-slate-600">↻</span>
      </div>
    </div>
  );

  const steps = [
    {
      icon: <FiMail />,
      h: "Admin emails an invitation",
      d: "Onboarding starts with a private, expiring invitation — never a public sign-up form.",
      tone: "mint" as const,
    },
    {
      icon: <FiShield />,
      h: "User accepts on a one-off page",
      d: "The invite opens a one-time page where the new user sets their own password.",
      tone: "mint" as const,
    },
    {
      icon: <FiHash />,
      h: "Clients get a tracking code instead",
      d: "Clients never create an account — they get a link scoped to a single shipment. No account, no friction.",
      tone: "amber" as const,
    },
  ];

  const Back = (
    <div className="rounded-2xl border border-mint-500/30 bg-gradient-to-b from-mint-500/[0.06] to-white/[0.02] overflow-hidden h-full shadow-[0_30px_80px_-20px_rgba(61,210,165,0.35)]">
      <div className="px-5 py-3 border-b border-white/5 bg-mint-500/[0.06] flex items-center justify-between">
        <span className="font-mono text-mint-300 text-[11px] tracking-widest">
          KEYS · HOW THEY MOVE
        </span>
        <span className="text-[10px] uppercase tracking-widest text-mint-300/70">
          Three doors
        </span>
      </div>
      <div className="p-5 space-y-3">
        {steps.map((s) => (
          <div
            key={s.h}
            className={`rounded-xl border bg-white/[0.02] p-3 ${
              s.tone === "mint" ? "border-mint-500/30" : "border-amber-400/30"
            }`}
          >
            <div
              className={`flex items-center gap-2 text-[10px] uppercase tracking-widest mb-1 ${
                s.tone === "mint" ? "text-mint-400" : "text-amber-300"
              }`}
            >
              <span className="text-[12px]">{s.icon}</span>
              {s.h}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[420px]"
    >
      <FlipCard front={Front} back={Back} />
    </motion.div>
  );
}

/* ───────────────────────── Tracking code card (Ch 05) ───────────────────────── */

function TrackingCodeCard() {
  const reduce = useReducedMotion();
  const code = "K2-9F4-XJ81";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard max={9} lift={14} spotlight glowBorder>
        <div className="relative rounded-2xl border border-white/10 bg-[#0a1622] p-6 overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] min-h-[420px] flex flex-col">
          <div className="flex items-center gap-2 text-mint-400 mb-4">
            <FiKey />
            <span className="text-xs uppercase tracking-[0.25em]">Tracking code</span>
          </div>

          <div className="text-slate-400 text-sm leading-relaxed">
            A client doesn't need an account necessarily, they need one safe link to their
            shipment. The admin / dispatcher hands them a single use code that
            opens the live thread for their delivery.
          </div>

          <div
            className="mt-6 rounded-xl border border-mint-500/30 bg-mint-500/[0.04] py-5 text-center"
            style={{ transform: "translateZ(40px)" }}
          >
            <div className="text-[10px] uppercase tracking-[0.4em] text-mint-300 mb-2">
              Your shipment code
            </div>
            <div className="font-display text-3xl md:text-4xl text-white font-bold tracking-[0.2em] tabular-nums">
              {code}
            </div>
            <div className="mt-3 text-[11px] text-slate-500 font-mono">
              expires when SH-1042 completes
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-widest text-slate-500 mt-auto pt-4 border-t border-white/5">
            <div>
              <div className="text-slate-300 mb-0.5">Single-use</div>
              <div className="text-mint-400 font-mono normal-case tracking-normal">
                consumed on first open
              </div>
            </div>
            <div className="text-center">
              <div className="text-slate-300 mb-0.5">Scoped</div>
              <div className="text-mint-400 font-mono normal-case tracking-normal">
                one shipment only
              </div>
            </div>
            <div className="text-right">
              <div className="text-slate-300 mb-0.5">Expiring</div>
              <div className="text-mint-400 font-mono normal-case tracking-normal">
                on completion
              </div>
            </div>
          </div>

          {!reduce && (
            <span className="absolute -inset-10 -z-10 bg-mint-500/[0.08] blur-3xl pointer-events-none" />
          )}
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ───────────────────────── Lifecycle diagram (Ch 06) ───────────────────────── */

function LifecycleDiagram() {
  const reduce = useReducedMotion();
  return (
    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 md:p-10 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-mint-400 text-xs uppercase tracking-[0.3em]">
            One delivery, three lifecycles
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-mint-500/40 to-transparent" />
        </div>

        <svg
          viewBox="0 0 920 280"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="lcArrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="#3dd2a5" />
            </marker>
            <linearGradient id="lcLane" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#3dd2a5" stopOpacity="0" />
              <stop offset="50%" stopColor="#3dd2a5" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3dd2a5" stopOpacity="0" />
            </linearGradient>
            <path id="lcFlow" d="M 200 140 L 320 140 L 460 140 L 600 140 L 720 140" />
          </defs>

          <line x1="60" y1="140" x2="860" y2="140" stroke="url(#lcLane)" strokeWidth="1" />

          {/* Flowing particles */}
          {!reduce &&
            [0, 0.4, 0.8].map((delay) => (
              <circle key={delay} r="3.5" fill="#5ee3b3">
                <animateMotion
                  dur="4.5s"
                  repeatCount="indefinite"
                  begin={`${delay * 4.5}s`}
                  rotate="auto"
                >
                  <mpath href="#lcFlow" />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.15;0.85;1"
                  dur="4.5s"
                  repeatCount="indefinite"
                  begin={`${delay * 4.5}s`}
                />
              </circle>
            ))}

          {/* Node 1 — Order */}
          <g>
            <rect
              x="40"
              y="70"
              width="200"
              height="140"
              rx="14"
              fill="rgba(61,210,165,0.05)"
              stroke="rgba(61,210,165,0.4)"
            />
            <text
              x="140"
              y="100"
              textAnchor="middle"
              fill="#5ee3b3"
              fontSize="11"
              fontFamily="ui-monospace"
              letterSpacing="2"
            >
              ORDER
            </text>
            <text x="140" y="126" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontFamily="Hanken Grotesk">
              What the client wants
            </text>
            <text x="140" y="148" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Hanken Grotesk">
              items · priority · delivery
            </text>
            <text
              x="140"
              y="175"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="10"
              fontFamily="ui-monospace"
              letterSpacing="1"
            >
              owned by · CLIENT
            </text>
            <text x="140" y="192" textAnchor="middle" fill="#5ee3b3" fontSize="10" fontFamily="Hanken Grotesk">
              dispatcher approves
            </text>
          </g>

          <line
            x1="245"
            y1="140"
            x2="315"
            y2="140"
            stroke="#3dd2a5"
            strokeWidth="1.5"
            markerEnd="url(#lcArrow)"
          />

          {/* Node 2 — Shipment */}
          <g>
            <rect x="320" y="50" width="220" height="180" rx="14" fill="#06121f" />
            <rect
              x="320"
              y="50"
              width="220"
              height="180"
              rx="14"
              fill="rgba(61,210,165,0.07)"
              stroke="rgba(61,210,165,0.55)"
            />
            <text
              x="430"
              y="80"
              textAnchor="middle"
              fill="#5ee3b3"
              fontSize="11"
              fontFamily="ui-monospace"
              letterSpacing="2"
            >
              SHIPMENT
            </text>
            <text x="430" y="108" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontFamily="Hanken Grotesk">
              How it actually moves
            </text>
            <text x="430" y="130" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Hanken Grotesk">
              weight · volume · route
            </text>
            <text
              x="430"
              y="158"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="10"
              fontFamily="ui-monospace"
              letterSpacing="1"
            >
              owned by · DISPATCHER
            </text>
            <text x="430" y="178" textAnchor="middle" fill="#5ee3b3" fontSize="10" fontFamily="Hanken Grotesk">
              opens the per shipment thread
            </text>
            <text x="430" y="200" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="Hanken Grotesk" fontStyle="italic">
              client gets the tracking code here
            </text>
          </g>

          <line
            x1="545"
            y1="140"
            x2="615"
            y2="140"
            stroke="#3dd2a5"
            strokeWidth="1.5"
            markerEnd="url(#lcArrow)"
          />

          {/* Node 3 — Dispatch */}
          <g>
            <rect
              x="620"
              y="70"
              width="240"
              height="140"
              rx="14"
              fill="rgba(61,210,165,0.05)"
              stroke="rgba(61,210,165,0.4)"
            />
            <text
              x="740"
              y="100"
              textAnchor="middle"
              fill="#5ee3b3"
              fontSize="11"
              fontFamily="ui-monospace"
              letterSpacing="2"
            >
              DISPATCH
            </text>
            <text x="740" y="126" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontFamily="Hanken Grotesk">
              Who actually does it
            </text>
            <text x="740" y="148" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Hanken Grotesk">
              truck + trailer + driver
            </text>
            <text
              x="740"
              y="175"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="10"
              fontFamily="ui-monospace"
              letterSpacing="1"
            >
              owned by · DISPATCHER
            </text>
            <text x="740" y="192" textAnchor="middle" fill="#5ee3b3" fontSize="10" fontFamily="Hanken Grotesk">
              driver runs the delivery
            </text>
          </g>

          {/* Caption */}
          <text
            x="460"
            y="258"
            textAnchor="middle"
            fill="#64748b"
            fontSize="11"
            fontFamily="Hanken Grotesk"
            fontStyle="italic"
          >
            three entities · three statuses · three owners — that's the point, not the cost
          </text>
        </svg>
      </div>
    </div>
  );
}

/* ───────────────────────── Telematics signal-path diagram (Ch 08) ───────────────────────── */

function TelematicsFlow() {
  const reduce = useReducedMotion();
  return (
    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 md:p-10 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-mint-400 text-xs uppercase tracking-[0.3em]">
            Cab to dispatcher · one signal path
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-mint-500/40 to-transparent" />
        </div>

        <svg viewBox="0 0 1000 300" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker
              id="tmArrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="#3dd2a5" />
            </marker>
            <linearGradient id="tmLane" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#3dd2a5" stopOpacity="0" />
              <stop offset="50%" stopColor="#3dd2a5" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3dd2a5" stopOpacity="0" />
            </linearGradient>
            <path id="tmFlow" d="M 110 160 L 890 160" />
          </defs>

          <line x1="10" y1="160" x2="990" y2="160" stroke="url(#tmLane)" strokeWidth="1" />

          {/* Flowing particles */}
          {!reduce &&
            [0, 0.4, 0.8].map((delay) => (
              <circle key={delay} r="3.5" fill="#5ee3b3">
                <animateMotion
                  dur="5s"
                  repeatCount="indefinite"
                  begin={`${delay * 5}s`}
                  rotate="auto"
                >
                  <mpath href="#tmFlow" />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.15;0.85;1"
                  dur="5s"
                  repeatCount="indefinite"
                  begin={`${delay * 5}s`}
                />
              </circle>
            ))}

          {/* Node 1 — Teltonika device */}
          <g>
            <rect x="10" y="95" width="195" height="130" rx="14" fill="rgba(61,210,165,0.05)" stroke="rgba(61,210,165,0.4)" />
            <text x="107" y="124" textAnchor="middle" fill="#5ee3b3" fontSize="11" fontFamily="ui-monospace" letterSpacing="2">
              TELTONIKA FMB
            </text>
            <text x="107" y="150" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontFamily="Hanken Grotesk">
              GPS unit in the cab
            </text>
            <text x="107" y="172" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Hanken Grotesk">
              location · ignition · CAN
            </text>
            <text x="107" y="198" textAnchor="middle" fill="#5ee3b3" fontSize="10" fontFamily="Hanken Grotesk">
              streams over GPRS / LTE
            </text>
          </g>

          <line x1="208" y1="160" x2="268" y2="160" stroke="#3dd2a5" strokeWidth="1.5" markerEnd="url(#tmArrow)" />
          <text x="238" y="148" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="ui-monospace" letterSpacing="1">
            binary · TCP
          </text>

          {/* Node 2 — listener (emphasized) */}
          <g>
            <rect x="272" y="70" width="205" height="180" rx="14" fill="#06121f" />
            <rect x="272" y="70" width="205" height="180" rx="14" fill="rgba(61,210,165,0.07)" stroke="rgba(61,210,165,0.55)" />
            <text x="374" y="100" textAnchor="middle" fill="#5ee3b3" fontSize="11" fontFamily="ui-monospace" letterSpacing="2">
              TCP LISTENER
            </text>
            <text x="374" y="128" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontFamily="Hanken Grotesk">
              Decodes the stream
            </text>
            <text x="374" y="150" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Hanken Grotesk">
              validates the device
            </text>
            <text x="374" y="170" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Hanken Grotesk">
              parses position records
            </text>
            <text x="374" y="196" textAnchor="middle" fill="#5ee3b3" fontSize="10" fontFamily="Hanken Grotesk">
              .NET background service
            </text>
          </g>

          <line x1="480" y1="160" x2="540" y2="160" stroke="#3dd2a5" strokeWidth="1.5" markerEnd="url(#tmArrow)" />

          {/* Node 3 — position store */}
          <g>
            <rect x="544" y="95" width="160" height="130" rx="14" fill="rgba(61,210,165,0.05)" stroke="rgba(61,210,165,0.4)" />
            <text x="624" y="124" textAnchor="middle" fill="#5ee3b3" fontSize="11" fontFamily="ui-monospace" letterSpacing="2">
              POSITION STORE
            </text>
            <text x="624" y="150" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontFamily="Hanken Grotesk">
              Pings persisted
            </text>
            <text x="624" y="172" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Hanken Grotesk">
              per truck · per dispatch
            </text>
            <text x="624" y="198" textAnchor="middle" fill="#5ee3b3" fontSize="10" fontFamily="Hanken Grotesk">
              history + last-known
            </text>
          </g>

          <line x1="707" y1="160" x2="767" y2="160" stroke="#3dd2a5" strokeWidth="1.5" markerEnd="url(#tmArrow)" />

          {/* Node 4 — dispatcher map */}
          <g>
            <rect x="770" y="95" width="220" height="130" rx="14" fill="rgba(61,210,165,0.05)" stroke="rgba(61,210,165,0.4)" />
            <text x="880" y="124" textAnchor="middle" fill="#5ee3b3" fontSize="11" fontFamily="ui-monospace" letterSpacing="2">
              DISPATCHER MAP
            </text>
            <text x="880" y="150" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontFamily="Hanken Grotesk">
              Live truck markers
            </text>
            <text x="880" y="172" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Hanken Grotesk">
              Leaflet · real-time
            </text>
            <text x="880" y="198" textAnchor="middle" fill="#5ee3b3" fontSize="10" fontFamily="Hanken Grotesk">
              ETA from real position
            </text>
          </g>

          {/* Caption */}
          <text x="500" y="285" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="Hanken Grotesk" fontStyle="italic">
            self-reported status stays — this adds the hardware truth underneath it
          </text>
        </svg>
      </div>
    </div>
  );
}

/* ───────────────────────── Hero 3D scene (shipment thread card stack) ───────────────────────── */

function HeroScene() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [12, -12]);
  const rotY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-18, 18]);

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
    <div
      ref={ref}
      className="relative [perspective:1600px] w-full h-full"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{
          rotateX: rxCombined,
          rotateY: ryCombined,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full will-change-transform"
      >
        {/* Back layer — roles */}
        <div
          className="absolute inset-x-6 top-10 rounded-2xl border border-white/10 bg-ink-900/60 p-5 backdrop-blur-sm shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]"
          style={{ transform: "translateZ(-40px)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] tracking-widest text-slate-500">
              ROLES · 4
            </span>
            <span className="text-[10px] uppercase tracking-widest text-mint-400">
              unified
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <FiShield className="text-mint-400" />
              Admin
            </div>
            <div className="flex items-center gap-2">
              <FiUsers className="text-mint-400" />
              Dispatcher
            </div>
            <div className="flex items-center gap-2">
              <FiTruck className="text-mint-400" />
              Driver
            </div>
            <div className="flex items-center gap-2">
              <FiBox className="text-mint-400" />
              Client
            </div>
          </div>
        </div>

        {/* Middle layer — tracking code */}
        <div
          className="absolute right-4 top-32 w-60 rounded-2xl border border-mint-500/30 bg-mint-500/[0.07] p-4 shadow-[0_30px_60px_-20px_rgba(61,210,165,0.4)]"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="flex items-center gap-2 text-mint-300 text-[10px] uppercase tracking-[0.3em] mb-2">
            <FiKey className="text-[11px]" />
            tracking code
          </div>
          <div className="font-display text-2xl text-white font-bold tracking-[0.18em] tabular-nums">
            K2-9F4
          </div>
          <div className="text-slate-500 text-[10px] mt-1 font-mono">single-use · scoped to SH-1042</div>
        </div>

        {/* Front layer — shipment thread */}
        <div
          className="absolute left-4 bottom-6 w-72 rounded-2xl border border-white/10 bg-ink-950/80 backdrop-blur-md p-4 shadow-[0_40px_80px_-25px_rgba(0,0,0,0.8)]"
          style={{ transform: "translateZ(60px)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] tracking-widest text-slate-500">
              SH-1042 · THREAD
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-mint-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-mint-400" />
              live
            </span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
            {[
              ["dispatcher", "Pickup tomorrow 07:30"],
              ["driver", "Loaded. Heading out."],
              ["client", "Anything on traffic?"],
              ["dispatcher", "Light delay M17"],
            ].map(([who, msg]) => (
              <div key={msg} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FiMessageSquare className="text-mint-400 text-[10px]" />
                  <span className="text-slate-500 uppercase tracking-widest text-[9px] w-16">
                    {who}
                  </span>
                </span>
                <span className="text-slate-300 truncate ml-2 max-w-[150px]">{msg}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-baseline justify-between">
            <span className="text-[10px] uppercase tracking-widest text-slate-500">
              In thread
            </span>
            <span className="font-display text-xl text-white font-bold tabular-nums">
              3<span className="text-mint-400"> roles</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ───────────────────────── Page ───────────────────────── */

export default function DispatcherPage() {
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
            href="mailto:eldarsarajlic525@gmail.com"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-mint-400 transition-colors text-sm"
          >
            <FiMail />
            Get in touch
          </a>
        </div>
      </header>

      <ChapterRail active={active} />

      {/* ───────── Hero ───────── */}
      <section className="relative px-6 pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="inline-flex items-center rounded-full borde px-1 py-1 text-xs font-medium uppercase tracking-[0.25em] text-amber-300 mb-6">
                  In development
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <h1 className="font-display text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02]">
                  <DecryptedText text="From a conversation" />
                  <br />
                  <span className="text-gradient">
                    <DecryptedText text="in Kakanj." speed={42} iterations={18} />
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="mt-8 text-slate-300 leading-relaxed text-lg">
                  A four role logistics platform that started with the simplest
                  possible idea: build something that's actually used. I drove
                  back to my hometown, talked to a working dispatcher and the
                  truck owners around him, and walked away with one problem to
                  solve, their communication is scattered across four apps and
                  nothing lives in one place.
                </p>
              </Reveal>

              <Reveal delay={0.22}>
                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
                  <Stat k="60+" v="features shipped" />
                  <Stat k="200+" v="commits" />
                  <Stat k="12" v="feature areas" />
                  <Stat k="4" v="roles" />
                </div>
              </Reveal>
            </div>

            <div className="hidden lg:block lg:col-span-5">
              <div className="relative h-[420px] w-full">
                <HeroScene />
              </div>
            </div>
          </div>

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

      {/* ═════════ Chapter 01 — The brief ═════════ */}
      <section id="ch1" className="relative px-6 py-32 border-t border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <ChapterNumeral num="01" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-4">
              Day zero
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-white font-bold tracking-tight">
              Build something real.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 text-slate-400 leading-relaxed">
              I didn't want another todo app or another portfolio clone. I
              wanted to ship something a person could actually open on a Monday
              morning and use. That meant skipping the wireframes and starting
              with a conversation instead, finding a domain I had access to,
              and a real problem someone was already losing time to.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-3 text-slate-500 italic text-sm">
              The brief I gave myself: one user, one pain point, one app.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
              {["Talk to someone real", "Solve one painful thing", "Ship to one company"].map(
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

      {/* ═════════ Chapter 02 — Kakanj ═════════ */}
      <section id="ch2" className="relative px-6 py-28 border-t border-white/5 overflow-hidden">
        <div className="absolute top-12 right-12 lg:right-24 pointer-events-none">
          <ChapterNumeral num="02" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5">
              <ChapterTitle kicker="Field research" title="A conversation in Kakanj." />
              <Reveal delay={0.1}>
                <p className="mt-6 text-slate-300 leading-relaxed">
                  Kakanj is my hometown, a small town in central Bosnia where
                  long-haul trucking is one of the louder economic verticals. I
                  drove home and asked a working dispatcher to sit with me for
                  an hour. Then I sat with two truck owners. None of them
                  needed a slide deck, they needed to stop losing time to
                  paperwork and phone tag.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <figure className="mt-8 border-l-2 border-mint-500/50 pl-5">
                  <blockquote className="text-slate-200 leading-relaxed font-display text-lg">
                    "Half my job is finding out where things are. The other
                    half is calling four different people to say the same
                    thing."
                  </blockquote>
                  <figcaption className="mt-3 text-xs uppercase tracking-widest text-slate-500 inline-flex items-center gap-2">
                    <FiMapPin className="text-mint-400" />
                    Working dispatcher · Kakanj, 2025
                  </figcaption>
                </figure>
              </Reveal>
              <Reveal delay={0.26}>
                <p className="mt-6 text-slate-500 text-sm italic">
                  That sentence is the entire architecture brief.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <KakanjPin />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ Chapter 03 — Four apps, one mess ═════════ */}
      <section id="ch3" className="relative px-6 py-28 border-t border-white/5 overflow-hidden">
        <div className="absolute top-12 left-12 pointer-events-none">
          <ChapterNumeral num="03" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <ChapterTitle kicker="Before" title="Four apps, one mess." />
              <Reveal delay={0.1}>
                <p className="mt-6 text-slate-300 leading-relaxed">
                  The shape of the chaos was always the same. A delivery
                  involves at least three humans: the dispatcher, the driver,
                  the client, and the conversation between them was spread
                  across SMS, WhatsApp, Viber, and the phone, with paper notes
                  filling the cracks.
                </p>
                <p className="mt-3 text-slate-300 leading-relaxed">
                  No single source of truth. No history per shipment. No way to
                  know, an hour later, what was actually agreed.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <ul className="mt-8 space-y-2.5 text-sm">
                  {[
                    "WhatsApp for quick updates",
                    "SMS when the driver had no data",
                    "Viber for the older clients",
                    "Phone calls for everything that mattered",
                    "Sticky notes for the rest",
                  ].map((it) => (
                    <li key={it} className="flex items-center gap-3 text-slate-400">
                      <span className="h-1 w-3 bg-amber-300/60" />
                      {it}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <ScatteredMessages />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ Chapter 04 — Four roles, one thread ═════════ */}
      <section id="ch4" className="relative px-6 py-28 border-t border-white/5 overflow-hidden">
        <Aurora />
        <div className="absolute -bottom-8 right-12 pointer-events-none">
          <ChapterNumeral num="04" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <Reveal>
              <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-mint-300 mb-4">
                After
              </div>
              <h2 className="font-display text-4xl md:text-6xl text-white font-bold tracking-tight leading-[1.02]">
                Four roles. <span className="text-gradient">One thread.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-slate-300 leading-relaxed text-lg">
                The whole platform collapses around one idea: every shipment
                opens a single thread that the dispatcher, the driver, and the
                client all talk inside. No app switching. No "Wait, did you send it on WhatsApp?" The admin sits behind it, owning the
                keys to the system.
              </p>
              <p className="mt-3 italic text-mint-300 text-xl">
                The thread is the product.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.14}>
            <RolesRow />
          </Reveal>

          <div className="mt-12 grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <Reveal delay={0.05}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <div className="flex items-center gap-2 text-mint-400 mb-3">
                    <FiMessageSquare />
                    <span className="text-xs uppercase tracking-[0.25em]">
                      What a thread is
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    One conversation per shipment, scoped tightly to that
                    delivery. The three operational roles join automatically the
                    moment the shipment is created; nobody else can see it. The
                    history sticks around for the whole lifecycle so the next
                    person walking into the project has the full context, not
                    just the last hour.
                  </p>
                  <ul className="mt-5 space-y-2 text-sm text-slate-400">
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-mint-400" />
                      Auto-includes the assigned dispatcher, driver, and client
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-mint-400" />
                      Real-time over SignalR
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-mint-400" />
                      Notifications for status changes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-mint-400" />
                      Survives shift changes. The next dispatcher inherits it
                    </li>
                  </ul>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={0.12}>
                <ThreadMock />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ Chapter 05 — The closed door ═════════ */}
      <section id="ch5" className="relative px-6 py-28 border-t border-white/5 overflow-hidden">
        <div className="absolute top-12 left-12 pointer-events-none">
          <ChapterNumeral num="05" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <ChapterTitle kicker="Locked by design" title="The closed door." />
            <Reveal delay={0.1}>
              <p className="mt-6 text-slate-300 leading-relaxed">
                This platform isn't a product you sign up for. It's a tool one
                company turns on and runs. Public registration would be a
                liability: random accounts, random clients, random drivers.
                Instead the admin owns onboarding, and clients never even need
                an account.
              </p>
              <p className="mt-3 text-slate-500 text-sm italic">
                Hover the left card to see the actual flow.
              </p>
            </Reveal>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <ClosedDoorFlip />
            <TrackingCodeCard />
          </div>

          <Reveal delay={0.18}>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2">
              {[
                "Invitation-only onboarding",
                "No public sign-up",
                "Per-shipment client tracking",
                "Access scoped by role",
              ].map((t) => (
                <span
                  key={t}
                  className="text-xs text-slate-500 border-b border-mint-400/50 pb-px"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═════════ Chapter 06 — Order → Shipment → Dispatch ═════════ */}
      <section id="ch6" className="relative px-6 py-32 border-t border-white/5 overflow-hidden">
        <div className="absolute top-12 right-12 pointer-events-none">
          <ChapterNumeral num="06" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl mb-14">
            <ChapterTitle kicker="Lifecycle" title="Order → Shipment → Dispatch." />
            <Reveal delay={0.1}>
              <p className="mt-6 text-slate-300 leading-relaxed text-lg">
                The decision I’m most proud of is keeping Orders, Shipments, and Dispatches as three separate entities instead of merging them into one large “Delivery” table.
                 At first, combining everything into a single table seemed like the simpler approach, but each of these entities represents a different part of the workflow, 
                 has its own status lifecycle, and is handled by different roles in the system. Separating them resulted in a cleaner architecture, clearer responsibilities,
                  and a solution that is easier to maintain and scale over time.
              </p>
              <p className="mt-3 italic text-mint-300 text-xl">
                Different lifecycles deserve different homes.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.14}>
            <LifecycleDiagram />
          </Reveal>

          <div className="mt-10 grid lg:grid-cols-3 gap-4">
            <Reveal delay={0.05}>
              <TiltCard max={8} lift={10} spotlight>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 h-full">
                  <div className="flex items-center gap-2 text-mint-400 mb-3">
                    <FiBox />
                    <span className="text-xs uppercase tracking-[0.25em]">Order</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    What the client wants. Items, priority, delivery details,
                    multi currency totals — running through its own
                    approval-to-completion lifecycle.
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    Owned by the <span className="text-slate-300">client</span>{" "}
                    · approved by the dispatcher.
                  </p>
                </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={0.1}>
              <TiltCard max={10} lift={14} spotlight glowBorder>
                <div className="rounded-2xl border border-mint-500/30 bg-mint-500/[0.04] p-6 h-full shadow-[0_30px_60px_-25px_rgba(61,210,165,0.4)]">
                  <div className="flex items-center gap-2 text-mint-400 mb-3">
                    <FiFileText />
                    <span className="text-xs uppercase tracking-[0.25em]">Shipment</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    How the order actually moves. Weight, volume, pickup
                    location, route, and the per-shipment thread that ties the
                    three operational roles together. This is where the
                    tracking code is issued.
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    Owned by the{" "}
                    <span className="text-slate-300">dispatcher</span> · opens
                    the live thread.
                  </p>
                </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={0.15}>
              <TiltCard max={8} lift={10} spotlight>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 h-full">
                  <div className="flex items-center gap-2 text-mint-400 mb-3">
                    <FiTruck />
                    <span className="text-xs uppercase tracking-[0.25em]">Dispatch</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Who actually does it. Truck + (optional) trailer + driver,
                    bolted to a shipment, running through its own lifecycle
                    that the driver drives from the cab.
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    Owned by the{" "}
                    <span className="text-slate-300">dispatcher</span> · executed
                    by the driver.
                  </p>
                </div>
              </TiltCard>
            </Reveal>
          </div>

          <Reveal delay={0.22}>
            <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-3 border-t border-white/5 pt-6">
              <Stat k="3" v="entities" />
              <Stat k="3" v="status lifecycles" />
              <Stat k="3" v="role owners" />
              <Stat k="1" v="thread per shipment" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═════════ Chapter 07 — The build (status mosaic) ═════════ */}
      <section id="ch7" className="relative px-6 py-28 border-t border-white/5 overflow-hidden">
        <div className="absolute -top-8 left-12 pointer-events-none">
          <ChapterNumeral num="07" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <ChapterTitle kicker="What's shipped" title="The build." />
            <Reveal delay={0.1}>
              <p className="mt-6 text-slate-300 leading-relaxed">
                A dozen feature areas span the platform, from the fleet and
                shipment core to dashboards and the live thread. The auth and
                identity surface is the most complete, because it's the part
                that breaks worst when it's wrong.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="mb-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { k: "60+", v: "Features shipped" },
                { k: groups.length, v: "Feature areas" },
                { k: "200+", v: "Commits" },
                { k: "4", v: "Roles" },
              ].map((s) => (
                <div key={s.v} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                  <div className="font-display text-3xl text-white font-bold tabular-nums">{s.k}</div>
                  <div className="text-xs uppercase tracking-widest text-slate-500 mt-2">{s.v}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {[0, 1, 2].map((col) => (
              <div key={col} className="flex flex-col gap-4">
                {groups
                  .filter((_, i) => i % 3 === col)
                  .map((g) => (
                    <GroupCard key={g.title} g={g} i={groups.indexOf(g)} />
                  ))}
              </div>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent p-6 md:p-8">
              <div className="grid md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-4">
                  <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-3">My role</div>
                  <h3 className="font-display text-2xl text-white font-bold tracking-tight">
                    Architect & <span className="text-gradient">primary contributor</span>
                  </h3>
                </div>
                <div className="md:col-span-8 text-slate-300 leading-relaxed space-y-3 text-[15px]">
                  <p>
                    I designed the Clean Architecture split (API · Application ·
                    Domain · Infrastructure · Shared · Tests), wired up MediatR
                    with FluentValidation behaviors, and authored every domain
                    entity except a handful of vehicle side migrations done
                    collaboratively. On the frontend I built the auth flows
                    end-to-end (login, 2FA, OAuth, invitation acceptance,
                    password reset), the settings page, the admin dashboard
                    shell, and the dispatcher shipment surface.
                  </p>
                  <p>
                    A large part of the recent work has been security
                    hardening across the whole auth surface — the unglamorous
                    work that decides whether you'd trust the system with a real
                    company's operations.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              <TiltCard max={8} lift={10} spotlight>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 h-full">
                  <div className="flex items-center gap-2 text-mint-400 mb-3">
                    <FiServer />
                    <span className="text-xs uppercase tracking-[0.25em]">Backend</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    .NET 8 + ASP.NET Core, Clean Architecture, CQRS via
                    MediatR, FluentValidation on every command and query,
                    SignalR ready for the live thread.
                  </p>
                </div>
              </TiltCard>
              <TiltCard max={8} lift={10} spotlight>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 h-full">
                  <div className="flex items-center gap-2 text-mint-400 mb-3">
                    <FiDatabase />
                    <span className="text-xs uppercase tracking-[0.25em]">Data</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    EF Core 8 Code-First on SQL Server 2022, with idempotent
                    seeders and a hand-modelled domain layer.
                  </p>
                </div>
              </TiltCard>
              <TiltCard max={8} lift={10} spotlight>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 h-full">
                  <div className="flex items-center gap-2 text-mint-400 mb-3">
                    <FiLayers />
                    <span className="text-xs uppercase tracking-[0.25em]">Frontend</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Angular 21, three-layer styling (Tailwind v4 · DaisyUI v5 ·
                    SCSS), signal-based local state, ngx-translate for BS / EN.
                  </p>
                </div>
              </TiltCard>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═════════ Chapter 08 — Live telematics (roadmap) ═════════ */}
      <section id="ch8" className="relative px-6 py-32 border-t border-white/5 overflow-hidden">
        <div className="absolute top-12 right-12 pointer-events-none">
          <ChapterNumeral num="08" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl mb-14">
            <ChapterTitle
              kicker="Roadmap · in progress"
              title="From self-reported to sensor-reported."
            />
            <Reveal delay={0.1}>
              <p className="mt-6 text-slate-300 leading-relaxed text-lg">
                Everything so far runs on what people type in: the driver moves a
                dispatch forward by hand, and the thread carries the rest. That's
                honest, but it's still someone tapping a phone. The next chapter puts
                a sensor underneath it — real GPS hardware on the truck, reporting
                where the load actually is.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-4 text-slate-300 leading-relaxed">
                The plan is to fit <span className="text-slate-100">Teltonika</span>{" "}
                telematics units — the FMB family of vehicle GPS trackers from the
                Lithuanian manufacturer — into the trucks and have them report straight
                into the platform. No third-party fleet dashboard sitting in the middle:
                the same app that owns the shipment owns its position.
              </p>
              <p className="mt-3 italic text-mint-300 text-xl">
                The thread says what was agreed. The tracker says where it is.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.14}>
            <TelematicsFlow />
          </Reveal>

          <div className="mt-10 grid lg:grid-cols-3 gap-4">
            <Reveal delay={0.05}>
              <TiltCard max={8} lift={10} spotlight>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 h-full">
                  <div className="flex items-center gap-2 text-mint-400 mb-3">
                    <FiCpu />
                    <span className="text-xs uppercase tracking-[0.25em]">The device</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    A Teltonika FMB tracker wired into the truck reads GPS position,
                    ignition, and movement — and, where the vehicle exposes it, CAN-bus
                    data like odometer and fuel. It's off-the-shelf hardware, configured
                    once to send to our server instead of a vendor cloud.
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    Standard hardware ·{" "}
                    <span className="text-slate-300">no custom firmware</span>
                  </p>
                </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={0.1}>
              <TiltCard max={10} lift={14} spotlight glowBorder>
                <div className="rounded-2xl border border-mint-500/30 bg-mint-500/[0.04] p-6 h-full shadow-[0_30px_60px_-25px_rgba(61,210,165,0.4)]">
                  <div className="flex items-center gap-2 text-mint-400 mb-3">
                    <FiRadio />
                    <span className="text-xs uppercase tracking-[0.25em]">The protocol</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Teltonika devices speak a compact binary protocol over TCP. A
                    dedicated listener accepts the connection, validates the device,
                    and ingests its position records straight into the platform.
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    A dedicated listener handles the stream — the REST API never touches a
                    raw socket.
                  </p>
                </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={0.15}>
              <TiltCard max={8} lift={10} spotlight>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 h-full">
                  <div className="flex items-center gap-2 text-mint-400 mb-3">
                    <FiMap />
                    <span className="text-xs uppercase tracking-[0.25em]">Into the thread</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Parsed positions land on the dispatcher's live map and attach to the
                    active dispatch. Arrival and ignition events can post into the same
                    per-shipment thread automatically — so "where are you?" becomes a
                    marker on a map instead of a phone call.
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    Built on the Leaflet map · feeds the existing live thread
                  </p>
                </div>
              </TiltCard>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2">
              {[
                "Teltonika FMB trackers",
                "Binary telemetry over TCP",
                "Dedicated listener service",
                "Live Leaflet map",
                "Auto thread events",
              ].map((t) => (
                <span
                  key={t}
                  className="text-xs text-slate-500 border-b border-mint-400/50 pb-px"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-8 max-w-3xl text-slate-500 text-sm italic">
              Described at the architecture level on purpose — this is the direction of
              the build, not a wiring guide for anyone else's fleet.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═════════ Chapter 09 — Epilogue ═════════ */}
      <section id="ch9" className="relative px-6 py-32 border-t border-white/5 overflow-hidden">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 pointer-events-none">
          <ChapterNumeral num="09" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-3">
                Epilogue
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight">
                What it taught me.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 italic text-mint-300 text-2xl">
                Three things stayed with me.
              </p>
            </Reveal>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {[
              {
                h: "Talk to the user before you write the file.",
                d: "Every interesting constraint in this app came from someone in Kakanj describing a Tuesday afternoon, not from a spec. The per shipment thread, the tracking code, the closed door registration, none of those were in my head before that conversation.",
              },
              {
                h: "Some splits look like overkill until they aren't.",
                d: "Orders, Shipments, and Dispatches being modeled as three separate entities sounded unnecessary at first. But once their lifecycles started diverging, with states like pending, en route, and completed, keeping them separate turned every status query into a simple one liner instead of a tangled maze of conditions.",
              },
              {
                h: "Auth is the part that gets dressed up last and matters most.",
                d: "Security hardening across the auth surface does not ship visible features. It is, however, the difference between software you would trust to run a real company’s logistics and software you would not.",
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
                      <div className="text-sm text-slate-400 mt-2 leading-relaxed">
                        {b.d}
                      </div>
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
                Happy to demo the app, walk through the architecture, or talk
                about the trade offs — CQRS, the entity split, the auth
                hardening, or the per shipment thread design.
              </p>
              <div className="mt-8 flex flex-wrap justify-center items-center gap-x-10 gap-y-5">
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
