import { FiArrowUpRight, FiGithub } from "react-icons/fi";
import Reveal from "../components/Reveal";
import { TransitionLink } from "../components/PageTransition";
import { projects } from "../content";
import type { Project } from "../content/types";

function CardShell({ p, children }: { p: Project; children: React.ReactNode }) {
  const cls =
    "group block relative overflow-hidden rounded-3xl border border-white/10 card-matte p-8 md:p-10 hover:border-mint-500/40 transition-all duration-500";
  if (p.href.startsWith("/")) {
    return (
      <TransitionLink to={p.href} className={cls}>
        {children}
      </TransitionLink>
    );
  }
  return (
    <a href={p.href} target="_blank" rel="noreferrer" className={cls}>
      {children}
    </a>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative bg-ink-950 section-matte py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="max-w-3xl">
            <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-4">
              04 · Selected work
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight">
              Things I'm{" "}
              <span className="text-gradient">designing & building</span>.
            </h2>
          </div>
        </Reveal>

        <div className="mt-16 space-y-8">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <CardShell p={p}>
                <div className="grid md:grid-cols-12 gap-8">
                  <div className="md:col-span-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-mint-400 text-xs uppercase tracking-[0.25em]">
                            {p.subtitle}
                          </span>
                          {p.status?.label && (
                            <span
                              className={`text-[10px] font-medium uppercase tracking-widest ${
                                p.status.tone === "amber"
                                  ? "text-amber-300"
                                  : "text-mint-400"
                              }`}
                            >
                              {p.status.label}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-3xl md:text-4xl text-white font-bold tracking-tight">
                          {p.title}
                        </h3>
                      </div>
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm text-slate-400 group-hover:bg-mint-500 group-hover:text-ink-950 group-hover:border-mint-500 transition-all duration-500 whitespace-nowrap shrink-0">
                        View case study
                        <FiArrowUpRight className="text-sm sm:text-base group-hover:rotate-45 transition-transform duration-500" />
                      </div>
                    </div>
                    <p className="mt-5 text-slate-300 leading-relaxed">
                      {p.description}
                    </p>
                    <p className="mt-6 font-mono text-[11px] text-slate-500 tracking-wide leading-relaxed">
                      {p.stack.join("  ·  ")}
                    </p>
                  </div>
                  <div className="md:col-span-5">
                    <div className="rounded-2xl border border-white/5 card-matte-inner p-5 h-full">
                      <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest mb-4">
                        <FiGithub />
                        Highlights
                      </div>
                      <ul className="space-y-3">
                        {p.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex items-center gap-3 text-slate-300"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-mint-400" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardShell>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
