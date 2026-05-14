import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiGithub,
  FiCode,
  FiLayers,
  FiServer,
  FiBookOpen,
} from "react-icons/fi";
import Reveal from "../components/Reveal";

type Feature = {
  title: string;
  detail?: string;
};

type FeatureGroup = {
  title: string;
  icon: React.ReactNode;
  subtitle?: string;
  done: Feature[];
  todo: Feature[];
};

const groups: FeatureGroup[] = [
  {
    title: "Framework foundation",
    icon: <FiCode />,
    subtitle:
      "The bones of the framework — config, auth strategy, helpers, and the page-object base class.",
    done: [
      {
        title: "Playwright + TypeScript scaffolding",
        detail: "playwright.config.ts with 60s timeout, action 15s, navigation 30s; HTML reporter; trace on first retry; CI-aware retries + workers.",
      },
      {
        title: "Two-project setup: authenticated vs unauthenticated",
        detail: "Tests are physically split by auth state and pointed at separate testDirs so storage state only loads where it's actually needed.",
      },
      {
        title: ".env-driven configuration",
        detail: "dotenv loads from .env.dev for ADMIN_USERNAME / ADMIN_PASSWORD / USERMANAGEMENT_URL — no credentials in code.",
      },
      {
        title: "Global setup with cookie-based auth reuse",
        detail: "Logs in once, saves storageState to playwright/.auth/admin.json, validates the cached session with a real API call before reusing it; deletes and re-logs in if the session has expired.",
      },
      {
        title: "Global teardown for clean CI runs",
        detail: "global-teardown.ts removes the cached auth file at the end of the run; commented out by default so local devs keep the session.",
      },
      {
        title: "BasePage utility class",
        detail: "Shared spinner / 'Searching…' waiters, common input/text/button/dropdown validators, plus navigation through a NavigationHelper.",
      },
      {
        title: "POM + fixtures pattern",
        detail: "fixtures/pages.ts exposes a single `pages` fixture that hands every spec a fresh set of seven page objects through Playwright's `test.extend`.",
      },
    ],
    todo: [
      {
        title: "GitHub Actions CI pipeline",
        detail: "Config files are CI-aware (retries, workers) but a workflow.yml isn't checked in here yet.",
      },
      {
        title: "Multi-browser projects (Firefox / WebKit / Mobile)",
        detail: "Configs are stubbed in playwright.config.ts but commented out — current run is Chromium-only.",
      },
      {
        title: "Visual regression baselines",
      },
    ],
  },
  {
    title: "Page Object Model (7 pages)",
    icon: <FiLayers />,
    subtitle:
      "One class per OrangeHRM surface; selectors, waits, and validations encapsulated away from specs.",
    done: [
      { title: "BasePage — shared waiters + validators" },
      { title: "LoginPage — auth flow + happy/sad path verifications" },
      { title: "DashboardPage — sidebar, widgets, navigation" },
      { title: "AdminUserManagementPage — filters, table, search, reset, paginated results" },
      { title: "AdminAddUserPage — create-user form with role / status / employee-name pickers" },
      { title: "PimEmployeeListPage — employee list with search and table validations" },
      { title: "PimAddEmployeePage — add-employee form" },
    ],
    todo: [
      { title: "Leave / Time / Recruitment / My Info / Performance page objects" },
      { title: "Edit-employee + delete-employee page objects" },
    ],
  },
  {
    title: "Helpers & constants",
    icon: <FiServer />,
    subtitle:
      "Small but disciplined — separated data generators, navigation, auth validation, and copy from the specs themselves.",
    done: [
      {
        title: "auth-validator helper",
        detail:
          "Reads storageState, checks cookies, makes a live API request to the user-management URL, and treats a redirect to /auth/login as an expired session.",
      },
      {
        title: "dataHelper",
        detail:
          "Timestamped username, first-name and last-name generators so create-user tests never collide on uniqueness constraints.",
      },
      {
        title: "navigationHelper",
        detail: "Single source of truth for `page.goto` + URL-partition assertion.",
      },
      {
        title: "Constants per module",
        detail:
          "adminUserManagement-constants.ts · dashboard-constants.ts · pimEmployeeList-constants.ts — copy is centralised, no magic strings in tests.",
      },
      {
        title: "Static request-body fixtures",
        detail: "data/CourseData/{post,put,patch,token}_request_body.json fed into the apitests/ specs.",
      },
    ],
    todo: [
      { title: "Shared API client wrapper over `request.newContext`" },
      { title: "Faker-based generators for richer test data" },
    ],
  },
  {
    title: "OrangeHRM UI tests (47 cases, 10 spec files)",
    icon: <FiBookOpen />,
    subtitle:
      "Production-style suite — split by auth state, structured around step blocks, mentor-reviewed across 13 PRs.",
    done: [
      {
        title: "Login page · 6 cases (raw)",
        detail: "Initial implementation of login happy path + invalid combos before the fixture refactor.",
      },
      {
        title: "Login page · 6 cases (fixture refactored)",
        detail: "Same coverage, now consuming the `pages` fixture and the LoginPage POM (PR T1).",
      },
      {
        title: "Dashboard page · 2 cases (unauth flow)",
        detail: "Sidebar / header / widgets validations.",
      },
      {
        title: "Dashboard page · 2 cases (auth + fixture)",
        detail: "Logged-in version that skips login via global storageState (PR T2).",
      },
      {
        title: "User Management · 5 cases (raw)",
        detail:
          "Sidebar active state, filter visibility, table headers, filter-by-username/employee/role/status, create-user-then-find-it end-to-end (PR T3 source).",
      },
      {
        title: "Admin User Management · 5 cases (POM + fixture refactor)",
        detail:
          "Same five tests rewritten on top of AdminUserManagementPage + AdminAddUserPage with `test.step` blocks for filters, role, status, username, employee name (refactor PR T3).",
      },
      {
        title: "PIM Employee List · 2 cases",
        detail: "AI-assisted draft (PR #13 — `ai/pim-page-tests`) wired into the same POM + fixture stack.",
      },
    ],
    todo: [
      { title: "PIM — full employee CRUD coverage (add, edit, delete, search by id)" },
      { title: "Leave / Time module specs" },
      { title: "Negative-path coverage on Admin (duplicate username, password rules)" },
      { title: "Cross-browser run for the OrangeHRM suite" },
    ],
  },
  {
    title: "API tests (13 cases, 5 spec files)",
    icon: <FiServer />,
    subtitle:
      "Pure `request` context tests — no UI — exercising OrangeHRM's REST surface alongside the booking API used in the lab phase.",
    done: [
      {
        title: "Login API · 4 cases",
        detail: "PR T4 — verifies the auth endpoint contracts and error responses.",
      },
      {
        title: "Dashboard API · 2 cases",
        detail: "PR T5 — fetches and validates dashboard widget endpoints.",
      },
      {
        title: "User Management API · 7 cases",
        detail: "PR T6 — list/search/create/delete users via API; flaky-test fixes applied.",
      },
      {
        title: "Restful-Booker lab API · 5 cases",
        detail: "CreateBookingRequest, GetBookingRequest, Put, Patch, Delete — built early as the course-driven introduction to API testing.",
      },
    ],
    todo: [
      { title: "Schema validation (Zod / Ajv) on API responses" },
      { title: "Contract tests that decouple UI specs from API state" },
      { title: "Token-management fixture for non-admin roles" },
    ],
  },
  {
    title: "Course / lab archive (29 spec files)",
    icon: <FiBookOpen />,
    subtitle:
      "The learning log — locator drills, dynamic widgets, mouse / keyboard, and UI primitives I built during the course phase of the internship.",
    done: [
      { title: "Locator deep-dive: CSS, XPath (with axis), Playwright built-in locators" },
      { title: "Dropdowns — native, custom, multi-select, duplicate, hidden" },
      { title: "Tables — static, dynamic, paginated" },
      { title: "Date picker (jQuery), dialogs, popups, frames, tabs" },
      { title: "Mouse actions (4 cases) + lab mouse actions + keyboard actions" },
      { title: "Infinite scrolling and file uploads" },
      { title: "Standalone OrangeHRM smoke + raw HTML app testing" },
    ],
    todo: [
      { title: "Migrate course-lab patterns that proved useful into shared helpers" },
      { title: "Delete or archive lab files that are superseded by the OrangeHRM suite" },
    ],
  },
];

