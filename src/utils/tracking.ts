/**
 * VIVALEGRIA TRACKING UTILITY
 *
 * Production-grade, LGPD-compliant conversion tracking system.
 * Integrates with: GA4, Google Ads, Meta Pixel
 * Implements: Google Consent Mode v2
 *
 * IMPORTANT: No tracking fires before explicit user consent.
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

type ConsentStatus = "granted" | "denied";

interface ConsentState {
  ad_storage: ConsentStatus;
  analytics_storage: ConsentStatus;
  functionality_storage: ConsentStatus;
  security_storage: ConsentStatus;
  ad_user_data: ConsentStatus;
  ad_personalization: ConsentStatus;
}

export type PageType =
  | "home"
  | "landing_page"
  | "admin"
  | "page"
  | "form";

export type FormType =
  | "orcamento"
  | "contratar"
  | "contato"
  | "candidatura"
  | "avaliacao"
  | "pesquisa";

export type WhatsAppSource =
  | "header"
  | "footer"
  | "floating_button"
  | "landing_page"
  | "form"
  | "page"
  | "obrigado_page";

export type LandingPageName =
  | "festa-infantil"
  | "recreacao-infantil-sp"
  | "corporativo"
  | "orcamento"
  | "pacotes"
  | "oficinas";

interface WhatsAppClickPayload {
  page_path: string;
  page_type: PageType;
  source: WhatsAppSource;
}

interface FormSubmitPayload {
  form_type: FormType;
  page_path: string;
  page_type: PageType;
}

interface ContratarClickPayload {
  page_path: string;
  page_type: PageType;
  button_label: string;
}

interface LPViewPayload {
  lp_name: LandingPageName;
  page_path: string;
}

type TrackingPayload =
  | WhatsAppClickPayload
  | FormSubmitPayload
  | ContratarClickPayload
  | LPViewPayload;

// ============================================
// GLOBAL DECLARATIONS
// ============================================

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    gtag_report_conversion?: (url?: string) => boolean;
  }
}

// ============================================
// ENV & PLATFORM GUARDS
// ============================================

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

/**
 * Check if Meta Pixel can be safely used
 */
const canUseMetaPixel = (): boolean => {
  return Boolean(
    META_PIXEL_ID &&
      typeof window !== "undefined" &&
      typeof window.fbq === "function"
  );
};

// ============================================
// CONSENT STATE MANAGEMENT
// ============================================

const CONSENT_STORAGE_KEY = "cookie-consent";

export const hasTrackingConsent = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_STORAGE_KEY) === "accepted";
};

const getConsentState = (): ConsentState => {
  const status: ConsentStatus = hasTrackingConsent()
    ? "granted"
    : "denied";

  return {
    ad_storage: status,
    analytics_storage: status,
    functionality_storage: status,
    security_storage: "granted",
    ad_user_data: status,
    ad_personalization: status,
  };
};

// ============================================
// CONSENT MODE v2
// ============================================

export const initConsentMode = (): void => {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag !== "function") {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }

  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    security_storage: "granted",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });

  if (hasTrackingConsent()) {
    updateConsent(true);
  }
};

export const updateConsent = (accepted: boolean): void => {
  if (typeof window === "undefined") return;

  const status: ConsentStatus = accepted ? "granted" : "denied";

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: status,
      analytics_storage: status,
      functionality_storage: status,
      ad_user_data: status,
      ad_personalization: status,
    });
  }

  // 🔒 Meta Pixel guarded by Pixel ID
  if (canUseMetaPixel()) {
    window.fbq!("consent", accepted ? "grant" : "revoke");
  }
};

// ============================================
// PAGE TYPE
// ============================================

export const getPageType = (pathname?: string): PageType => {
  const path =
    pathname ||
    (typeof window !== "undefined" ? window.location.pathname : "/");

  if (path === "/") return "home";
  if (path.startsWith("/admin")) return "admin";
  if (
    path.startsWith("/festa-infantil") ||
    path.startsWith("/orcamento-lp") ||
    path.startsWith("/corporativo")
  )
    return "landing_page";
  if (
    path.startsWith("/contratar") ||
    path.startsWith("/contato") ||
    path.startsWith("/trabalhe-conosco")
  )
    return "form";

  return "page";
};

// ============================================
// UNIFIED TRACKING
// ============================================

export const trackEvent = (
  eventName:
    | "whatsapp_click"
    | "form_submit"
    | "contratar_click"
    | "lp_view",
  payload: TrackingPayload
): void => {
  if (!hasTrackingConsent()) return;

  const eventData = {
    ...payload,
    timestamp: new Date().toISOString(),
  };

  // GA4
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventData);
  }

  // Google Ads
  if (typeof window.gtag === "function") {
    const conversionMap: Record<string, string> = {
      whatsapp_click: "AW-17048161741/01bMCNXdiNEbEM2bmcE_",
      form_submit: "AW-17048161741/form_submit",
      contratar_click: "AW-17048161741/contratar_click",
    };

    const conversionId = conversionMap[eventName];
    if (conversionId) {
      window.gtag("event", "conversion", {
        send_to: conversionId,
        ...eventData,
      });
    }
  }

  // 🔒 Meta Pixel (100% safe)
  if (canUseMetaPixel()) {
    const metaEventMap: Record<string, string> = {
      whatsapp_click: "Contact",
      form_submit: "Lead",
      contratar_click: "InitiateCheckout",
      lp_view: "ViewContent",
    };

    window.fbq!("track", metaEventMap[eventName], eventData);
  }
};

// ============================================
// SPECIALIZED HELPERS
// ============================================

export const trackWhatsAppClick = (source: WhatsAppSource): void => {
  trackEvent("whatsapp_click", {
    page_path: window.location.pathname,
    page_type: getPageType(),
    source,
  });
};

export const trackFormSubmit = (formType: FormType): void => {
  trackEvent("form_submit", {
    form_type: formType,
    page_path: window.location.pathname,
    page_type: getPageType(),
  });
};

export const trackContratarClick = (buttonLabel: string): void => {
  trackEvent("contratar_click", {
    page_path: window.location.pathname,
    page_type: getPageType(),
    button_label: buttonLabel,
  });
};

export const trackLPView = (lpName: LandingPageName): void => {
  trackEvent("lp_view", {
    lp_name: lpName,
    page_path: window.location.pathname,
  });
};

// ============================================
// INIT
// ============================================

export const initTracking = (): void => {
  if (typeof window === "undefined") return;
  initConsentMode();
  console.debug("[Tracking] Initialized safely");
};
