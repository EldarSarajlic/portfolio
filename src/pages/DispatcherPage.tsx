import { useEffect, useRef, useState } from "react";
import { TransitionLink as Link } from "../components/PageTransition";
import {
  motion,
  AnimatePresence,
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
  FiGithub,
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
  FiSend,
  FiFileText,
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
  { id: "ch1", num: "01", kicker: "Day zero", title: "The brief" },
  { id: "ch2", num: "02", kicker: "Field research", title: "Field research" },
  { id: "ch3", num: "03", kicker: "Before", title: "Four apps, one mess" },
  { id: "ch4", num: "04", kicker: "After", title: "Four roles, one thread" },
  { id: "ch5", num: "05", kicker: "Locked by design", title: "The closed door" },
  { id: "ch6", num: "06", kicker: "Lifecycle", title: "Order → Shipment → Dispatch" },
  { id: "ch7", num: "07", kicker: "Status", title: "The build" },
  { id: "ch8", num: "08", kicker: "Epilogue", title: "What it taught me" },
];

/* ───────────────────────── Feature breakdown data ───────────────────────── */

type Feature = { title: string; detail?: string };
type FeatureGroup = { title: string; subtitle?: string; done: Feature[] };

const groups: FeatureGroup[] = [
  {
    title: "Authentication & Identity",
    subtitle: "Full auth surface — JWT in httpOnly cookies, device fingerprinting, 2FA, OAuth, invitations, rate limiting.",
    done: [
      { title: "Email + password login" },
      { title: "Logout (server-side cookie clear)" },
      { title: "Refresh-token rotation", detail: "httpOnly cookies, device fingerprint validated on every refresh" },
      { title: "Invitation-based registration", detail: "Admin emails a hashed token (7-day expiry); single-use, user sets own password" },
      { title: "Forgot / reset password", detail: "Tokens never exposed in URL" },
      { title: "Two-factor authentication (email codes)", detail: "Enable / disable / verify; password required to disable" },
      { title: "Google OAuth login", detail: "Tokens exchanged server-side, never in redirect URL" },
      { title: "Email-change flow with confirmation token" },
      { title: "Rate limiting on login / refresh / 2FA / forgot-password" },
      { title: "Session restoration on page load", detail: "GET /api/auth/me reads cookies server-side" },
      { title: "Role-based route guards (Admin · Dispatcher · Client · Driver)" },
    ],
  },
  {
    title: "User Management",
    subtitle: "User CRUD with photos, email change, and self-service profile editing.",
    done: [
      { title: "List users (paginated)" },
      { title: "Get user by ID" },
      { title: "Create user (via admin invitation flow)" },
      { title: "Update user (admin)" },
      { title: "Update own profile (UpdateMe)" },
      { title: "Delete user" },
      { title: "Upload profile photo (Cloudinary, drag & drop)" },
      { title: "Request / confirm email change" },
      { title: "Roles enum: Client · Driver · Dispatcher · Admin" },
    ],
  },
  {
    title: "Trucks",
    subtitle: "Full CRUD for the truck fleet with an enable/disable lifecycle.",
    done: [
      { title: "Create / Read / Update / Delete trucks" },
      { title: "Enable / Disable (separate commands)" },
      { title: "Get truck by ID" },
      { title: "List trucks (paginated)" },
      { title: "Truck form modal (admin UI)" },
    ],
  },
  {
    title: "Trailers",
    subtitle: "Full CRUD for trailers with a status change command.",
    done: [
      { title: "Create / Read / Update / Delete trailers" },
      { title: "Change trailer status" },
      { title: "Get trailer by ID" },
      { title: "List trailers (paginated)" },
      { title: "Trailer form modal (admin UI)" },
    ],
  },
  {
    title: "Vehicle Statuses",
    subtitle: "Reference data CRUD for the status taxonomy shared by trucks and trailers.",
    done: [
      { title: "Create / Read / Update / Delete vehicle statuses" },
      { title: "Get status by ID" },
      { title: "List statuses" },
      { title: "Table sorting by column (alphabetical)" },
    ],
  },
  {
    title: "Inventory",
    subtitle: "Product catalog managed by admins, stocked via SKU + quantity.",
    done: [
      { title: "Create / Update / Delete / List inventory items" },
      { title: "Stock quantity field (migration 20260428)" },
      { title: "Inventory photo FK via Cloudinary (migration 20260421)" },
      { title: "Admin inventory page (table + actions)" },
    ],
  },
  {
    title: "Dashboard & Analytics",
    subtitle: "Admin overview metrics and order analytics wired to live backend queries.",
    done: [
      { title: "Admin dashboard overview query + UI" },
      { title: "Order stats — summary, charts, reports" },
      { title: "GetOrdersDashboardSummary + GetOrdersDashboardCharts queries" },
      { title: "Chart.js integration" },
    ],
  },
  {
    title: "Shipments & Routes",
    subtitle: "Shipment creation, listing, and domain models for the logistics thread.",
    done: [
      { title: "ShipmentEntity + RouteEntity domain models" },
      { title: "Create / List / GetById shipment handlers" },
      { title: "Shipment status field + weight / volume / pickup location" },
      { title: "ShipmentController wired to Application layer" },
    ],
  },
  {
    title: "Dispatches",
    subtitle: "Domain shape for assigning a truck, trailer, and driver to a shipment.",
    done: [
      { title: "DispatchEntity — links Shipment + Truck + Driver + optional Trailer" },
      { title: "Dispatch migration (20251112)" },
    ],
  },
  {
    title: "Locations",
    subtitle: "Reference data for countries and cities used across forms.",
    done: [
      { title: "GetCountries query + CountryEntity" },
      { title: "GetCitiesByCountry query + CityEntity" },
      { title: "LocationController + ConnectedUserWithCity migration" },
    ],
  },
  {
    title: "Real-time & Messaging",
    subtitle: "Infrastructure in place for the per-shipment live thread.",
    done: [
      { title: "MessageEntity + Messages migration" },
      { title: "NotificationEntity + Notifications migration" },
      { title: "SignalR added to the .NET 8 stack" },
    ],
  },
  {
    title: "Service Companies & Maintenance",
    subtitle: "Domain models for tracking truck maintenance and service providers.",
    done: [
      { title: "ServiceCompanyEntity + migration" },
      { title: "TruckServiceAssignmentEntity + migration" },
    ],
  },
  {
    title: "Cross-cutting (i18n, settings, infra)",
    subtitle: "Platform-level concerns: localization, theming, validation, state shape.",
    done: [
      { title: "ngx-translate — Bosnian + English" },
      { title: "Settings page — profile, photo upload, email change, 2FA toggle" },
      { title: "Theme toggle (dark / light)" },
      { title: "Language toggle (BS / EN)" },
      { title: "HTTP interceptors — auth, error logging, loading bar" },
      { title: "FluentValidation across every command and query" },
      { title: "Three-layer styling: Tailwind v4 + DaisyUI v5 + SCSS" },
      { title: "Signal-based state for local components" },
      { title: "Base classes for list / form / paged-list components" },
      { title: "Idempotent seeders with rolling relative dates" },
    ],
  },
];

