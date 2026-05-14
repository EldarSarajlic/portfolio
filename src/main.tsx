import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import DispatcherPage from "./pages/DispatcherPage.tsx";
import PlaywrightPage from "./pages/PlaywrightPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects/truck-dispatcher" element={<DispatcherPage />} />
        <Route path="/projects/playwright-htec" element={<PlaywrightPage />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
