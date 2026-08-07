import Reveal from "../components/Reveal";
import OrgLogo from "../components/OrgLogo";

type Item = {
  role: string;
  company: string;
  location: string;
  date: string;
  logo: string;
  initials: string;
  website: string;
  bullets: string[];
};

const items: Item[] = [
  {
    role: "Backend Engineer Intern",
    company: "Mulberry Systems",
    location: "Kakanj, BiH · On-site",
    date: "Aug 2026 — Present",
    logo: "/logos/mulberry.svg",
    initials: "MBS",
    website: "https://www.mulberry-systems.com",
    bullets: [
      "Onboarding as a Python backend engineer, building foundations across FastAPI, PostgreSQL, REST API design, Git/GitHub and core networking concepts (HTTP/HTTPS, DNS, reverse proxies, Nginx).",
      "Solving daily algorithmic problems in Python (LeetCode/HackerRank) to sharpen data structures and problem-solving fundamentals.",
      "Studying backend depth topics: caching (Redis/Memcached), unit/integration/functional testing, CI/CD with GitHub Actions, Docker, database schema design & indexing, concurrency and clean-code design patterns.",
      "Completing Anthropic's official curriculum (Claude, Claude Code, Agent Skills, MCP) to work with Claude and Claude agents as an agentic development collaborator.",
      "Building a capstone project combining Python, FastAPI, PostgreSQL and Git; next phase moves to real client projects using Claude and Claude agents for AI development.",
    ],
  },
  {
    role: "Backend Engineer Intern",
    company: "FlyRank",
    location: "Remote",
    date: "2026 — Present",
    logo: "/logos/flyrank.svg",
    initials: "FR",
    website: "https://flyrank.ai",
    bullets: [
      "Backend engineering internship at FlyRank, an agentic AI platform that automates organic-search and AI-search (AEO/GEO) growth for DTC and B2B SaaS brands.",
      "Working on backend services behind the platform's AI agents: content-generation pipelines, indexation and page-audit jobs, and integrations with search APIs such as Google Search Console.",
      "Building and consuming REST APIs in Python with FastAPI (using FastAPI here as well, in place of a Next.js backend) and wiring LLM providers (ChatGPT, Perplexity, Claude, Google AI) into automated workflows.",
      "Supporting the analytics layer that tracks organic traffic, AI citations and indexation across 30+ localized markets.",
    ],
  },
  {
    role: "QA Automation Engineer Intern",
    company: "HTEC",
    location: "Mostar, BiH · On-site",
    date: "Oct 2025 — Apr 2026",
    logo: "/logos/htec.svg",
    initials: "HTEC",
    website: "https://htec.com",
    bullets: [
      "Designed 50+ manual test cases across 20+ Agile user stories, covering positive, negative and edge-case paths; tracked defects in Jira.",
      "Built a Playwright/TypeScript framework from scratch over 30+ commits and 10+ PRs using POM and custom fixtures, with clear separation of pages, helpers, and constants.",
      "Integrated the test suite into CI with GitHub Actions, enabling automated runs on every pull request.",
      "Implemented global authentication with cookie based session reuse, reducing setup time for each run by ~20 seconds.",
      "Conducted performance/load testing with Grafana k6 to validate API response times under load.",
      "Self-directed research into LLM-as-Judge and the DeepEval framework for AI-assisted test quality assessment.",
    ],
  },
  {
    role: "Human Potential Team Member · Junior Scholar",
    company: "BH Futures Foundation",
    location: "Sarajevo · Hybrid",
    date: "Sep 2025 — Present",
    logo: "/logos/bhff.png",
    initials: "BHFF",
    website: "https://bhfuturesfoundation.org",
    bullets: [
      "Led the evaluation process for the scholarship program by conducting 50+ structured interviews with junior and senior scholars, generating standardized feedback reports used to drive strategic improvements for the future of the scholarship program.",
      "Successfully organized the Mostar GreenTech Ideathon as Team Lead, managing logistics and engagement for 40+ attendees and facilitating the development of 2 successful student innovation projects.",
      "Engaged in high-level professional development at the Future Leaders Summit 2025 and Adriatics Summit 2026, leveraging expert feedback to refine technical hard skills and leadership soft skills.",
    ],
  },
  {
    role: "Mentor Coordinator",
    company: "Hastor Foundation",
    location: "Sarajevo · Remote",
    date: "Oct 2021 — Present",
    logo: "/logos/hastor.png",
    initials: "HF",
    website: "https://fondacijahastor.ba",
    bullets: [
      "Mentored 20+ scholars monthly across a 4 year tenure, logging 10+ volunteer hours/month at consistent quality.",
      "Guided scholars in identifying and designing volunteer activities rooted in local community needs.",
      "Developed coaching, coordination and structured program-management skills through continuous hands-on work.",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative bg-ink-950 section-matte py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="max-w-3xl">
            <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-4">
              03 · Experience
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight">
              Where I've{" "}
              <span className="text-gradient">built, tested,</span> and led.
            </h2>
          </div>
        </Reveal>

        <div className="mt-16 relative">
          <div className="absolute left-8 top-4 bottom-4 w-px bg-gradient-to-b from-mint-500/0 via-mint-500/40 to-mint-500/0 hidden md:block" />

          <div className="space-y-8">
            {items.map((it, i) => (
              <Reveal key={it.company} delay={i * 0.08}>
                <div className="relative md:pl-24">
                  <div className="absolute left-8 top-10 -translate-x-1/2 w-3 h-3 rounded-full bg-mint-400 ring-4 ring-ink-950 z-10 hidden md:block" />

                  <article className="rounded-3xl border border-white/10 card-matte p-6 md:p-8 hover:border-mint-500/40 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                      <a
                        href={it.website}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:scale-105 transition-transform"
                        aria-label={`${it.company} website`}
                      >
                        <OrgLogo
                          src={it.logo}
                          fallback={it.initials}
                          name={it.company}
                        />
                      </a>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="font-display text-xl md:text-2xl text-white font-semibold tracking-tight">
                            {it.role}
                          </h3>
                          <span className="text-mint-400 text-sm font-mono">
                            {it.date}
                          </span>
                        </div>
                        <a
                          href={it.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-1 text-slate-300 hover:text-mint-400 transition-colors"
                        >
                          {it.company}{" "}
                          <span className="text-slate-500">
                            · {it.location}
                          </span>
                        </a>
                      </div>
                    </div>

                    <ul className="mt-6 space-y-3 text-slate-300">
                      {it.bullets.map((b, bi) => (
                        <li key={bi} className="relative pl-5 leading-relaxed">
                          <span className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full bg-mint-500" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
