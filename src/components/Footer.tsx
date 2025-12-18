import React from "react";

export default function Footer() {
  return (
    <footer className="w-full py-6 border-t mt-12 bg-background">
      <div className="container mx-auto px-4 text-center space-y-2 text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} <strong>Vivalegria Recreação Infantil</strong>.  
          Todos os direitos reservados.
        </p>

        <p className="text-xs">
          Recreação infantil premium para festas, eventos corporativos e experiências inesquecíveis em São Paulo.
        </p>
      </div>
    </footer>
  );
}
