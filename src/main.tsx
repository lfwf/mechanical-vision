import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";
import "./quality-styles.css";
import "./readability-fixes.css";
import "./experiments.css";
import "./city-styles.css";
import "./dream-base.css";
import "./dream-arch.css";
import "./dream-chapter-layout.css";
import "./dream-chapter-panel.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
