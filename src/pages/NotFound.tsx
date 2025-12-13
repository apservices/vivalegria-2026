import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-primary">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Oops! Página não encontrada
          </h2>
          <p className="text-lg text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="pt-4">
          <Button asChild size="lg" className="rounded-full shadow-premium">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Voltar para a Home
            </Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground pt-8">
          Enquanto isso, que tal explorar nossos pacotes incríveis?
        </p>
      </div>
    </div>
  );
};

export default NotFound;
