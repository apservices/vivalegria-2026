import React from "react";

export default function Footer() {
  return (
    <footer className="w-full py-4 border-t mt-8">
      <div className="container mx-auto text-sm text-center text-muted-foreground">
        © {new Date().getFullYear()} Vivalegria. Todos os direitos reservados.
      </div>
    </footer>
  );
}
