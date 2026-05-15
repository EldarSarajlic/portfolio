import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 20));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,padding] duration-300 ${
        scrolled ? "py-3 bg-ink-950/95 border-b border-mint-500/10" : "py-6 bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-center">
        <ul className="flex items-center gap-0 sm:gap-1 text-[11px] sm:text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => {
                  if (lenis) {
                    e.preventDefault();
                    lenis.scrollTo(l.href);
                  }
                }}
                className="px-2 py-1.5 sm:px-4 sm:py-2 rounded-full text-slate-300 hover:text-mint-400 hover:bg-white/5 transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
