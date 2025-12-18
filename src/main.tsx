import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import "@/index.css";

// Tracking centralizado (GA4, Google Ads, Meta Pixel)
// LGPD-safe — só dispara após consentimento
import { initTracking } from "@/utils/tracking";

// Inicializa tracking UMA ÚNICA VEZ
// Importante: deve rodar antes do primeiro render
initTracking();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element '#root' not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
