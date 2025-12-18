import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";

/**
 * Inicialização segura do Meta Pixel
 */
function initMetaPixel() {
  const pixelId = import.meta.env.VITE_META_PIXEL_ID;

  if (!pixelId) {
    if (import.meta.env.DEV) {
      console.info("[Meta Pixel] Desativado (VITE_META_PIXEL_ID não definido)");
    }
    return;
  }

  if (!(window as any).fbq) {
    console.warn("[Meta Pixel] fbq não encontrado");
    return;
  }

  (window as any).fbq("init", pixelId);
  (window as any).fbq("track", "PageView");
}

initMetaPixel();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
