import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Education from "./sections/Education";
import Contact from "./sections/Contact";
import SectionWrapper from "./components/SectionWrapper";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = location.hash.slice(1);
    // Scroll instantly while the hex transition overlay still covers the page,
    // so the view is already in position when the overlay fades out.
    // Runs on mount only — navbar hash-clicks are left to the browser's native
    // smooth scroll (scroll-behavior: smooth in CSS).
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
    }, 50);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative bg-ink-950 text-slate-300 min-h-screen">
      <div className="relative z-10">
        <Navbar />
        <main className="flex flex-col gap-0.5 lg:gap-0.5">
          <Hero />
          <SectionWrapper className="-mt-10 lg:-mt-15"><About /></SectionWrapper>
          <SectionWrapper><Skills /></SectionWrapper>
          <SectionWrapper><Experience /></SectionWrapper>
          <SectionWrapper><Projects /></SectionWrapper>
          <SectionWrapper><Education /></SectionWrapper>
          <Contact />
        </main>
      </div>
    </div>
  );
}
