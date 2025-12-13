import { MessageCircle } from "lucide-react";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { useLocation } from "react-router-dom";

// Adicionamos isso para o TypeScript reconhecer a função que está no index.html
declare global {
  interface Window {
    gtag_report_conversion?: (url?: string) => boolean;
  }
}

const WhatsAppButton = () => {
  const location = useLocation();
  const isContratarPage = location.pathname === "/contratar";

  // Use configurator context if on contratar page, otherwise default link
  const { getWhatsAppMessage } = useConfigurator();

  const href = isContratarPage 
    ? getWhatsAppMessage() 
    : "https://wa.me/5511965982251";

  const handleClick = () => {
    // Verifica se a função de conversão existe e dispara o evento.
    // Passamos 'undefined' para que o script do Google APENAS registre a conversão
    // e não tente redirecionar a página, deixando o target="_blank" funcionar.
    if (typeof window.gtag_report_conversion === 'function') {
      window.gtag_report_conversion(undefined);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#FF731D] text-white p-4 rounded-full shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300 group"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
    </a>
  );
};

export default WhatsAppButton;
