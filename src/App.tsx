import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Education from "./sections/Education";
import Contact from "./sections/Contact";
import HexGrid from "./components/HexGrid";
import SectionWrapper from "./components/SectionWrapper";

export default function App() {
  return (
    <div className="relative bg-ink-950 text-slate-300 min-h-screen">
      <HexGrid />
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
