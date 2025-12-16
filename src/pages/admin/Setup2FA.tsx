import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Copy, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logoVivalegria from "@/assets/logo-vivalegria-new.png";

const Setup2FA = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [factorId, setFactorId] = useState<string>("");
  const [verifyCode, setVerifyCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const setupMFA = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/admin/login");
          return;
        }

        // Check if user already has TOTP enrolled
        const { data: factors } = await supabase.auth.mfa.listFactors();
        
        if (factors?.totp && factors.totp.length > 0) {
          const verifiedFactor = factors.totp.find(f => f.status === 'verified');
          if (verifiedFactor) {
            // Already has verified 2FA, redirect to admin
            navigate("/admin");
            return;
          }
        }

        // Enroll new TOTP factor
        const { data, error: enrollError } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
          friendlyName: 'Vivalegria Admin'
        });

        if (enrollError) {
          console.error('MFA enroll error:', enrollError);
          setError("Erro ao configurar 2FA. Tente novamente.");
          setIsLoading(false);
          return;
        }

        if (data) {
          setQrCode(data.totp.qr_code);
          setSecret(data.totp.secret);
          setFactorId(data.id);
        }
      } catch (err) {
        console.error('Setup MFA error:', err);
        setError("Erro ao configurar 2FA.");
      } finally {
        setIsLoading(false);
      }
    };

    setupMFA();
  }, [navigate]);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Código copiado!",
      description: "Cole no seu app de autenticação.",
    });
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) {
        setError("Erro ao criar desafio. Tente novamente.");
        setIsVerifying(false);
        return;
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: verifyCode,
      });

      if (verifyError) {
        setError("Código inválido. Verifique e tente novamente.");
        setIsVerifying(false);
        return;
      }

      toast({
        title: "2FA ativado com sucesso!",
        description: "Sua conta agora está mais segura.",
      });

      navigate("/admin");
    } catch (err) {
      setError("Erro ao verificar código.");
    } finally {
      setIsVerifying(false);
    }
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
          <h1 className="text-2xl font-bold">Configurar 2FA</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Autenticação de dois fatores obrigatória
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              1. Escaneie o QR Code com seu app de autenticação (Google Authenticator, Authy, etc.)
            </p>
            
            {qrCode && (
              <div className="flex justify-center mb-4">
                <img 
                  src={qrCode} 
                  alt="QR Code para 2FA" 
                  className="w-48 h-48 border rounded-lg"
                />
              </div>
            )}

            <div className="text-sm text-muted-foreground mb-2">
              Ou insira o código manualmente:
            </div>
            
            <div className="flex items-center justify-center gap-2 bg-muted p-2 rounded-lg">
              <code className="text-xs font-mono break-all">{secret}</code>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopySecret}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">
                2. Digite o código de 6 dígitos do app
              </Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="text-center text-2xl tracking-widest"
                autoComplete="one-time-code"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={verifyCode.length !== 6 || isVerifying}
            >
              {isVerifying ? "Verificando..." : "Ativar 2FA"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center">
            Guarde o código secreto em local seguro. Você precisará dele para recuperar o acesso caso perca o dispositivo.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Setup2FA;
