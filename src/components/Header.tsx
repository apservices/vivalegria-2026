import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoVivalegria from "@/assets/logo-vivalegria-new.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/pacotes", label: "Pacotes" },
    { to: "/oficinas", label: "Oficinas" },
    { to: "/guia-para-pais", label: "Guia para Pais" },
    { to: "/quem-somos", label: "Quem Somos" },
    { to: "/corporativo", label: "Corporativo" },
    { to: "/contato", label: "Contato" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-soft py-2" : "bg-white py-4"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo - Tamanho Aumentado */}
          <Link
            to="/"
            className="flex items-center transition-transform hover:scale-105 duration-300"
          >
            <img
              src={logoVivalegria}
              alt="Vivalegria Recreação Infantil"
              // Ajustei aqui: h-16 (mobile) e h-20 (desktop) para ficar bem maior
              className="h-16 md:h-20 w-auto max-w-[220px] md:max-w-[280px] object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative ${
                  isActive(link.to)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:origin-left after:transition-transform after:duration-300 ${
                  isActive(link.to)
                    ? "after:scale-x-100"
                    : "hover:after:scale-x-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button
              asChild
              size="lg"
              className="rounded-full shadow-soft hover:shadow-hover"
            >
              <Link to="/contratar">Contratar Agora</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-fade-in mt-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? "text-primary bg-primary/5"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="px-4 pt-4">
              <Button asChild size="lg" className="w-full rounded-full">
                <Link to="/contratar">Contratar Agora</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