const ticketTrail = [
  { id: "Setup", text: "Initial Playwright scaffold + README + folder structure (PRs #1–#3)" },
  { id: "T1", text: "Login page tests (PR #4 → refactor PR #10 with POM + fixtures)" },
  { id: "T2", text: "Dashboard page tests (PR #5 → refactor PR #11 with POM + fixtures + storage state)" },
  { id: "T3", text: "Admin User Management tests (PR #6 → refactor PR #12 with POM + fixtures)" },
  { id: "T4", text: "Login page API tests (PR #7)" },
  { id: "T5", text: "Dashboard page API tests (PR #8)" },
  { id: "T6", text: "Admin User Management API tests (PR #9) + flaky-test stabilisation" },
  { id: "PR #13", text: "PIM page tests drafted with an AI model (branch `ai/pim-page-tests`)" },
];

function FeatureLine({ f, done }: { f: Feature; done: boolean }) {
  return (
    <li className="flex items-start gap-3">
      {done ? (
        <FiCheckCircle className="shrink-0 mt-0.5 text-mint-400" />
      ) : (
        <FiClock className="shrink-0 mt-0.5 text-amber-300" />
      )}
      <div>
        <span className={done ? "text-slate-200" : "text-slate-300"}>{f.title}</span>
        {f.detail && (
          <span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">
            {f.detail}
          </span>
        )}
      </div>
    </li>
  );
}

