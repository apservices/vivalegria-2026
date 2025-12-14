import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cookie } from "lucide-react";
import { Link } from "react-router-dom";
const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);
  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };
  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
  };
  if (!showBanner) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <Card className="max-w-4xl mx-auto p-6 shadow-hover border-2">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-shrink-0">
            <Cookie className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Cookies e Privacidade</h3>
            <p className="text-sm text-muted-foreground">
              Usamos cookies para melhorar sua experiÃªncia em nosso site. Ao continuar navegando, 
              vocÃª concorda com nossa{" "}
              <Link to="/privacidade" className="text-primary hover:underline">
                PolÃ­tica de Privacidade
              </Link>
              .
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              onClick={declineCookies}
              variant="outline"
              className="rounded-full flex-1 md:flex-none"
            >
              Recusar
            </Button>
            <Button
              onClick={acceptCookies}
              className="rounded-full flex-1 md:flex-none"
            >
              Aceitar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default CookieConsent;
