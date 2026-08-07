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
              <span className="text-gradient">ownership driven</span>{" "}
              engineer.
            </h2>
          </div>
        </Reveal>

        <div className="lg:col-span-8 space-y-8 text-lg text-slate-300 leading-relaxed">
  <Reveal delay={0.05}>
    <p>
      I am a <span className="text-white font-medium">Software Engineering
      student</span>. Rather than tie myself to a single stack, I focus on
      building reliable systems end to end —{" "}
      <span className="text-mint-400">backend engineering</span> first,{" "}
      <span className="text-mint-400">QA automation</span> second.
    </p>
  </Reveal>

  <Reveal delay={0.1}>
    <p>
      My current interest is in{" "}
      <span className="text-white font-medium">logistics and transport</span>:
      implementing <span className="text-mint-400">AI solutions</span> that save
      money and time for real-time operations — turning messy operational data
      into decisions that move faster and cost less.
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
      I take an ownership driven approach to engineering, whether I’m building
      backend services, designing end-to-end test suites, or supporting others
      in their growth. My goal is to combine strong engineering standards with a
      collaborative mindset to build better software and stronger teams.
    </p>
  </Reveal>

  <Reveal delay={0.3}>
    <div className="grid sm:grid-cols-2 gap-4 pt-6">
      {[
        { label: "Location", value: "Kakanj, BiH" },
        { label: "Education", value: "BSc Software Engineering (student)" },
        { label: "Currently", value: "Backend Engineer Intern" },
        { label: "Focus", value: "Backend Engineering · AI for logistics" },
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
