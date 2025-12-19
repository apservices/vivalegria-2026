import { Navigate } from "react-router-dom";
import { useEffect, useState, forwardRef } from "react";
import { supabase } from "@/integrations/supabase/client";

type Role = "admin" | "casting" | "recreador";

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

const RoleGuard = forwardRef<HTMLDivElement, RoleGuardProps>(
  ({ allowedRoles, children }, ref) => {
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    useEffect(() => {
      const checkRole = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setHasAccess(false);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error || !data) {
          setHasAccess(false);
        } else {
          setHasAccess(allowedRoles.includes(data.role as Role));
        }

        setLoading(false);
      };

      checkRole();
    }, [allowedRoles]);

    if (loading) {
      return (
        <div ref={ref} className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (hasAccess === false) {
      return <Navigate to="/admin/login" replace />;
    }

    return <div ref={ref}>{children}</div>;
  }
);

RoleGuard.displayName = "RoleGuard";

export default RoleGuard;
