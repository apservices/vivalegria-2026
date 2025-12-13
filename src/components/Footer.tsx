import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import logoVivalegria from "@/assets/logo-vivalegria-new.png";

const Footer = () => {
  return (
    <footer className="bg-[#FFF8E6] border-t border-[#FFD836]/30">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="space-y-5">
            <img
              src={logoVivalegria}
              alt="Vivalegria RecreaÃƒÂ§ÃƒÂ£o Infantil"
              className="h-12 w-auto"
            />

            <p className="text-sm text-muted-foreground leading-relaxed">
              Transformando festas em experiÃƒÂªncias inesquecÃƒÂ­veis desde 2015.
              RecreaÃƒÂ§ÃƒÂ£o infantil premium em SÃƒÂ£o Paulo.
            </p>

            <div className="flex space-x-3">
              <a
                href="https://www.instagram.com/vivalegria_/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-[#FFD836] hover:bg-[#FF731D] hover:text-white transition-all duration-300"
                aria-label="Instagram Vivalegria"
              >
                <Instagram size={20} />
              </a>

              <a
                href="https://www.facebook.com/vivalegriarecreacao"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-[#FFD836] hover:bg-[#FF731D] hover:text-white transition-all duration-300"
                aria-label="Facebook Vivalegria"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-5 text-foreground">NavegaÃƒÂ§ÃƒÂ£o</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-[#FF731D] transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/pacotes"
                  className="text-sm text-muted-foreground hover:text-[#FF731D] transition-colors duration-300"
                >
                  Pacotes
                </Link>
              </li>
              <li>
                <Link
                  to="/oficinas"
                  className="text-sm text-muted-foreground hover:text-[#FF731D] transition-colors duration-300"
                >
                  Oficinas Criativas
                </Link>
              </li>
              <li>
                <Link
                  to="/quem-somos"
                  className="text-sm text-muted-foreground hover:text-[#FF731D] transition-colors duration-300"
                >
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link
                  to="/corporativo"
                  className="text-sm text-muted-foreground hover:text-[#FF731D] transition-colors duration-300"
                >
                  Eventos Corporativos
                </Link>
              </li>
              <li>
                <Link
                  to="/trabalhe-conosco"
                  className="text-sm text-muted-foreground hover:text-[#FF731D] transition-colors duration-300"
                >
                  Trabalhe Conosco
                </Link>
              </li>
            </ul>
          </div>

          {/* Areas Served */}
          <div>
            <h3 className="font-semibold mb-5 text-foreground">Onde Atendemos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Vila Mariana</li>
              <li>Moema</li>
              <li>Santo Amaro</li>
              <li>Morumbi</li>
              <li>Pinheiros</li>
              <li>Jardins</li>
              <li>ABC Paulista</li>
              <li className="text-primary font-medium">+ toda SÃƒÂ£o Paulo e regiÃƒÂ£o</li>
            </ul>
          </div>

          {/* Contact - NAP */}
          <div>
            <h3 className="font-semibold mb-5 text-foreground">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin
                  size={18}
                  className="mt-1 flex-shrink-0 text-[#FFD836]"
                />
                <div className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Vivalegria RecreaÃƒÂ§ÃƒÂ£o Infantil
                  </span>
                  <br />
                  SÃƒÂ£o Paulo - SP
                  <br />
                  Atendemos toda a regiÃƒÂ£o metropolitana
                </div>
              </li>

              <li className="flex items-center space-x-3 text-sm">
                <Phone size={18} className="flex-shrink-0 text-[#FFD836]" />
                <a
                  href="https://wa.me/5511965982251"
                  className="text-muted-foreground hover:text-[#FF731D] transition-colors duration-300 font-medium"
                >
                  (11) 96598-2251
                </a>
              </li>

              <li className="flex items-center space-x-3 text-sm">
                <Mail size={18} className="flex-shrink-0 text-[#FFD836]" />
                <a
                  href="mailto:contato@vivalegria.com.br"
                  className="text-muted-foreground hover:text-[#FF731D] transition-colors duration-300"
                >
                  contato@vivalegria.com.br
                </a>
              </li>
            </ul>

            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Seg a Sex: 9hÃ¢â‚¬â€œ18h
              <br />
              SÃƒÂ¡b: 9hÃ¢â‚¬â€œ12h
            </p>
          </div>
        </div>

        <div className="border-t border-[#FFD836]/30 mt-12 pt-10 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            Ã‚Â© 2026 Vivalegria RecreaÃƒÂ§ÃƒÂ£o Infantil. Todos os direitos reservados.
          </p>

          <p className="text-xs text-muted-foreground mt-2">
            RecreaÃƒÂ§ÃƒÂ£o infantil em SÃƒÂ£o Paulo Ã¢â‚¬Â¢ Vila Mariana Ã¢â‚¬Â¢ Moema Ã¢â‚¬Â¢ ABC
          </p>

          <div className="flex justify-center space-x-6 mt-4">
            <Link
              to="/privacidade"
              className="text-xs text-muted-foreground hover:text-[#FF731D] transition-colors duration-300"
            >
              PolÃƒÂ­tica de Privacidade
            </Link>
            <span className="text-xs text-muted-foreground">Ã¢â‚¬Â¢</span>
            <Link
              to="/termos"
              className="text-xs text-muted-foreground hover:text-[#FF731D] transition-colors duration-300"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
