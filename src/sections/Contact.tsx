import { FiArrowUpRight, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import Reveal from "../components/Reveal";
import Magnetic from "../components/Magnetic";
import Aurora from "../components/Aurora";

export default function Contact() {
  return (
    <section id="contact" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0,black_160px,black_calc(100%-160px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_160px,black_calc(100%-160px),transparent_100%)]">
        <Aurora />
      </div>
      <div className="relative max-w-5xl mx-auto text-center">
        <Reveal>
          <div className="text-mint-400 text-xs uppercase tracking-[0.3em] mb-4">
            06 · Contact
          </div>
          <h2 className="font-display text-5xl md:text-7xl text-white font-bold tracking-tight">
            Let's build{" "}
            <span className="text-gradient">something great</span>.
          </h2>
          <p className="mt-6 text-slate-300 text-lg max-w-2xl mx-auto">
            Open to new opportunities, collaborations, and conversations — from
            QA architecture to full-stack engineering and student-led
            initiatives.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <a
                href="mailto:eldarsarajlic525@gmail.com"
                className="group inline-flex items-center gap-3 rounded-full bg-mint-500 text-ink-950 px-7 py-4 font-semibold hover:bg-mint-400 transition-colors glow-mint"
              >
                eldarsarajlic525@gmail.com
                <FiArrowUpRight className="text-xl group-hover:rotate-45 transition-transform" />
              </a>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-16 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <a
              href="mailto:eldarsarajlic525@gmail.com"
              className="group rounded-2xl border border-white/10 card-matte p-5 text-left hover:border-mint-500/40 transition-colors"
            >
              <FiMail className="text-mint-400 text-xl" />
              <div className="text-xs uppercase tracking-widest text-slate-500 mt-3">
                Email
              </div>
              <div className="text-white text-sm mt-1 group-hover:text-mint-400 transition-colors break-all">
                eldarsarajlic525@gmail.com
              </div>
            </a>
            <a
              href="https://www.linkedin.com/in/eldar-sarajli%C4%87-3a695b304/"
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-white/10 card-matte p-5 text-left hover:border-mint-500/40 transition-colors"
            >
              <FiLinkedin className="text-mint-400 text-xl" />
              <div className="text-xs uppercase tracking-widest text-slate-500 mt-3">
                LinkedIn
              </div>
              <div className="text-white text-sm mt-1 group-hover:text-mint-400 transition-colors">
                eldar-sarajlić
              </div>
            </a>
            <a
              href="https://github.com/EldarSarajlic"
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-white/10 card-matte p-5 text-left hover:border-mint-500/40 transition-colors"
            >
              <FiGithub className="text-mint-400 text-xl" />
              <div className="text-xs uppercase tracking-widest text-slate-500 mt-3">
                GitHub
              </div>
              <div className="text-white text-sm mt-1 group-hover:text-mint-400 transition-colors">
                EldarSarajlic
              </div>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-24 pt-8 border-t border-white/5 text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>© {new Date().getFullYear()} Eldar Sarajlić · All rights reserved.</div>
            <div className="font-signature text-mint-400 text-xl">— Building quality software.</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
