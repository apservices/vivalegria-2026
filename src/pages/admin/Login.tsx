import { useState, useEffect } from "react";
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
  const { user, isAdmin, isLoading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      navigate("/admin");
    }
  }, [user, isAdmin, isLoading, navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        if (signInError.message.includes("Invalid login")) {
          setError("E-mail ou senha incorretos.");
        } else {
          setError("Erro ao fazer login. Tente novamente.");
        }
        return;
      }
      // Wait a bit for auth state to update and check admin role
      setTimeout(async () => {
        // The auth context will handle the redirect
      }, 500);
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Acesso Negado</h1>
          <p className="text-muted-foreground mb-4">
            Sua conta nÃ£o possui permissÃµes de administrador.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Voltar para o site
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
          <h1 className="text-2xl font-bold">Ãrea Administrativa</h1>
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
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                className="pl-10"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => navigate("/")}>
            â† Voltar para o site
          </Button>
        </div>
      </Card>
    </div>
  );
};
export default AdminLogin;
