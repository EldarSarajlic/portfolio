import Reveal from "../components/Reveal";
import { education } from "../content";

export default function Education() {
  return (
    <section id="education" className="relative bg-ink-950 section-matte py-32 px-6">

      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
        <Reveal className="lg:col-span-4">
          <div className="sticky top-32">
            <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-4">
              05 · Learning
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight">
              Always{" "}
              <span className="text-gradient">leveling up</span>.
            </h2>
          </div>
        </Reveal>

        <div className="lg:col-span-8 space-y-6">
          {education.map((e, i) => (
            <Reveal key={e.title} delay={0.05 + i * 0.05}>
              <div className="rounded-3xl border border-white/10 card-matte p-7">
                <div className="flex items-center gap-5">
                  <div className="grid place-items-center w-24 h-24 md:w-28 md:h-28 shrink-0">
                    <img
                      src={e.logo}
                      alt={e.logoAlt}
                      width="112"
                      height="112"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-xl text-white font-semibold">
                        {e.title}
                      </h3>
                      <span className="text-mint-400 text-sm font-mono">
                        {e.date}
                      </span>
                    </div>
                    <div className="text-slate-400 mt-1">{e.org}</div>
                    {e.courses.length > 0 && (
                      <ul className="mt-4 space-y-1.5">
                        {e.courses.map((c) => (
                          <li key={c} className="flex items-center gap-3 text-sm text-slate-400">
                            <span className="h-px w-4 bg-mint-400/40 shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
