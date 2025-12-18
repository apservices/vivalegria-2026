/**
 * React hook for tracking events
 * Provides easy access to tracking functions in React components
 * LGPD-safe, production-ready
 */

import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  trackWhatsAppClick,
  trackFormSubmit,
  trackContratarClick,
  trackLPView,
  getPageType,
  hasTrackingConsent,
} from "@/utils/tracking";

/* ================================
   TYPES
================================ */

type WhatsAppSource =
  | "header"
  | "footer"
  | "floating_button"
  | "landing_page"
  | "form"
  | "page"
  | "obrigado_page";

type FormType =
  | "orcamento"
  | "contratar"
  | "contato"
  | "candidatura"
  | "avaliacao"
  | "pesquisa";

type LandingPageName =
  | "festa-infantil"
  | "recreacao-infantil-sp"
  | "corporativo"
  | "orcamento"
  | "pacotes"
  | "oficinas";

/* ================================
   MAIN TRACKING HOOK
================================ */

export const useTracking = () => {
  const location = useLocation();

  const hasConsent = hasTrackingConsent();
  const pageType = getPageType(location.pathname);

  /* WhatsApp click */
  const onWhatsAppClick = useCallback(
    (source: WhatsAppSource) => {
      if (!hasConsent) return;
      trackWhatsAppClick(source);
    },
    [hasConsent]
  );

  /* Form submit */
  const onFormSubmit = useCallback(
    (formType: FormType) => {
      if (!hasConsent) return;
      trackFormSubmit(formType);
    },
    [hasConsent]
  );

  /* CTA contratar */
  const onContratarClick = useCallback(
    (buttonLabel: string) => {
      if (!hasConsent) return;
      trackContratarClick(buttonLabel);
    },
    [hasConsent]
  );

  /* Manual landing page view */
  const onLPView = useCallback(
    (lpName: LandingPageName) => {
      if (!hasConsent) return;
      trackLPView(lpName);
    },
    [hasConsent]
  );

  return {
    onWhatsAppClick,
    onFormSubmit,
    onContratarClick,
    onLPView,
    pageType,
    hasConsent,
  };
};

/* ================================
   AUTO LANDING PAGE TRACKING
   Use ONLY inside landing pages
================================ */

export const useLPTracking = (lpName: LandingPageName) => {
  const location = useLocation();
  const trackedRef = useRef(false);

  useEffect(() => {
    const hasConsent = hasTrackingConsent();
    if (!hasConsent) return;

    const pageType = getPageType(location.pathname);
    if (
      (pageType === "landing_page" || pageType === "page") &&
      !trackedRef.current
    ) {
      trackedRef.current = true;
      trackLPView(lpName);
    }
  }, [lpName, location.pathname]);
};
