import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Ao trocar de rota, rola a janela para o topo.
 * Preserva o comportamento de âncora (#hash) — nesse caso não força topo,
 * deixando a página de destino cuidar do scroll até o elemento.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
