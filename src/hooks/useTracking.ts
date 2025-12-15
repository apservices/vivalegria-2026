/**
 * React hook for tracking events
 * Provides easy access to tracking functions in React components
 */

import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  trackWhatsAppClick,
  trackFormSubmit,
  trackContratarClick,
  trackLPView,
  getPageType,
  hasTrackingConsent,
} from '@/utils/tracking';

type WhatsAppSource = 'header' | 'footer' | 'floating_button' | 'landing_page' | 'form' | 'page';
type FormType = 'orcamento' | 'contratar' | 'contato' | 'candidatura' | 'avaliacao' | 'pesquisa';
type LandingPageName = 'festa-infantil' | 'recreacao-infantil-sp' | 'corporativo' | 'orcamento' | 'pacotes' | 'oficinas';

export const useTracking = () => {
  const location = useLocation();

  // Track WhatsApp clicks
  const onWhatsAppClick = useCallback((source: WhatsAppSource) => {
    trackWhatsAppClick(source);
  }, []);

  // Track form submissions
  const onFormSubmit = useCallback((formType: FormType) => {
    trackFormSubmit(formType);
  }, []);

  // Track CTA clicks
  const onContratarClick = useCallback((buttonLabel: string) => {
    trackContratarClick(buttonLabel);
  }, []);

  // Track LP views (call manually when needed)
  const onLPView = useCallback((lpName: LandingPageName) => {
    trackLPView(lpName);
  }, []);

  // Get current page type
  const pageType = getPageType(location.pathname);

  // Check consent status
  const hasConsent = hasTrackingConsent();

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
 * Use this in landing page components
 */
export const useLPTracking = (lpName: LandingPageName) => {
  const location = useLocation();

  useEffect(() => {
    // Only track on landing pages
    const pageType = getPageType(location.pathname);
    if (pageType === 'landing_page' || pageType === 'page') {
      trackLPView(lpName);
    }
  }, [lpName, location.pathname]);
};
