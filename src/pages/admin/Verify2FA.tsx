import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import logoVivalegria from "@/assets/logo-vivalegria-new.png";

const Verify2FA = () => {
  const navigate = useNavigate();
  
  const [code, setCode] = useState("");
  const [factorId, setFactorId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkMFAStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/admin/login");
          return;
        }

        // Get MFA factors
        const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
        
        if (factorsError) {
          console.error('Error listing factors:', factorsError);
          navigate("/admin/login");
          return;
        }

        // Find verified TOTP factor
        const verifiedTOTP = factors?.totp?.find(f => f.status === 'verified');
        
        if (!verifiedTOTP) {
          // No verified 2FA, need to set up
          navigate("/admin/setup-2fa");
          return;
        }

        setFactorId(verifiedTOTP.id);
      } catch (err) {
        console.error('Check MFA error:', err);
        navigate("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkMFAStatus();
  }, [navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      // Create challenge
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) {
        setError("Erro ao criar desafio. Tente novamente.");
        setIsVerifying(false);
        return;
      }

      // Verify the code
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
      });

      if (verifyError) {
        setError("Código inválido. Verifique e tente novamente.");
        setCode("");
        setIsVerifying(false);
        return;
      }

      // Success - redirect to admin
      navigate("/admin");
    } catch (err) {
      setError("Erro ao verificar código.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFD836]/10 via-white to-white p-4">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <img src={logoVivalegria} alt="Vivalegria" className="h-10 mx-auto mb-4" />
          <Shield className="w-12 h-12 text-primary mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Verificação 2FA</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Digite o código do seu app de autenticação
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code">Código de 6 dígitos</Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="text-center text-2xl tracking-widest"
              autoComplete="one-time-code"
              autoFocus
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={code.length !== 6 || isVerifying}
          >
            {isVerifying ? "Verificando..." : "Verificar"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={handleLogout} className="text-muted-foreground">
            Sair e fazer login com outra conta
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Verify2FA;
