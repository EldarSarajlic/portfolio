import Reveal from "../components/Reveal";

export default function About() {
  return (
     <section id="about" className="relative bg-ink-950 section-matte py-32 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
        <Reveal className="lg:col-span-4">
          <div className="sticky top-32">
            <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-4">
              01 · About
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight">
              A structured,{" "}
              <span className="text-gradient">ownership-driven</span>{" "}
              engineer.
            </h2>
          </div>
        </Reveal>

        <div className="lg:col-span-8 space-y-8 text-lg text-slate-300 leading-relaxed">
  <Reveal delay={0.05}>
    <p>
      I am a Software Engineering student specializing in{" "}
      <span className="text-white font-medium">QA Automation</span>, with a
      focus on building scalable{" "}
      <span className="text-mint-400">Playwright</span> frameworks and
      developing <span className="text-mint-400">Angular / .NET</span>{" "}
      applications.
    </p>
  </Reveal>

  <Reveal delay={0.1}>
    <p>
      I care about writing maintainable, testable software and bridging the
      gap between development and quality engineering. I enjoy building
      systems that are not only functional, but reliable under real world
      conditions.
    </p>
  </Reveal>

  <Reveal delay={0.2}>
    <p>
      Beyond development, I have been a C++ instructor since 2020, helping
      fellow students strengthen their programming foundations. I’m also
      involved in mentorship and leadership roles within the Hastor
      Foundation and BH Futures Foundation, where I contribute to technical
      education and student development.
    </p>
  </Reveal>

  <Reveal delay={0.25}>
    <p>
      I take an ownership-driven approach to engineering, whether I’m
      designing end-to-end test suites or supporting others in their growth.
      My goal is to combine strong engineering standards with a collaborative
      mindset to build better software and stronger teams.
    </p>
  </Reveal>

  <Reveal delay={0.3}>
    <div className="grid sm:grid-cols-2 gap-4 pt-6">
      {[
        { label: "Location", value: "Kakanj, BiH" },
        { label: "Education", value: "BSc Software Engineering" },
        { label: "Currently", value: "Open to new opportunities" },
        { label: "Focus", value: "QA Automation · Full-stack" },
      ].map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/5 card-matte p-5 hover:border-mint-500/30 transition-colors"
        >
          <div className="text-xs uppercase tracking-widest text-slate-500">
            {item.label}
          </div>
          <div className="text-white font-medium mt-1">{item.value}</div>
        </div>
      ))}
    </div>
  </Reveal>
</div>
      </div>
    </section>
  );
}