export default function PlaywrightPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const doneTotal = groups.reduce((n, g) => n + g.done.length, 0);
  const todoTotal = groups.reduce((n, g) => n + g.todo.length, 0);

  return (
    <div className="min-h-screen bg-ink-950 text-slate-300">
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

      {/* Hero */}
      <section className="relative px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="relative max-w-6xl mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-mint-500/30 bg-mint-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-mint-400 mb-6">
              QA Automation Internship · HTEC
            </div>
            <h1 className="font-display text-white text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Playwright E2E Framework
            </h1>
            <p className="mt-4 text-xl text-mint-400 font-display">
              OrangeHRM — manual testing into Playwright + TypeScript automation
            </p>
            <p className="mt-6 text-slate-300 leading-relaxed max-w-3xl text-lg">
              The repository documents my internship workflow end-to-end: manually
              testing OrangeHRM, identifying scenarios and edge cases, and then
              automating them with Playwright and TypeScript. It evolved across
              13 mentor-reviewed pull requests from a course-style learning log
              into a production-style suite — split by auth state, organised
              around the Page Object Model, and backed by a global setup that
              reuses a validated browser session across every run.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { k: "44", v: "Spec files" },
                { k: "~60", v: "Test cases (UI + API)" },
                { k: "37", v: "Commits" },
                { k: "13", v: "Pull requests" },
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
                "Playwright 1.57",
                "TypeScript",
                "Node.js",
                "POM (7 page objects)",
                "Custom fixtures",
                "Storage state (auth reuse)",
                "Global setup / teardown",
                "API testing (`request` context)",
                "dotenv",
                "HTML reporter",
                "Trace on first-retry",
                "csv-parse · xlsx (data-driven)",
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
              Built the framework{" "}
              <span className="text-gradient">from scratch</span>
            </h2>
          </Reveal>
          <div className="lg:col-span-8 text-slate-300 leading-relaxed space-y-4">
            <p>
              Mentored by HTEC's senior QA engineers, I owned every commit in this
              repo. I started with the lab phase — locator drills, dynamic widgets,
              mouse and keyboard primitives — then moved into the production
              workflow: manually test an OrangeHRM module, capture the scenarios,
              automate the happy and edge paths, and submit a pull request for
              review.
            </p>
            <p>
              Each module went through the same two-step rhythm: write the tests
              first (T1 → T6), then refactor them onto the Page Object Model and
              the shared `pages` fixture once the patterns settled. That
              before/after split is visible in the commit history — the "raw"
              files and the "using-fixture" files for Login, Dashboard and Admin
              all live in the repo so the progression is auditable.
            </p>
            <p>
              The most interesting piece of architecture I added was the global
              setup with cookie reuse. Instead of logging in at the start of every
              spec, the suite logs in once, saves storage state to disk, and the
              `auth-validator` makes a real API call to confirm the session is
              still good before reusing it. If the cookie has expired, the file is
              deleted and a fresh login runs — meaning the test run never wastes
              time on stale auth and never silently runs against a half-broken
              session.
            </p>
          </div>
        </div>
      </section>

      {/* Ticket trail */}
      <section className="relative px-6 py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-3">
              Ticket trail
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white font-bold tracking-tight">
              How the suite{" "}
              <span className="text-gradient">grew, pull request by pull request</span>.
            </h2>
          </Reveal>
          <div className="mt-10 grid md:grid-cols-2 gap-4">
            {ticketTrail.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.04}>
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-mint-500/30 transition-colors">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-mint-400 text-sm shrink-0">
                      {t.id}
                    </span>
                    <span className="text-slate-300 text-sm leading-relaxed">
                      {t.text}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
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
              <span className="text-gradient">in the repo</span> — and what's{" "}
              <span className="text-amber-300">still ahead</span>.
            </h2>
            <p className="mt-5 text-slate-400 max-w-2xl">
              Pulled directly from the current repo (config, helpers, page
              objects, spec files, commits, PRs). Green checks are implemented;
              amber clocks are planned, deferred, or stubbed.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-mint-500/30 bg-mint-500/10 text-mint-400 px-3 py-1">
                <FiCheckCircle />
                {doneTotal} implemented
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 px-3 py-1">
                <FiClock />
                {todoTotal} planned
              </span>
            </div>
          </Reveal>

          <div className="mt-12 space-y-6">
            {groups.map((g, gi) => (
              <Reveal key={g.title} delay={gi * 0.04}>
                <article className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent p-6 md:p-8">
                  <header className="mb-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h3 className="font-display text-2xl text-white font-semibold tracking-tight flex items-center gap-3">
                        <span className="text-mint-400">{g.icon}</span>
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
                            <FeatureLine key={f.title} f={f} done />
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
                        Planned / Deferred
                      </div>
                      {g.todo.length ? (
                        <ul className="space-y-3 text-[15px] leading-relaxed">
                          {g.todo.map((f) => (
                            <FeatureLine key={f.title} f={f} done={false} />
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
              Happy to walk through any spec, the POM / fixture split, the
              session-reuse strategy, or the API-test approach.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="mailto:eldarsarajlic525@gmail.com"
                className="inline-flex items-center gap-2 rounded-full bg-mint-500 text-ink-950 px-6 py-3 font-semibold hover:bg-mint-400 transition-colors glow-mint"
              >
                Get in touch
              </a>
              <Link
                to="/#projects"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 text-white px-6 py-3 font-medium hover:bg-white/5 transition-colors"
              >
                <FiArrowLeft />
                Back to portfolio
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
