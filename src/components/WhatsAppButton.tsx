import { MessageCircle } from "lucide-react";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { useLocation } from "react-router-dom";
import { trackWhatsAppClick } from "@/utils/tracking";

/**
 * Floating WhatsApp CTA Button
 *
 * Regras:
 * - NUNCA usar api.whatsapp.com
 * - SEMPRE usar wa.me
 * - Mensagem deve ser URL encoded
 * - Tracking não pode bloquear a navegação
 */
const WHATSAPP_BASE = "https://wa.me/5511965982251";

const WhatsAppButton = () => {
  const location = useLocation();
  const isContratarPage = location.pathname === "/contratar";

  const { getWhatsAppMessage } = useConfigurator();

  /**
   * Monta uma URL segura do WhatsApp
   */
  const buildWhatsAppUrl = () => {
    try {
      if (isContratarPage && typeof getWhatsAppMessage === "function") {
        const message = getWhatsAppMessage();

        if (message && typeof message === "string" && message.trim().length > 0) {
          return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
        }
      }
    } catch (error) {
      // fallback silencioso, sem quebrar o botão
      console.error("Erro ao montar mensagem do WhatsApp:", error);
    }

    return WHATSAPP_BASE;
  };

  const handleClick = () => {
    try {
      // Tracking LGPD-safe (não bloqueia navegação)
      // Não deve chamar preventDefault, nem ser async bloqueante
      trackWhatsAppClick?.("floating_button");
    } catch (error) {
      // Nunca deixar tracking quebrar o fluxo do usuário
      console.error("Erro no tracking de WhatsApp:", error);
    }
  };

  const whatsappUrl = buildWhatsAppUrl();

  return (
    <a
      href={whatsappUrl}
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
