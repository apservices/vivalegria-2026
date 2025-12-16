import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Pacotes", path: "/pacotes" },
    { label: "Oficinas", path: "/oficinas" },
    { label: "Quem Somos", path: "/quem-somos" },
    { label: "Corporativo", path: "/corporativo" },
    { label: "Contato", path: "/contato" },
    { label: "Contratar", path: "/contratar" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* LOGO */}
            <Link to="/" className="flex items-center">
              <img
                src="/assets/vivalegria-logo.png"
                alt="Vivalegria"
                className="h-9 w-auto"
              />
            </Link>

            {/* MENU DESKTOP */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm font-medium text-gray-700 hover:text-orange-600"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex gap-2">
              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Link to="/contratar">Contratar</Link>
              </Button>
            </div>

            {/* MOBILE */}
            <button
              className="md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MENU MOBILE */}
        {open && (
          <div className="md:hidden bg-white border-t">
            <nav className="flex flex-col px-4 py-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="py-2 text-gray-700 hover:text-orange-600"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* ESPAÇADOR */}
      <div className="h-16" />
    </>
  );
}
