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

type ConsentStatus = 'granted' | 'denied';

interface ConsentState {
  ad_storage: ConsentStatus;
  analytics_storage: ConsentStatus;
  functionality_storage: ConsentStatus;
  security_storage: ConsentStatus;
  ad_user_data: ConsentStatus;
  ad_personalization: ConsentStatus;
}

type PageType = 'home' | 'landing_page' | 'admin' | 'page' | 'form';
type FormType = 'orcamento' | 'contratar' | 'contato' | 'candidatura' | 'avaliacao' | 'pesquisa';
type WhatsAppSource = 'header' | 'footer' | 'floating_button' | 'landing_page' | 'form' | 'page';
type LandingPageName = 'festa-infantil' | 'recreacao-infantil-sp' | 'corporativo' | 'orcamento' | 'pacotes' | 'oficinas';

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

type TrackingPayload = WhatsAppClickPayload | FormSubmitPayload | ContratarClickPayload | LPViewPayload;

// ============================================
// GLOBAL TYPE DECLARATIONS
// ============================================

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
    gtag_report_conversion?: (url?: string) => boolean;
  }
}

// ============================================
// CONSENT STATE MANAGEMENT
// ============================================

const CONSENT_STORAGE_KEY = 'cookie-consent';

/**
 * Check if user has given consent for tracking
 * Reads from localStorage where CookieConsent component stores the decision
 */
export const hasTrackingConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
  return consent === 'accepted';
};

/**
 * Get the current consent state for Consent Mode v2
 */
const getConsentState = (): ConsentState => {
  const hasConsent = hasTrackingConsent();
  const status: ConsentStatus = hasConsent ? 'granted' : 'denied';
  
  return {
    ad_storage: status,
    analytics_storage: status,
    functionality_storage: status,
    security_storage: 'granted', // Security storage is always granted
    ad_user_data: status,
    ad_personalization: status,
  };
};

// ============================================
// CONSENT MODE v2 INITIALIZATION
// ============================================

/**
 * Initialize Google Consent Mode v2
 * MUST be called before any gtag config
 * Sets default state to denied for LGPD compliance
 */
export const initConsentMode = (): void => {
  if (typeof window === 'undefined') return;
  
  // Ensure dataLayer exists
  window.dataLayer = window.dataLayer || [];
  
  // Define gtag function if not exists
  if (typeof window.gtag !== 'function') {
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
  }

  // Set default consent state to denied (LGPD compliant)
  // This MUST happen before any gtag('config', ...) calls
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    security_storage: 'granted',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500, // Wait 500ms for consent update
  });

  // Check if user already has consent stored and update accordingly
  if (hasTrackingConsent()) {
    updateConsent(true);
  }
};

/**
 * Update consent state after user makes a choice
 * Called by CookieConsent component when user accepts or rejects
 */
export const updateConsent = (accepted: boolean): void => {
  if (typeof window === 'undefined') return;
  
  const status: ConsentStatus = accepted ? 'granted' : 'denied';
  
  // Update Google Consent Mode
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      ad_storage: status,
      analytics_storage: status,
      functionality_storage: status,
      ad_user_data: status,
      ad_personalization: status,
    });
  }

  // For Meta Pixel: revoke consent if denied
  // Note: fbq doesn't have native consent mode, so we control firing manually
  if (!accepted && typeof window.fbq === 'function') {
    window.fbq('consent', 'revoke');
  } else if (accepted && typeof window.fbq === 'function') {
    window.fbq('consent', 'grant');
  }
};

// ============================================
// PAGE TYPE DETECTION
// ============================================

/**
 * Determine the page type based on current path
 */
export const getPageType = (pathname?: string): PageType => {
  const path = pathname || (typeof window !== 'undefined' ? window.location.pathname : '/');
  
  if (path === '/') return 'home';
  if (path.startsWith('/admin')) return 'admin';
  if (
    path.startsWith('/festa-infantil') ||
    path.startsWith('/orcamento-lp') ||
    path.startsWith('/corporativo')
  ) return 'landing_page';
  if (
    path.startsWith('/contratar') ||
    path.startsWith('/contato') ||
    path.startsWith('/trabalhe-conosco')
  ) return 'form';
  
  return 'page';
};

// ============================================
// UNIFIED TRACKING FUNCTION
// ============================================

