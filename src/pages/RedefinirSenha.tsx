import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import logoVivalegria from "@/assets/logo-vivalegria-new.png";

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const { updatePassword, user, isLoading } = useAuth();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wait for auth to be ready - Supabase processes the token from URL automatically
  useEffect(() => {
    if (!isLoading && !user) {
      // No user after loading = invalid or expired token
      setError("Link inválido ou expirado. Solicite um novo link de redefinição de senha.");
    }
  }, [isLoading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updatePassword(password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar senha. Tente novamente.");
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-white p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Senha alterada!</h1>
          <p className="text-muted-foreground mb-6">
            Sua senha foi atualizada com sucesso.
          </p>
          <Button onClick={() => navigate("/admin/login")} className="w-full">
            Ir para o login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFD836]/10 via-white to-white p-4">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <img src={logoVivalegria} alt="Vivalegria" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Redefinir Senha</h1>
          <p className="text-muted-foreground">Digite sua nova senha</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!user && !isLoading ? (
          <div className="text-center">
            <Button variant="outline" onClick={() => navigate("/admin/login")}>
              Voltar para o login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => navigate("/")}>
            ← Voltar para o site
          </Button>
        </div>
      </Card>
    </div>
  );
}