/* ───────────────────────── Progress mosaic card (Ch 07) ───────────────────────── */

function GroupCard({ g, i }: { g: FeatureGroup; i: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Reveal delay={i * 0.03}>
      <motion.article
        layout
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent p-6 flex flex-col"
      >
        <header>
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <h3 className="font-display text-lg text-white font-semibold tracking-tight leading-snug">
              {g.title}
            </h3>
            <span className="inline-flex items-center gap-1 text-mint-400 text-[10px] uppercase tracking-widest shrink-0">
              <FiCheckCircle className="text-[10px]" />
              {g.done.length} shipped
            </span>
          </div>
          {g.subtitle && (
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">{g.subtitle}</p>
          )}
        </header>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-4 self-start inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-slate-400 hover:text-mint-300 transition-colors"
        >
          {open ? "Hide" : "See details"}
          <span className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden>▾</span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="text-mint-400 text-[10px] uppercase tracking-[0.25em] mb-2">Implemented</div>
                <ul className="space-y-2 text-[13px] leading-relaxed">
                  {g.done.map((f) => (
                    <li key={f.title} className="flex items-start gap-2">
                      <FiCheckCircle className="shrink-0 mt-0.5 text-mint-400 text-[11px]" />
                      <div>
                        <span className="text-slate-300">{f.title}</span>
                        {f.detail && (
                          <span className="block text-[11px] text-slate-500 mt-0.5 leading-relaxed">{f.detail}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
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

/* ───────────────────────── Tech marquee ───────────────────────── */

const techRail = [
  ".NET 8 · ASP.NET Core",
  "Clean Architecture",
  "CQRS · MediatR",
  "EF Core 8 Code-First",
  "SQL Server 2022",
  "FluentValidation",
  "SignalR",
  "JWT + Refresh (httpOnly)",
  "Device fingerprint",
  "Google OAuth",
  "Angular 21",
  "Angular Signals",
  "Tailwind v4 · DaisyUI v5",
  "Chart.js · Leaflet",
  "ngx-translate (BS · EN)",
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

/* ───────────────────────── Kakanj pin (Ch 02) ───────────────────────── */

function KakanjPin() {
  const reduce = useReducedMotion();
  return (
    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 md:p-10 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="relative flex items-center justify-between mb-5">
        <span className="text-mint-400 text-xs uppercase tracking-[0.3em]">
          The conversation
        </span>
        <span className="text-[10px] font-mono text-slate-500 tracking-widest">
          44.1361° N · 18.1186° E
        </span>
      </div>

      <div className="relative h-56 md:h-64">
        <svg viewBox="0 0 600 240" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="kakanjGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#5ee3b3" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#5ee3b3" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="kakanjLine" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#3dd2a5" stopOpacity="0" />
              <stop offset="50%" stopColor="#3dd2a5" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3dd2a5" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Stylized country outline (loose Bosnia silhouette) */}
          <path
            d="M 120 80 Q 160 60 220 70 Q 280 60 340 90 Q 400 100 430 130 Q 460 160 440 180 Q 400 210 340 200 Q 280 200 220 195 Q 170 195 140 170 Q 100 150 110 110 Z"
            fill="rgba(255,255,255,0.02)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />

          {/* East-west reference line */}
          <line x1="60" y1="135" x2="540" y2="135" stroke="url(#kakanjLine)" strokeWidth="1" />

          {/* Pulse ring */}
          {!reduce && (
            <>
              <circle cx="300" cy="135" r="20" fill="url(#kakanjGlow)">
                <animate attributeName="r" values="14;60;14" dur="3s" repeatCount="indefinite" />
                <animate
                  attributeName="opacity"
                  values="0.7;0;0.7"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="300" cy="135" r="20" fill="url(#kakanjGlow)">
                <animate
                  attributeName="r"
                  values="14;60;14"
                  dur="3s"
                  begin="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.7;0;0.7"
                  dur="3s"
                  begin="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </>
          )}

          {/* Pin */}
          <g transform="translate(300 135)">
            <circle r="5" fill="#5ee3b3" />
            <circle r="11" fill="none" stroke="#5ee3b3" strokeWidth="1.5" opacity="0.6" />
          </g>

          <text
            x="320"
            y="138"
            fill="#e2e8f0"
            fontSize="14"
            fontFamily="Inter"
            fontWeight="600"
          >
            Kakanj
          </text>
          <text
            x="320"
            y="156"
            fill="#64748b"
            fontSize="10"
            fontFamily="ui-monospace"
            letterSpacing="2"
          >
            HOMETOWN · 2025
          </text>

          {/* Other dots — fellow cities for scale */}
          {[
            { x: 200, y: 120, label: "Sarajevo" },
            { x: 380, y: 95, label: "Tuzla" },
            { x: 145, y: 170, label: "Mostar" },
          ].map((c) => (
            <g key={c.label}>
              <circle cx={c.x} cy={c.y} r="2" fill="#64748b" />
              <text
                x={c.x + 6}
                y={c.y + 3}
                fill="#475569"
                fontSize="9"
                fontFamily="Inter"
              >
                {c.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="relative mt-2 text-xs text-slate-500 italic text-center">
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
  const reduce = useReducedMotion();
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
          {!reduce && (
            <span className="absolute -inset-3 -z-10 rounded-3xl bg-amber-400/10 blur-2xl animate-pulse" />
          )}
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
    job: "Places the order, tracks it with a single-use code.",
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
  const reduce = useReducedMotion();
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden shadow-[0_40px_80px_-25px_rgba(0,0,0,0.7)]">
      {/* Thread header */}
      <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            {!reduce && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-75" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-400" />
          </span>
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
        <span>Hover to see how the keys actually move.</span>
        <span className="not-italic font-mono text-slate-600">↻</span>
      </div>
    </div>
  );

  const steps = [
    {
      icon: <FiMail />,
      h: "Admin emails an invitation",
      d: "Token is hashed in the database and single use; the link itself expires in 7 days.",
      tone: "mint" as const,
    },
    {
      icon: <FiShield />,
      h: "User accepts on a one-off page",
      d: "Sets their own password. Token can't be reused or screenshot reused.",
      tone: "mint" as const,
    },
    {
      icon: <FiHash />,
      h: "Clients get a tracking code instead",
      d: "Per shipment, single use, expires when the shipment completes. No account, no friction.",
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
            shipment. The admin / dispatcher hands them a single-use code that
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
            <text x="140" y="126" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontFamily="Inter">
              What the client wants
            </text>
            <text x="140" y="148" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter">
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
            <text x="140" y="192" textAnchor="middle" fill="#5ee3b3" fontSize="10" fontFamily="Inter">
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
            <text x="430" y="108" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontFamily="Inter">
              How it actually moves
            </text>
            <text x="430" y="130" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter">
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
            <text x="430" y="178" textAnchor="middle" fill="#5ee3b3" fontSize="10" fontFamily="Inter">
              opens the per shipment thread
            </text>
            <text x="430" y="200" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="Inter" fontStyle="italic">
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
            <text x="740" y="126" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontFamily="Inter">
              Who actually does it
            </text>
            <text x="740" y="148" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter">
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
            <text x="740" y="192" textAnchor="middle" fill="#5ee3b3" fontSize="10" fontFamily="Inter">
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
            fontFamily="Inter"
            fontStyle="italic"
          >
            three entities · three statuses · three owners — that's the point, not the cost
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

  const doneTotal = groups.reduce((n, g) => n + g.done.length, 0);

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
            href="https://github.com/EldarSarajlic/Truck_Dispatcher"
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
                  <Stat k={doneTotal} v="features shipped" />
                  <Stat k="200+" v="commits" />
                  <Stat k="25" v="EF Core migrations" />
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
              <p className="mt-3 font-signature text-mint-300 text-xl">
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
                      Survives shift changes — the next dispatcher inherits it
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
                "Hashed token · 7-day expiry",
                "Single-use accept",
                "Client tracking via per-shipment code",
                "Token consumed on first open",
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
              <p className="mt-3 font-signature text-mint-300 text-xl">
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
                    multi currency totals. Lives or dies on{" "}
                    <span className="font-mono text-mint-300">Pending →
                    Approved → InProgress → Completed / Cancelled</span>.
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
                    bolted to a shipment.{" "}
                    <span className="font-mono text-mint-300">Scheduled →
                    InProgress → Completed</span>. The driver runs through this
                    lifecycle from the cab.
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
                Thirteen feature areas, drawn directly from the repo: entities,
                handlers, controllers, migrations, frontend modules. The auth
                and identity surface is the most complete because it's the part
                that breaks worst when it's wrong.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="mb-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { k: doneTotal, v: "Features shipped" },
                { k: groups.length, v: "Feature areas" },
                { k: "25", v: "EF Core migrations" },
                { k: "22", v: "Domain entities" },
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

          <Reveal delay={0.18}>
            <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <span className="text-mint-400 text-xs uppercase tracking-[0.3em]"><span className="underline">Current</span> Database schema</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500">22 entities · EF Core 8</span>
              </div>
              <div className="p-4">
                <a href="/schema_dark_mode.svg" target="_blank" rel="noreferrer" title="Open full size">
                  <img
                    src="/schema_dark_mode.svg"
                    alt="Truck Dispatcher database schema"
                    className="w-full rounded-xl hover:opacity-100 transition-opacity cursor-zoom-in"
                  />
                </a>
              </div>
            </div>
          </Reveal>

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
                    entity except a handful of vehicle-side migrations done
                    collaboratively. On the frontend I built the auth flows
                    end-to-end (login, 2FA, OAuth, invitation acceptance,
                    password reset), the settings page, the admin dashboard
                    shell, and the dispatcher shipment surface.
                  </p>
                  <p>
                    The work in 2026 has been heavily security-focused —
                    migrating tokens from request bodies into httpOnly cookies,
                    binding refresh tokens to a device fingerprint, hashing
                    invitation tokens, and adding rate limiting to every
                    auth-adjacent endpoint.
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
                    EF Core 8 Code-First on SQL Server 2022. 25 migrations,
                    rolling-date idempotent seeders, every domain entity hand-rolled.
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

      {/* ═════════ Chapter 08 — Epilogue ═════════ */}
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
                What it taught me.
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
                h: "Talk to the user before you write the file.",
                d: "Every interesting constraint in this app came from someone in Kakanj describing a Tuesday afternoon, not from a spec. The per shipment thread, the tracking code, the closed door registration, none of those were in my head before that conversation.",
              },
              {
                h: "Some splits look like overkill until they aren't.",
                d: "Orders, Shipments, and Dispatches being modeled as three separate entities sounded unnecessary at first. But once their lifecycles started diverging, with states like pending, en route, and completed, keeping them separate turned every status query into a simple one liner instead of a tangled maze of conditions.",
              },
              {
                h: "Auth is the part that gets dressed up last and matters most.",
                d: "Migrating tokens out of request bodies, fingerprinting refresh tokens, hashing invitation tokens, and rate limiting every auth adjacent endpoint do not ship visible features. They are, however, the difference between software you would trust to run a real company’s logistics and software you would not.",
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
                about the trade offs, CQRS, the Order ↔ Shipment split, the
                cookie based auth migration, or the per-shipment thread design.
              </p>
              <div className="mt-8 flex flex-wrap justify-center items-center gap-x-10 gap-y-5">
                <a
                  href="https://github.com/EldarSarajlic/Truck_Dispatcher"
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
