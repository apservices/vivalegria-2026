import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RecreadorLogin() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInRecreadorMagic } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInRecreadorMagic(email);
      setSent(true);
    } catch (err: any) {
      alert("Erro ao enviar link de acesso: " + (err.message ?? ""));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-xl shadow">
          <h2 className="text-xl font-bold mb-2">Link enviado</h2>
          <p className="text-sm text-gray-600">
            Se o e-mail estiver cadastrado, você receberá um link de acesso ao portal do recreador.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-center text-orange-600">
          Portal do Recreador
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">E-mail</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seuemail@exemplo.com"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar link de acesso"}
          </Button>
        </form>
      </div>
    </div>
  );
}
