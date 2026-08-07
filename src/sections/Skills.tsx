import Reveal from "../components/Reveal";

const groups = [
  {
    title: "Backend & Architecture",
    items: [
      "Python",
      "FastAPI",
      "REST API Design",
      "C# / .NET 8 / ASP.NET Core",
      "EF Core 8",
      "Clean Architecture",
      "MediatR (CQRS)",
      "JWT + Refresh Rotation",
    ],
  },
  {
    title: "Databases & Languages",
    items: ["PostgreSQL", "SQL Server", "SQL", "Python", "C#", "TypeScript", "C++", "JavaScript"],
  },
  {
    title: "AI-Assisted Development",
    items: [
      "Claude / Claude Code",
      "Claude Agents & Agent Skills",
      "Model Context Protocol (MCP)",
      "LLM Integration (ChatGPT, Perplexity, Google AI)",
      "Agentic Workflows",
    ],
  },
  {
    title: "Test Automation",
    items: [
      "Playwright",
      "TypeScript",
      "Page Object Model (POM)",
      "Custom Fixtures",
      "GitHub Actions CI",
    ],
  },
  {
    title: "Manual & API Testing",
    items: [
      "Test Case Design & Execution",
      "Smoke Testing",
      "Regression Testing",
      "Positive / Negative / Edge-Case",
      "REST API Testing (Postman)",
      "Grafana k6 (load / API)",
      "Bug Tracking & Defect Lifecycle (Jira)",
      "Exploratory Testing",
    ],
  },
  {
    title: "Methodologies & Workflow",
    items: [
      "Agile / Scrum",
      "SDLC / STLC",
      "OOP",
      "Git",
      "GitHub Actions",
      "Docker",
      "CI/CD",
    ],
  },
];

export default function Skills() {
  return (
     <section id="skills" className="relative bg-ink-950 section-matte py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="max-w-3xl">
            <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-4">
              02 · Toolbox
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight">
              The stack I reach for{" "}
              <span className="text-gradient">to ship reliable systems</span>.
            </h2>
            <p className="mt-6 text-slate-400 leading-relaxed">
              Backend engineering first — Python, FastAPI and PostgreSQL, with AI-assisted
              development using Claude and Claude agents — backed by a full QA automation toolkit
              across the test pyramid.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.05}>
              <div className="group relative h-full rounded-3xl border border-white/5 card-matte p-6 hover:border-mint-500/40 transition-all duration-500">
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 0%, rgba(61,210,165,0.12), transparent 60%)",
                  }}
                />
                <h3 className="font-display text-white font-semibold tracking-tight mb-4 relative">
                  {g.title}
                </h3>
                <ul className="space-y-2 relative">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-center gap-3 text-sm text-slate-400 cursor-default hover:text-slate-200 transition-colors"
                    >
                      <span className="text-mint-400/40 text-xs leading-none shrink-0 group-hover:text-mint-400/80 transition-colors duration-500">›</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
