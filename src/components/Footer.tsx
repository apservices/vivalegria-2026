import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navegacao = [
    { label: "Home", href: "/" },
    { label: "Pacotes", href: "/pacotes" },
    { label: "Oficinas Criativas", href: "/oficinas" },
    { label: "Quem Somos", href: "/quem-somos" },
    { label: "Eventos Corporativos", href: "/corporativo" },
    { label: "Trabalhe Conosco", href: "/trabalhe-conosco" },
  ];

  const regioes = [
    "Vila Mariana",
    "Moema",
    "Santo Amaro",
    "Morumbi",
    "Pinheiros",
    "Jardins",
    "ABC Paulista",
    "+ toda São Paulo e região",
  ];

  const handleWhatsApp = () => {
    window.open(
      "https://wa.me/5511965982251?text=Olá! Gostaria de saber mais sobre os serviços da Vivalegria.",
      "_blank"
    );
  };

  return (
    <footer className="w-full">
      {/* CTA Section */}
      <section className="bg-gradient-warm py-16 px-4">
        <div className="container mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            Pronto para criar memórias inesquecíveis?
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Entre em contato e vamos planejar juntos o evento perfeito para você!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
            >
              <Link to="/contratar">Solicitar orçamento</Link>
            </Button>
            <Button
              onClick={handleWhatsApp}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 font-semibold px-8"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="bg-foreground text-background py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Coluna 1 - Logo e Descrição */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-secondary">
                🎉 Vivalegria Recreação Infantil
              </h3>
              <p className="text-sm text-background/80 leading-relaxed">
                Transformando festas em experiências inesquecíveis desde 2015. 
                Recreação infantil premium em São Paulo.
              </p>
            </div>

            {/* Coluna 2 - Navegação */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-secondary">Navegação</h4>
              <nav className="flex flex-col space-y-2">
                {navegacao.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-sm text-background/80 hover:text-secondary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Coluna 3 - Onde Atendemos */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-secondary">Onde Atendemos</h4>
              <ul className="space-y-2">
                {regioes.map((regiao) => (
                  <li key={regiao} className="text-sm text-background/80">
                    {regiao}
                  </li>
                ))}
              </ul>
            </div>

            {/* Coluna 4 - Contato */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-secondary">Contato</h4>
              <address className="not-italic space-y-3 text-sm text-background/80">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
                  <span>
                    Vivalegria Recreação Infantil<br />
                    São Paulo - SP<br />
                    Atendemos toda a região metropolitana
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                  <a 
                    href="tel:+5511965982251" 
                    className="hover:text-secondary transition-colors"
                  >
                    (11) 96598-2251
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                  <a 
                    href="mailto:contato@vivalegria.com.br"
                    className="hover:text-secondary transition-colors"
                  >
                    contato@vivalegria.com.br
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
                  <span>
                    Seg a Sex: 9h–18h<br />
                    Sáb: 9h–12h
                  </span>
                </div>
              </address>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-foreground border-t border-background/10 py-6 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/70">
            <p>
              © {currentYear} Vivalegria Recreação Infantil. Todos os direitos reservados.
            </p>
            <p className="text-center">
              Recreação infantil em São Paulo • Vila Mariana • Moema • ABC
            </p>
            <div className="flex gap-4">
              <Link 
                to="/privacidade" 
                className="hover:text-secondary transition-colors"
              >
                Política de Privacidade
              </Link>
              <span>•</span>
              <Link 
                to="/termos" 
                className="hover:text-secondary transition-colors"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
