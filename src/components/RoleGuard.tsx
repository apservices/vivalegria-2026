import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

type Role = 'admin' | 'casting' | 'recreador';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: ReactNode;
  redirectTo?: string;
}

export const RoleGuard = ({ 
  allowedRoles, 
  children, 
  redirectTo = "/admin/login" 
}: RoleGuardProps) => {
  const { isAdmin, isCasting, isRecreador, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has any of the allowed roles
  const hasAccess = 
    (allowedRoles.includes('admin') && isAdmin) ||
    (allowedRoles.includes('casting') && isCasting) ||
    (allowedRoles.includes('recreador') && isRecreador);

  if (!hasAccess) {
    // Redirect based on role
    if (isRecreador) {
      return <Navigate to="/recreador" replace />;
    }
    if (isCasting) {
      return <Navigate to="/admin/casting" replace />;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
