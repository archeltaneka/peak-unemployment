import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/manrope";
import "@fontsource/dm-serif-display/latin-400.css";
import "./styles.css";
import Dashboard from "./pages/Dashboard";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>,
);
