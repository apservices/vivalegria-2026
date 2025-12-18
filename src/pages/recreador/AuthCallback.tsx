import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function RecreadorAuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMagicLink = async () => {
      try {
        // 1️⃣ Processa o magic link - usa getSession que detecta automaticamente
        const { data: sessionData, error } = await supabase.auth.getSession();

        if (error || !sessionData?.session) {
          setError("Link inválido ou expirado.");
          return;
        }

        const user = sessionData.session.user;

        // 2️⃣ Buscar roles reais no banco via user_roles table
        const { data: rolesData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        if (roleError) {
          console.error("Erro ao buscar roles:", roleError);
          setError("Erro ao validar permissões.");
          return;
        }

        const roles = rolesData?.map(r => r.role) || [];

        // 3️⃣ Redirecionamento por role
        if (roles.includes("admin")) {
          navigate("/admin", { replace: true });
          return;
        }

        if (roles.includes("casting")) {
          navigate("/admin/casting", { replace: true });
          return;
        }

        if (roles.includes("recreador")) {
          navigate("/recreador", { replace: true });
          return;
        }

        // 4️⃣ Sem role válida
        setError("Usuário sem permissão de acesso.");
      } catch (err) {
        console.error("Erro inesperado:", err);
        setError("Erro inesperado ao autenticar.");
      }
    };

    handleMagicLink();
  }, [navigate]);

  // 🔄 Loading
  if (!error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Validando acesso…</p>
      </div>
    );
  }

  // ❌ Erro amigável
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-lg font-semibold mb-2">Acesso não autorizado</h1>
        <p className="text-sm text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          Voltar para o site
        </button>
      </div>
    </div>
  );
}
