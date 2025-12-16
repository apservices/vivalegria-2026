import { useEffect, useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useAuth } from "@/contexts/AuthContext";
import logoVivalegria from "@/assets/logo-vivalegria-new.png";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isCasting, isRecreador, isLoading, needsMFA, mfaVerified, signIn, checkMFAStatus } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      if (isLoading) return;
      
      if (user) {
        // Check if user needs MFA verification
        if ((isAdmin || isCasting) && needsMFA && !mfaVerified) {
          const mfaStatus = await checkMFAStatus();
          if (mfaStatus.needsSetup) {
            navigate("/admin/setup-2fa");
            return;
          }
          if (mfaStatus.needsVerify) {
            navigate("/admin/verify-2fa");
            return;
          }
        }

        // Redirect based on role
        if (isAdmin || isCasting) {
          navigate("/admin");
        } else if (isRecreador) {
          navigate("/recreador");
        }
      }
    };

    handleRedirect();
  }, [user, isAdmin, isCasting, isRecreador, isLoading, needsMFA, mfaVerified, navigate, checkMFAStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: signInError, needsMFASetup, needsMFAVerify } = await signIn(cleanEmail, password);

      if (signInError) {
        const msg = signInError.message?.toLowerCase?.() || "";

        if (msg.includes("invalid login") || msg.includes("invalid") || msg.includes("credentials")) {
          setError("E-mail ou senha incorretos.");
        } else {
          setError("Erro ao fazer login. Tente novamente.");
        }
        return;
      }

      // Handle MFA redirects
      if (needsMFASetup) {
        navigate("/admin/setup-2fa");
        return;
      }

      if (needsMFAVerify) {
        navigate("/admin/verify-2fa");
        return;
      }

      // The AuthContext will update user/isAdmin and the useEffect will handle redirect
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (user && !isAdmin && !isCasting && !isRecreador) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Acesso negado</h1>
          <p className="text-muted-foreground mb-4">
            Sua conta não possui permissões de acesso.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Voltar para o site
          </Button>
        </Card>
      </div>
    );
  }

  const canSubmit = email.trim().length > 0 && password.length > 0 && !isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFD836]/10 via-white to-white p-4">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <img src={logoVivalegria} alt="Vivalegria" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Área Administrativa</h1>
          <p className="text-muted-foreground">Acesso restrito</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vivalegria.com.br"
                className="pl-10"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full rounded-full" disabled={!canSubmit}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => navigate("/")}>
            ← Voltar para o site
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
