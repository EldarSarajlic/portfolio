import Reveal from "../components/Reveal";
import OrgLogo from "../components/OrgLogo";
import { experience } from "../content";

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
            {experience.map((it, i) => (
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
