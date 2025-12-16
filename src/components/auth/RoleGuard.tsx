import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Role = "admin" | "casting" | "recreador";

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null); // Define null initially for better control.

  useEffect(() => {
    const checkRole = async () => {
      // 1. Verificar o usuário autenticado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      // 2. Buscar a role do usuário
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        setHasAccess(false); // Se houver erro ou não encontrar dados, negar acesso
      } else {
        // 3. Validar se a role está nas roles permitidas
        setHasAccess(allowedRoles.includes(data.role as Role));
      }

      setLoading(false); // Finalizar loading
    };

    checkRole();
  }, [allowedRoles]);

  // 4. Carregando / Loading spinner
  if (loading) {
    return <div className="p-6 text-center">Carregando…</div>;
  }

  // 5. Redirecionamento se não tiver acesso
  if (hasAccess === false) {
    return <Navigate to="/login" replace />;
  }

  // 6. Se tiver acesso, exibe os filhos
  return <>{children}</>;
}
