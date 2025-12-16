import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  LogOut, 
  Home, 
  UserCheck, 
  Star, 
  DollarSign,
  Settings,
  Kanban,
  Clock,
  AlertTriangle,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logoVivalegria from "@/assets/logo-vivalegria-new.png";

interface AdminLayoutProps {
  children: ReactNode;
}

type NavItem = {
  href: string;
  label: string;
  icon: any;
  roles: ('admin' | 'casting')[];
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { signOut, isAdmin, isCasting } = useAuth();

  const allNavItems: NavItem[] = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ['admin', 'casting'] },
    { href: "/admin/reservas", label: "Reservas", icon: Calendar, roles: ['admin'] },
    { href: "/admin/reservas-kanban", label: "Pipeline", icon: Kanban, roles: ['admin'] },
    { href: "/admin/clientes", label: "Clientes", icon: Users, roles: ['admin'] },
    { href: "/admin/recreadores", label: "Recreadores", icon: UserCheck, roles: ['admin', 'casting'] },
    { href: "/admin/casting", label: "Casting", icon: Calendar, roles: ['admin', 'casting'] },
    { href: "/admin/financeiro", label: "Financeiro", icon: DollarSign, roles: ['admin'] },
    { href: "/admin/candidaturas", label: "Candidaturas", icon: Users, roles: ['admin'] },
    { href: "/admin/avaliacoes", label: "Avaliações", icon: Star, roles: ['admin'] },
    { href: "/admin/reclamacoes", label: "Reclamações", icon: AlertTriangle, roles: ['admin'] },
    { href: "/admin/importar-dados", label: "Importar Dados", icon: Upload, roles: ['admin'] },
    { href: "/admin/logs", label: "Auditoria", icon: Clock, roles: ['admin'] },
    { href: "/admin/config-comunicacoes", label: "Comunicação", icon: Settings, roles: ['admin'] },
  ];

  // Filter nav items based on user role
  const navItems = allNavItems.filter(item => {
    if (isAdmin && item.roles.includes('admin')) return true;
    if (isCasting && item.roles.includes('casting')) return true;
    return false;
  });

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <img src={logoVivalegria} alt="Vivalegria" className="h-10" />
          <p className="text-xs text-muted-foreground mt-2">
            {isAdmin ? 'Área Administrativa' : 'Área de Casting'}
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link to="/">
              <Home className="w-5 h-5 mr-3" />
              Voltar ao site
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={signOut}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
