import Reveal from "../components/Reveal";

const groups = [
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
    title: "Backend & Architecture",
    items: [
      "C#",
      ".NET 8 / ASP.NET Core",
      "EF Core 8",
      "Clean Architecture",
      "MediatR (CQRS)",
      "FluentValidation",
      "SignalR",
      "JWT + Refresh Rotation",
    ],
  },
  {
    title: "Frontend",
    items: [
      "Angular 21",
      "Signals & RxJS",
      "Tailwind v4",
      "DaisyUI v5",
      "SCSS",
    ],
  },
  {
    title: "Databases & Languages",
    items: ["SQL Server", "SQL", "TypeScript", "C#", "C++", "JavaScript"],
  },
  {
    title: "Methodologies & Workflow",
    items: [
      "Agile / Scrum",
      "SDLC / STLC",
      "OOP",
      "Git",
      "GitHub Actions",
      "Azure DevOps",
      "Continuous Testing",
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
              <span className="text-gradient">across the test pyramid</span>.
            </h2>
            <p className="mt-6 text-slate-400 leading-relaxed">
              QA across the front of the test pyramid — manual, API, automation, and performance, backed by production-grade .NET and Angular development
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
                <ul className="flex flex-wrap gap-2 relative">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="text-sm rounded-full border border-white/10 tag-lift px-3 py-1 text-slate-300 hover:border-mint-500/50 hover:text-mint-400 transition-colors cursor-default"
                    >
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
