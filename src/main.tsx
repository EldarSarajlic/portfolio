import { StrictMode, lazy, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ReactLenis, useLenis } from "lenis/react";
import "./index.css";
import App from "./App.tsx";
import { PageTransitionProvider } from "./components/PageTransition.tsx";

const DispatcherPage = lazy(() => import("./pages/DispatcherPage.tsx"));
const PlaywrightPage = lazy(() => import("./pages/PlaywrightPage.tsx"));

const isTouch = window.matchMedia("(pointer: coarse)").matches;

// On a hard reload the browser would auto-scroll to the hash anchor after
// React renders. Strip the hash right now (synchronously, before React mounts)
// so the browser has nothing to scroll to. App.tsx will scroll to top instead.
const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
if (navEntry?.type === "reload" && window.location.hash) {
  history.replaceState(history.state, "", window.location.pathname + window.location.search);
}

// Reset scroll to the top on every route change. The Lenis root instance lives
// above the router and survives navigation, so its in-flight momentum from the
// previous page would otherwise carry into the freshly-mounted page and leave
// it scrolled mid-way. Snapping Lenis to 0 immediately (with a native
// window.scrollTo fallback for touch, where Lenis is disabled) fixes that.
// Hash navigation (e.g. "/#projects") is left to App's own anchor-scroll logic.
function ScrollReset() {
  const lenis = useLenis();
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname, hash, lenis]);
  return null;
}

// Lenis keeps smoothing for a beat after a wheel scroll and, during that window,
// ignores native scroll events — so grabbing the scrollbar thumb right after
// wheeling gets overridden and the thumb snaps back. When a click lands in the
// scrollbar gutter (right of the content box), pause Lenis so the browser's own
// scrollbar dragging takes over, then resume on release (Lenis re-syncs to the
// native position, so there's no jump).
function ScrollbarDragFix() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    let dragging = false;
    const onDown = (e: MouseEvent) => {
      if (e.clientX >= document.documentElement.clientWidth) {
        dragging = true;
        lenis.stop();
      }
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      lenis.start();
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [lenis]);
  return null;
}

const router = (
  <BrowserRouter>
    <PageTransitionProvider>
      <ScrollReset />
      <ScrollbarDragFix />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/projects/truck-dispatcher" element={<DispatcherPage />} />
          <Route path="/projects/playwright-htec" element={<PlaywrightPage />} />
          <Route path="*" element={<App />} />
        </Routes>
      </Suspense>
    </PageTransitionProvider>
  </BrowserRouter>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isTouch ? router : <ReactLenis root options={{ lerp: 0.07 }}>{router}</ReactLenis>}
  </StrictMode>
);
