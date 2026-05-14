import Reveal from "../components/Reveal";

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
          <Reveal delay={0.05}>
            <div className="rounded-3xl border border-white/10 card-matte p-7">
              <div className="flex items-center gap-5">
                <div className="grid place-items-center w-24 h-24 md:w-28 md:h-28 shrink-0">
                  <img
                    src="/logos/fit.png"
                    alt="Faculty of Information Technologies logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl text-white font-semibold">
                      BSc Information Technologies — Software Engineering
                    </h3>
                    <span className="text-mint-400 text-sm font-mono">
                      2023 — Present
                    </span>
                  </div>
                  <div className="text-slate-400 mt-1">
                    Faculty of Information Technologies, University "Džemal
                    Bijedić" in Mostar
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="rounded-full border border-white/10 tag-lift text-slate-300 px-3 py-1 text-sm">
                      Programming I & II · C++
                    </span>
                    <span className="rounded-full border border-white/10 tag-lift text-slate-300 px-3 py-1 text-sm">
                      Software Development I · Angular / .NET
                    </span>
                    <span className="rounded-full border border-white/10 tag-lift text-slate-300 px-3 py-1 text-sm">
                      Databases 2 · SQL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-white/10 card-matte p-7">
              <div className="flex items-center gap-5">
                <div className="grid place-items-center w-24 h-24 md:w-28 md:h-28 shrink-0">
                  <img
                    src="/logos/udemy.svg"
                    alt="Udemy logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl text-white font-semibold">
                      ASP.NET Core & Angular — Full Stack
                    </h3>
                    <span className="text-mint-400 text-sm font-mono">2025</span>
                  </div>
                  <div className="text-slate-400 mt-1">
                    Udemy · Neil Cummings
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
