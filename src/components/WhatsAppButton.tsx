import { MessageCircle } from "lucide-react";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { useLocation } from "react-router-dom";
import { trackWhatsAppClick } from "@/utils/tracking";

/**
 * Floating WhatsApp CTA Button
 *
 * Rules:
 * - NEVER use api.whatsapp.com
 * - ALWAYS use wa.me
 * - Message must be URL encoded
 * - Tracking must not block navigation
 */
const WHATSAPP_BASE = "https://wa.me/5511965982251";

const WhatsAppButton = () => {
  const location = useLocation();
  const isContratarPage = location.pathname === "/contratar";

  const { getWhatsAppMessage } = useConfigurator();

  /**
   * Builds a safe WhatsApp URL
   */
  const buildWhatsAppUrl = () => {
    if (isContratarPage) {
      try {
        const message = getWhatsAppMessage();

        if (message && message.trim().length > 0) {
          return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
        }
      } catch {
        // fallback silencioso
      }
    }

    return WHATSAPP_BASE;
  };

  const handleClick = () => {
    // Tracking LGPD-safe (não bloqueia navegação)
    trackWhatsAppClick("floating_button");
  };

  return (
    <a
      href={buildWhatsAppUrl()}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#FF731D] text-white p-4 rounded-full shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300 group"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle
        size={28}
        className="group-hover:rotate-12 transition-transform"
      />
    </a>
  );
};

export default WhatsAppButton;
