/**
 * React hook for tracking events
 * Provides easy access to tracking functions in React components
 */

import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  trackWhatsAppClick,
  trackFormSubmit,
  trackContratarClick,
  trackLPView,
  getPageType,
  hasTrackingConsent,
} from "@/utils/tracking";

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

export const useTracking = () => {
  const location = useLocation();

  const hasConsent = hasTrackingConsent();
  const pageType = getPageType(location.pathname);

  /** WhatsApp click */
  const onWhatsAppClick = useCallback(
    (source: WhatsAppSource) => {
      if (!hasConsent) return;
      trackWhatsAppClick(source);
    },
    [hasConsent]
  );

  /** Form submit */
  const onFormSubmit = useCallback(
    (formType: FormType) => {
      if (!hasConsent) return;
      trackFormSubmit(formType);
    },
    [hasConsent]
  );

  /** CTA contratar */
  const onContratarClick = useCallback(
    (buttonLabel: string) => {
      if (!hasConsent) return;
      trackContratarClick(buttonLabel);
    },
    [hasConsent]
  );

  /** Landing page view manual */
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

/**
 * Hook to automatically track landing page views
 * Use this ONLY inside landing pages
 */
export const useLPTracking = (lpName: LandingPageName) => {
  const location = useLocation();

  useEffect(() => {
    if (!hasTrackingConsent()) return;

    const pageType = getPageType(location.pathname);
    if (pageType === "landing_page" || pageType === "page") {
      trackLPView(lpName);
    }
  }, [lpName, location.pathname]);
};
