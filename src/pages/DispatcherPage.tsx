import { useEffect } from "react";
import { FiArrowLeft, FiCheckCircle, FiClock, FiGithub } from "react-icons/fi";
import Reveal from "../components/Reveal";
import { TransitionLink } from "../components/PageTransition";

type Status = "done" | "todo" | "partial";

type Feature = {
  title: string;
  status: Status;
  detail?: string;
};

type FeatureGroup = {
  title: string;
  subtitle?: string;
  done: Feature[];
  todo: Feature[];
};

const groups: FeatureGroup[] = [
  {
    title: "Authentication & Identity",
    subtitle:
      "Full auth surface — JWT in httpOnly cookies, device fingerprinting, 2FA, OAuth, invitations, rate limiting.",
    done: [
      { title: "Email + password login", status: "done" },
      { title: "Logout (server-side cookie clear)", status: "done" },
      {
        title: "Refresh-token rotation",
        status: "done",
        detail: "httpOnly cookies, device fingerprint validated on every refresh",
      },
      {
        title: "Invitation-based registration",
        status: "done",
        detail:
          "Admin emails a hashed token (7-day expiry); user sets own password on acceptance — token is single-use",
      },
      { title: "Forgot / reset password", status: "done", detail: "Tokens never exposed in URL" },
      {
        title: "Two-factor authentication (email codes)",
        status: "done",
        detail: "Enable / disable / verify; password required to disable",
      },
      { title: "Google OAuth login", status: "done", detail: "Tokens exchanged server-side, never in redirect URL" },
      { title: "Email-change flow with confirmation token", status: "done" },
      { title: "Rate limiting on login / refresh / 2FA / forgot-password", status: "done" },
      { title: "Session restoration on page load", status: "done", detail: "GET /api/auth/me reads cookies server-side" },
      { title: "Role-based route guards (Admin · Dispatcher · Client)", status: "done" },
    ],
    todo: [
      { title: "Lockout policy surfaced in UI (AccessFailedCount / LockoutEnd exist on the entity but no UI feedback)", status: "todo" },
      { title: "Refresh-token revocation list view for admins", status: "todo" },
      { title: "Audit log of authentication events", status: "todo" },
    ],
  },
  {
    title: "User Management",
    subtitle: "User CRUD with photos, email change, and self-service profile editing.",
    done: [
      { title: "List users (paginated)", status: "done" },
      { title: "Get user by ID", status: "done" },
      { title: "Create user (via admin invitation flow)", status: "done" },
      { title: "Update user (admin)", status: "done" },
      { title: "Update own profile (UpdateMe)", status: "done" },
      { title: "Delete user", status: "done" },
      { title: "Upload profile photo (drag & drop)", status: "done" },
      { title: "Request / confirm email change", status: "done" },
      { title: "Roles enum: Client · Driver · Dispatcher · Admin", status: "done" },
    ],
    todo: [
      { title: "User roles seeder (TODO comment in StaticDataSeeder)", status: "todo" },
      { title: "Bulk user import / CSV onboarding", status: "todo" },
    ],
  },
  {
    title: "Vehicles (Trucks · Trailers · Status)",
    subtitle: "Full CRUD for the fleet plus a status taxonomy and enable/disable lifecycle.",
    done: [
      { title: "Trucks — Create / Read / Update / Delete", status: "done" },
      { title: "Trucks — Enable / Disable (separate commands)", status: "done" },
      { title: "Trailers — Create / Read / Update / Delete", status: "done" },
      { title: "Trailers — Change status", status: "done" },
      { title: "Vehicle Status — Create / Read / Update / Delete", status: "done" },
      { title: "Form modals for trucks & trailers (admin UI)", status: "done" },
      { title: "Table sorting by column (alphabetical)", status: "done" },
    ],
    todo: [
      { title: "Truck maintenance scheduling UI (entities ServiceCompany & TruckServiceAssignment exist, no handlers)", status: "todo" },
      { title: "Vehicle utilization dashboard", status: "todo" },
      { title: "Document attachments (registration, insurance)", status: "todo" },
    ],
  },
  {
    title: "Inventory",
    subtitle: "Product catalog managed by admins, stocked via SKU + quantity.",
    done: [
      { title: "Create / Update / Delete / List inventory items", status: "done" },
      { title: "Stock quantity field (migration 20260428)", status: "done" },
      { title: "Inventory photo FK (migration 20260421)", status: "done" },
      { title: "Admin inventory page (table + actions)", status: "done" },
    ],
    todo: [
      { title: "Low-stock alerts / thresholds", status: "todo" },
      { title: "Stock-movement history (audit trail of in/out)", status: "todo" },
      { title: "Client-facing catalog with filtering / search", status: "todo" },
    ],
  },
  {
    title: "Orders",
    subtitle: "Entities and read-side dashboard exist; write-side ordering flow is the next major build.",
    done: [
      { title: "OrderEntity + OrderItemEntity domain models", status: "done" },
      { title: "Inventory + order migration (20251110)", status: "done" },
      { title: "Order dashboard summary query", status: "done" },
      { title: "Order dashboard charts query", status: "done" },
      { title: "Order reports query", status: "done" },
    ],
    todo: [
      { title: "OrderController + Create / Update / Cancel command handlers", status: "todo" },
      { title: "Client-side order placement UI (client module is currently empty)", status: "todo" },
      { title: "Dispatcher approval / rejection flow with status transitions (Pending → Approved → InProgress → Completed / Cancelled)", status: "todo" },
      { title: "Priority-based queueing (priority field exists on the entity)", status: "todo" },
      { title: "Multi-currency totals (BAM · EUR · USD fields exist)", status: "todo" },
    ],
  },
  {
    title: "Shipments & Routes",
    subtitle: "Shipments are created and listable; the route side is partial.",
    done: [
      { title: "ShipmentEntity + RouteEntity domain models", status: "done" },
      { title: "Create / List / GetById shipment handlers", status: "done" },
      { title: "Shipments API client + table wired to backend (frontend)", status: "done" },
      { title: "Shipment status field + weight / volume / pickup location", status: "done" },
    ],
    todo: [
      { title: "Update / Cancel / Complete shipment commands", status: "todo" },
      { title: "RouteController + create/update/list handlers (only entity exists)", status: "todo" },
      { title: "Route-on-map visualization with Leaflet", status: "todo" },
      { title: "Shipment ↔ Order linking UX (entity link exists, no UI flow yet)", status: "todo" },
      { title: "Replace placeholder delete with real API delete", status: "todo", detail: "TODO comment in dispatcher-shipment.component.ts" },
    ],
  },
  {
    title: "Dispatches (assigning resources)",
    subtitle: "Entity + migration are in place. The whole assignment flow is the next critical milestone.",
    done: [
      { title: "DispatchEntity domain model — links Shipment + Truck + Driver + (optional) Trailer", status: "done" },
      { title: "Dispatch migration (20251112)", status: "done" },
    ],
    todo: [
      { title: "DispatchController + Create / Update / Cancel / Complete commands", status: "todo" },
      { title: "Dispatch board UI for assigning a truck/driver/trailer to a shipment", status: "todo" },
      { title: "Conflict detection (driver shift overlap, truck availability)", status: "todo" },
      { title: "Status lifecycle: Scheduled → InProgress → Completed / Cancelled", status: "todo" },
    ],
  },
  {
    title: "Driver experience",
    subtitle: "The role exists (UserRole.Driver) but the front-end module hasn't been built yet.",
    done: [
      { title: "Driver role on UserEntity enum", status: "done" },
      { title: "DispatchEntity has DriverId FK ready for assignment", status: "done" },
    ],
    todo: [
      { title: "Driver feature module (no folder yet under modules/)", status: "todo" },
      { title: "My Assignments page — list of active dispatches", status: "todo" },
      { title: "Status update flow (Pickup → En route → Delivered)", status: "todo" },
      { title: "Mobile-friendly layout pass for in-cab use", status: "todo" },
      { title: "Driver ↔ dispatcher chat surface", status: "todo" },
    ],
  },
  {
    title: "Client experience",
    subtitle: "Module is scaffolded but the routing array is empty — nothing renders for clients yet.",
    done: [
      { title: "Client routing module scaffolded", status: "done" },
      { title: "Client role on UserEntity enum + guard hooked up in app routes", status: "done" },
    ],
    todo: [
      { title: "Catalog browsing page (Inventory consumed by clients)", status: "todo" },
      { title: "Place-order form with delivery details + priority", status: "todo" },
      { title: "My Orders dashboard with status timeline", status: "todo" },
      { title: "Order tracking with live shipment status", status: "todo" },
    ],
  },
  {
    title: "Dispatcher experience",
    subtitle: "Dashboard shell is in place; the operational surface still needs the order-review and live-tracking pages.",
    done: [
      { title: "Dispatcher layout + dashboard route", status: "done" },
      { title: "Shipment management page (list, edit)", status: "done" },
    ],
    todo: [
      { title: "Order review queue (approve / reject incoming client orders)", status: "todo" },
      { title: "Dispatch board (assign truck + driver + trailer)", status: "todo" },
      { title: "Live tracking map with active deliveries", status: "todo" },
      { title: "Driver chat / messaging surface", status: "todo" },
    ],
  },
  {
    title: "Admin dashboard & analytics",
    subtitle: "Overview + order analytics shipped; deeper KPI views remain.",
    done: [
      { title: "Admin dashboard overview query + UI", status: "done" },
      { title: "Order stats — summary, charts, reports", status: "done" },
      { title: "Chart.js integration", status: "done" },
    ],
    todo: [
      { title: "Fleet utilization KPIs (active trucks vs idle)", status: "todo" },
      { title: "Driver performance metrics", status: "todo" },
      { title: "Revenue per route / per currency breakdown", status: "todo" },
      { title: "Export to PDF / Excel", status: "todo" },
    ],
  },
  {
    title: "Real-time & messaging",
    subtitle: "Migrations and entities are in place; SignalR hubs and chat UI are still to come.",
    done: [
      { title: "MessageEntity + Messages migration", status: "done" },
      { title: "NotificationEntity + Notifications migration", status: "done" },
      { title: "SignalR added to the .NET 8 stack", status: "done" },
    ],
    todo: [
      { title: "SignalR hub for live dispatch updates", status: "todo" },
      { title: "In-app chat (1:1 driver ↔ dispatcher) and chat UI", status: "todo" },
      { title: "Push / toast notifications for new orders, dispatches, status changes", status: "todo" },
      { title: "Read-receipts and unread counts", status: "todo" },
    ],
  },
  {
    title: "Service companies & maintenance",
    subtitle: "Entities + migrations exist; the maintenance workflow is unbuilt.",
    done: [
      { title: "ServiceCompanyEntity + migration", status: "done" },
      { title: "TruckServiceAssignmentEntity + migration", status: "done" },
    ],
    todo: [
      { title: "ServiceCompany CRUD handlers + controller", status: "todo" },
      { title: "TruckServiceAssignment workflow (schedule, complete, cost log)", status: "todo" },
      { title: "Service-history page per truck", status: "todo" },
    ],
  },
  {
    title: "Cross-cutting (i18n, settings, infra)",
    subtitle: "Most of the platform-level concerns are shipped.",
    done: [
      { title: "ngx-translate — Bosnian + English", status: "done" },
      { title: "Settings page — profile, photo upload, email change, 2FA toggle", status: "done" },
      { title: "Theme toggle (dark / light)", status: "done" },
      { title: "Language toggle (BS / EN)", status: "done" },
      { title: "HTTP interceptors — auth, error logging, loading bar", status: "done" },
      { title: "FluentValidation across every command and query", status: "done" },
      { title: "Three-layer styling: Tailwind v4 + DaisyUI v5 + SCSS", status: "done" },
      { title: "Signal-based state for local components", status: "done" },
      { title: "Base classes for list / form / paged-list components", status: "done" },
      { title: "Idempotent seeders with rolling relative dates", status: "done" },
    ],
    todo: [
      { title: "Unit + integration test coverage (Dispatcher.Tests project exists, sparse coverage)", status: "todo" },
      { title: "Playwright E2E suite for the dispatcher app", status: "todo" },
      { title: "Production deployment pipeline (currently local dev only)", status: "todo" },
      { title: "Application logging & monitoring (Serilog + Seq / similar)", status: "todo" },
      { title: "Background jobs (e.g. cleanup of expired invitation tokens) via Hangfire / Quartz", status: "todo" },
    ],
  },
];

