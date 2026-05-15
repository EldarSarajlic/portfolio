import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import "./index.css";
import App from "./App.tsx";
import DispatcherPage from "./pages/DispatcherPage.tsx";
import PlaywrightPage from "./pages/PlaywrightPage.tsx";
import { PageTransitionProvider } from "./components/PageTransition.tsx";

const isTouch = window.matchMedia("(pointer: coarse)").matches;

// On a hard reload the browser would auto-scroll to the hash anchor after
// React renders. Strip the hash right now (synchronously, before React mounts)
// so the browser has nothing to scroll to. App.tsx will scroll to top instead.
const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
if (navEntry?.type === "reload" && window.location.hash) {
  history.replaceState(history.state, "", window.location.pathname + window.location.search);
}

const router = (
  <BrowserRouter>
    <PageTransitionProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects/truck-dispatcher" element={<DispatcherPage />} />
        <Route path="/projects/playwright-htec" element={<PlaywrightPage />} />
        <Route path="*" element={<App />} />
      </Routes>
    </PageTransitionProvider>
  </BrowserRouter>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isTouch ? router : <ReactLenis root options={{ lerp: 0.07 }}>{router}</ReactLenis>}
  </StrictMode>
);
