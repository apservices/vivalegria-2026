import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import logoVivalegria from "@/assets/logo-vivalegria-new.png";

export default function RecreadorLogin() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signInRecreadorMagic, sendPasswordReset } = useAuth();

  // Forgot password
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInRecreadorMagic(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Erro ao enviar link de acesso");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full p-8 bg-white rounded-xl shadow text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Link enviado!</h2>
          <p className="text-sm text-muted-foreground">
            Se o e-mail estiver cadastrado, você receberá um link de acesso ao portal do recreador.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow">
        <div className="text-center mb-6">
          <img src={logoVivalegria} alt="Vivalegria" className="h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-orange-600">
            Portal do Recreador
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Acesse com seu e-mail cadastrado
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seuemail@exemplo.com"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar link de acesso"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button
            type="button"
            variant="link"
            className="text-sm"
            onClick={() => {
              setForgotEmail(email);
              setShowForgotPassword(true);
              setForgotSent(false);
              setForgotError("");
            }}
          >
            Esqueci minha senha
          </Button>
        </div>
      </div>

      {/* Modal de recuperação de senha */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recuperar senha</DialogTitle>
            <DialogDescription>
              Digite seu e-mail para receber um link de redefinição de senha.
            </DialogDescription>
          </DialogHeader>

          {forgotSent ? (
            <div className="text-center py-4">
              <p className="text-green-600 font-medium mb-2">Link enviado!</p>
              <p className="text-sm text-muted-foreground">
                Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.
              </p>
              <Button
                className="mt-4"
                onClick={() => setShowForgotPassword(false)}
              >
                Fechar
              </Button>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setForgotError("");
                setForgotLoading(true);
                try {
                  await sendPasswordReset(forgotEmail.trim());
                  setForgotSent(true);
                } catch (err: any) {
                  setForgotError(err.message || "Erro ao enviar link. Tente novamente.");
                } finally {
                  setForgotLoading(false);
                }
              }}
              className="space-y-4"
            >
              {forgotError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{forgotError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="forgot-email">E-mail</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={forgotLoading}>
                  {forgotLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar link"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