function FeatureLine({ f }: { f: Feature }) {
  const isDone = f.status === "done";
  return (
    <li className="flex items-start gap-3">
      {isDone ? (
        <FiCheckCircle className="shrink-0 mt-0.5 text-mint-400" />
      ) : (
        <FiClock className="shrink-0 mt-0.5 text-amber-300" />
      )}
      <div>
        <span className={isDone ? "text-slate-200" : "text-slate-300"}>
          {f.title}
        </span>
        {f.detail && (
          <span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">
            {f.detail}
          </span>
        )}
      </div>
    </li>
  );
}

export default function DispatcherPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const doneTotal = groups.reduce((n, g) => n + g.done.length, 0);
  const todoTotal = groups.reduce((n, g) => n + g.todo.length, 0);
  const pct = Math.round((doneTotal / (doneTotal + todoTotal)) * 100);

  return (
    <div className="min-h-screen bg-ink-950 text-slate-300">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink-950/70 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <TransitionLink
            to="/#projects"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-mint-400 transition-colors"
          >
            <FiArrowLeft />
            <span className="text-sm">Back to portfolio</span>
          </TransitionLink>
          <a
            href="https://github.com/EldarSarajlic"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-mint-400 transition-colors text-sm"
          >
            <FiGithub />
            GitHub
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="relative max-w-6xl mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-amber-300 mb-6">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-300" />
              </span>
              In development · ~{pct}% feature coverage
            </div>
            <h1 className="font-display text-white text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Truck Dispatcher
            </h1>
            <p className="mt-4 text-xl text-mint-400 font-display">
              Logistics Management Platform
            </p>
            <p className="mt-6 text-slate-300 leading-relaxed max-w-3xl text-lg">
              A four-role logistics platform for trucking companies — replacing
              paper workflows with a digital pipeline from{" "}
              <span className="text-white">client ordering</span> through{" "}
              <span className="text-white">dispatch</span> to{" "}
              <span className="text-white">delivery</span>. Built around real
              interviews with active dispatchers; designed with deliberate
              separation between Orders and Shipments because they have
              different lifecycles and different role owners.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { k: doneTotal, v: "Features implemented" },
                { k: todoTotal, v: "Features remaining" },
                { k: "200+", v: "Commits to date" },
                { k: "25", v: "EF Core migrations" },
              ].map((s) => (
                <div
                  key={s.v}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-5"
                >
                  <div className="font-display text-3xl text-white font-bold">
                    {s.k}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-slate-500 mt-2">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap gap-2">
              {[
                ".NET 8 · ASP.NET Core",
                "Angular 21",
                "SQL Server 2022",
                "EF Core 8 (Code-First)",
                "MediatR (CQRS)",
                "FluentValidation",
                "SignalR",
                "JWT + Refresh (httpOnly cookies)",
                "Google OAuth",
                "Tailwind v4 · DaisyUI v5",
                "Leaflet · Chart.js",
                "ngx-translate (BS · EN)",
                "GitHub Actions (planned)",
              ].map((s) => (
                <span
                  key={s}
                  className="text-xs rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-slate-400"
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* My role */}
      <section className="relative px-6 py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10">
          <Reveal className="lg:col-span-4">
            <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-3">
              My role
            </div>
            <h2 className="font-display text-3xl text-white font-bold tracking-tight">
              Architect &{" "}
              <span className="text-gradient">primary contributor</span>
            </h2>
          </Reveal>
          <div className="lg:col-span-8 text-slate-300 leading-relaxed space-y-4">
            <p>
              I designed the Clean Architecture split (API · Application · Domain ·
              Infrastructure · Shared · Tests), wired up MediatR with FluentValidation
              behaviors, and authored every domain entity except a handful of
              vehicle-side migrations done collaboratively. On the frontend I built
              the auth flows end-to-end (login, 2FA, OAuth, invitation acceptance,
              password reset), the settings page, the admin dashboard shell, and the
              dispatcher shipment surface.
            </p>
            <p>
              The work in 2026 has been heavily security-focused: migrating tokens
              from request bodies into httpOnly cookies, binding refresh tokens to a
              device fingerprint, hashing invitation tokens, and adding rate limiting
              to every auth-adjacent endpoint.
            </p>
          </div>
        </div>
      </section>

      {/* Feature breakdown */}
      <section className="relative px-6 py-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-3">
              Feature breakdown
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight max-w-3xl">
              What's{" "}
              <span className="text-gradient">shipped</span> — and what's{" "}
              <span className="text-amber-300">still ahead</span>.
            </h2>
            <p className="mt-5 text-slate-400 max-w-2xl">
              Pulled directly from the current repo (entities, handlers,
              controllers, migrations, frontend modules). Green checks are
              implemented; amber clocks are planned or in progress.
            </p>
          </Reveal>

          <div className="mt-12 space-y-6">
            {groups.map((g, gi) => (
              <Reveal key={g.title} delay={gi * 0.04}>
                <article className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent p-6 md:p-8">
                  <header className="mb-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h3 className="font-display text-2xl text-white font-semibold tracking-tight">
                        {g.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-full border border-mint-500/30 bg-mint-500/10 text-mint-400 px-2.5 py-0.5">
                          <FiCheckCircle className="text-[11px]" />
                          {g.done.length} done
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 px-2.5 py-0.5">
                          <FiClock className="text-[11px]" />
                          {g.todo.length} to do
                        </span>
                      </div>
                    </div>
                    {g.subtitle && (
                      <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                        {g.subtitle}
                      </p>
                    )}
                  </header>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <div className="text-mint-400 text-xs uppercase tracking-[0.25em] mb-3">
                        Implemented
                      </div>
                      {g.done.length ? (
                        <ul className="space-y-3 text-[15px] leading-relaxed">
                          {g.done.map((f) => (
                            <FeatureLine key={f.title} f={f} />
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-slate-500 italic">
                          Nothing shipped yet.
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="text-amber-300 text-xs uppercase tracking-[0.25em] mb-3">
                        Planned / In progress
                      </div>
                      {g.todo.length ? (
                        <ul className="space-y-3 text-[15px] leading-relaxed">
                          {g.todo.map((f) => (
                            <FeatureLine key={f.title} f={f} />
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-slate-500 italic">
                          Nothing outstanding for this area.
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative px-6 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold tracking-tight">
              Want the technical walk-through?
            </h2>
            <p className="mt-4 text-slate-400">
              I'm happy to demo the dispatcher app, walk through the architecture, or
              talk about the trade-offs (CQRS, the Order ↔ Shipment split, the
              cookie-based auth migration).
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="mailto:eldarsarajlic525@gmail.com"
                className="inline-flex items-center gap-2 rounded-full bg-mint-500 text-ink-950 px-6 py-3 font-semibold hover:bg-mint-400 transition-colors glow-mint"
              >
                Get in touch
              </a>
              <TransitionLink
                to="/#projects"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 text-white px-6 py-3 font-medium hover:bg-white/5 transition-colors"
              >
                <FiArrowLeft />
                Back to portfolio
              </TransitionLink>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