/**
 * Main tracking function - sends events to all platforms
 * 
 * LGPD COMPLIANCE:
 * - Checks consent before sending any tracking data
 * - If no consent, event is silently dropped
 * - This ensures NO data is collected before explicit user consent
 * 
 * @param eventName - Name of the event (e.g., 'whatsapp_click')
 * @param payload - Event-specific data
 */
export const trackEvent = (
  eventName: 'whatsapp_click' | 'form_submit' | 'contratar_click' | 'lp_view',
  payload: TrackingPayload
): void => {
  // LGPD GUARD: Never fire events without consent
  if (!hasTrackingConsent()) {
    console.debug('[Tracking] Event blocked - no consent:', eventName);
    return;
  }

  const eventData = {
    ...payload,
    timestamp: new Date().toISOString(),
  };

  // ---- GA4 ----
  // Sends event to Google Analytics 4
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventData);
  }

  // ---- Google Ads ----
  // For conversion events, also send to Google Ads
  if (typeof window.gtag === 'function') {
    // Map events to Google Ads conversion actions
    const conversionMap: Record<string, string> = {
      whatsapp_click: 'AW-17048161741/01bMCNXdiNEbEM2bmcE_', // WhatsApp conversion
      form_submit: 'AW-17048161741/form_submit', // Configure in Google Ads
      contratar_click: 'AW-17048161741/contratar_click', // Configure in Google Ads
    };

    const conversionId = conversionMap[eventName];
    if (conversionId) {
      window.gtag('event', 'conversion', {
        send_to: conversionId,
        ...eventData,
      });
    }
  }

  // ---- Meta Pixel ----
  // Sends event to Facebook/Instagram Pixel
  if (typeof window.fbq === 'function') {
    // Map events to Meta standard/custom events
    const metaEventMap: Record<string, string> = {
      whatsapp_click: 'Contact',
      form_submit: 'Lead',
      contratar_click: 'InitiateCheckout',
      lp_view: 'ViewContent',
    };

    const metaEventName = metaEventMap[eventName] || eventName;
    window.fbq('track', metaEventName, eventData);
  }

  console.debug('[Tracking] Event sent:', eventName, eventData);
};

// ============================================
// SPECIALIZED TRACKING FUNCTIONS
// ============================================

/**
 * Track WhatsApp button clicks
 * 
 * WHEN: User clicks any WhatsApp CTA button
 * WHERE: Header, footer, floating button, landing pages
 * WHY SAFE: Only fires after consent check in trackEvent
 */
export const trackWhatsAppClick = (source: WhatsAppSource): void => {
  const payload: WhatsAppClickPayload = {
    page_path: window.location.pathname,
    page_type: getPageType(),
    source,
  };
  trackEvent('whatsapp_click', payload);
};

/**
 * Track form submissions
 * 
 * WHEN: User successfully submits any lead form
 * WHERE: Contratar, Contato, Trabalhe Conosco pages
 * WHY SAFE: Only fires after consent check in trackEvent
 */
export const trackFormSubmit = (formType: FormType): void => {
  const payload: FormSubmitPayload = {
    form_type: formType,
    page_path: window.location.pathname,
    page_type: getPageType(),
  };
  trackEvent('form_submit', payload);
};

/**
 * Track CTA button clicks (Contratar, Simular, Orçamento)
 * 
 * WHEN: User clicks primary conversion CTA
 * WHERE: Any page with conversion CTAs
 * WHY SAFE: Only fires after consent check in trackEvent
 */
export const trackContratarClick = (buttonLabel: string): void => {
  const payload: ContratarClickPayload = {
    page_path: window.location.pathname,
    page_type: getPageType(),
    button_label: buttonLabel,
  };
  trackEvent('contratar_click', payload);
};

/**
 * Track landing page views
 * 
 * WHEN: User views any landing page
 * WHERE: /festa-infantil, /orcamento-lp, /corporativo, etc.
 * WHY SAFE: Only fires after consent check in trackEvent
 */
export const trackLPView = (lpName: LandingPageName): void => {
  const payload: LPViewPayload = {
    lp_name: lpName,
    page_path: window.location.pathname,
  };
  trackEvent('lp_view', payload);
};

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize tracking system
 * Call this once at app startup (in main.tsx or App.tsx)
 */
export const initTracking = (): void => {
  if (typeof window === 'undefined') return;
  
  // Initialize Consent Mode v2 first
  initConsentMode();
  
  console.debug('[Tracking] System initialized with Consent Mode v2');
};
