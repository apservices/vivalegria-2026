import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfiguratorProvider } from "@/contexts/ConfiguratorContext";
import { AuthProvider } from "@/contexts/AuthContext";
import RoleGuard from "@/components/RoleGuard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieConsent from "@/components/CookieConsent";
import Home from "./pages/Home";
import Pacotes from "./pages/Pacotes";
import Oficinas from "./pages/Oficinas";
import QuemSomos from "./pages/QuemSomos";
import Corporativo from "./pages/Corporativo";
import Contato from "./pages/Contato";
import Contratar from "./pages/Contratar";
import GuiaParaPais from "./pages/GuiaParaPais";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import TrabalheConosco from "./pages/TrabalheConosco";
import AvaliacaoEvento from "./pages/AvaliacaoEvento";
import PesquisaSatisfacao from "./pages/PesquisaSatisfacao";
import AdminLogin from "./pages/admin/Login";
import Setup2FA from "./pages/admin/Setup2FA";
import Verify2FA from "./pages/admin/Verify2FA";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReservas from "./pages/admin/Reservas";
import AdminCandidaturas from "./pages/admin/Candidaturas";
import AdminCasting from "./pages/admin/Casting";
import AdminAvaliacoes from "./pages/admin/Avaliacoes";
import AdminFinanceiro from "./pages/admin/Financeiro";
import AdminConfigComunicacoes from "./pages/admin/ConfigComunicacoes";
import AdminClientes from "./pages/admin/clientes";
import AdminRecreadores from "./pages/admin/recreadores";
import AdminReservasKanban from "./pages/admin/ReservasKanban";
import AdminLogs from "./pages/admin/Logs";
import AdminReclamacoes from "./pages/admin/Reclamacoes";
import NotFound from "./pages/NotFound";

// NOVAS LANDING PAGES
import FestaInfantil from "./pages/festa-infantil/index";
import OrcamentoLP from "./pages/orcamento-lp/index";
import RecreacaoInfantilSP from "./pages/recreacao-infantil-sp/index";
import EventosCorporativosInfantis from "./pages/eventos-corporativos-infantis/index";
import Obrigado from "./pages/Obrigado";

// FORMULÁRIO COMPLETO DE CADASTRO
import CadastroRecreador from "./pages/CadastroRecreador";

// PORTAL DO RECREADOR
import RecreadorDashboard from "./pages/recreador/Dashboard";
import RecreadorEventos from "./pages/recreador/Eventos";
import RecreadorPagamentos from "./pages/recreador/Pagamentos";
import RecreadorPerfil from "./pages/recreador/Perfil";

const queryClient = new QueryClient();

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
    <WhatsAppButton />
    <CookieConsent />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ConfiguratorProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* ADMIN ROTAS */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/setup-2fa" element={<Setup2FA />} />
              <Route path="/admin/verify-2fa" element={<Verify2FA />} />
              <Route path="/admin" element={<RoleGuard allowedRoles={['admin', 'casting']}><AdminDashboard /></RoleGuard>} />
              <Route path="/admin/reservas" element={<RoleGuard allowedRoles={['admin']}><AdminReservas /></RoleGuard>} />
              <Route path="/admin/reservas-kanban" element={<RoleGuard allowedRoles={['admin']}><AdminReservasKanban /></RoleGuard>} />
              <Route path="/admin/clientes" element={<RoleGuard allowedRoles={['admin']}><AdminClientes /></RoleGuard>} />
              <Route path="/admin/recreadores" element={<RoleGuard allowedRoles={['admin', 'casting']}><AdminRecreadores /></RoleGuard>} />
              <Route path="/admin/casting" element={<RoleGuard allowedRoles={['admin', 'casting']}><AdminCasting /></RoleGuard>} />
              <Route path="/admin/financeiro" element={<RoleGuard allowedRoles={['admin']}><AdminFinanceiro /></RoleGuard>} />
              <Route path="/admin/candidaturas" element={<RoleGuard allowedRoles={['admin']}><AdminCandidaturas /></RoleGuard>} />
              <Route path="/admin/avaliacoes" element={<RoleGuard allowedRoles={['admin']}><AdminAvaliacoes /></RoleGuard>} />
              <Route path="/admin/logs" element={<RoleGuard allowedRoles={['admin']}><AdminLogs /></RoleGuard>} />
              <Route path="/admin/reclamacoes" element={<RoleGuard allowedRoles={['admin']}><AdminReclamacoes /></RoleGuard>} />
              <Route path="/admin/config-comunicacoes" element={<RoleGuard allowedRoles={['admin']}><AdminConfigComunicacoes /></RoleGuard>} />

              {/* CADASTRO RECREADOR - Público */}
              <Route path="/cadastro-recreador" element={<PublicLayout><CadastroRecreador /></PublicLayout>} />

              {/* PORTAL DO RECREADOR */}
              <Route path="/recreador" element={<RoleGuard allowedRoles={['recreador']}><RecreadorDashboard /></RoleGuard>} />
              <Route path="/recreador/eventos" element={<RoleGuard allowedRoles={['recreador']}><RecreadorEventos /></RoleGuard>} />
              <Route path="/recreador/pagamentos" element={<RoleGuard allowedRoles={['recreador']}><RecreadorPagamentos /></RoleGuard>} />
              <Route path="/recreador/perfil" element={<RoleGuard allowedRoles={['recreador']}><RecreadorPerfil /></RoleGuard>} />

              {/* PÚBLICAS */}
              <Route path="/avaliacao-evento" element={<AvaliacaoEvento />} />
              <Route path="/pesquisa-satisfacao" element={<PesquisaSatisfacao />} />

              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/pacotes" element={<PublicLayout><Pacotes /></PublicLayout>} />
              <Route path="/oficinas" element={<PublicLayout><Oficinas /></PublicLayout>} />
              <Route path="/quem-somos" element={<PublicLayout><QuemSomos /></PublicLayout>} />
              <Route path="/corporativo" element={<PublicLayout><Corporativo /></PublicLayout>} />
              <Route path="/contato" element={<PublicLayout><Contato /></PublicLayout>} />
              <Route path="/contratar" element={<PublicLayout><Contratar /></PublicLayout>} />
              <Route path="/guia-para-pais" element={<PublicLayout><GuiaParaPais /></PublicLayout>} />
              <Route path="/privacidade" element={<PublicLayout><Privacidade /></PublicLayout>} />
              <Route path="/termos" element={<PublicLayout><Termos /></PublicLayout>} />
              <Route path="/trabalhe-conosco" element={<PublicLayout><TrabalheConosco /></PublicLayout>} />

              {/* NOVAS LANDING PAGES */}
              <Route path="/festa-infantil" element={<PublicLayout><FestaInfantil /></PublicLayout>} />
              <Route path="/orcamento" element={<PublicLayout><OrcamentoLP /></PublicLayout>} />
              <Route path="/recreacao-infantil-sp" element={<PublicLayout><RecreacaoInfantilSP /></PublicLayout>} />
              <Route path="/eventos-corporativos-infantis" element={<PublicLayout><EventosCorporativosInfantis /></PublicLayout>} />
              <Route path="/obrigado" element={<PublicLayout><Obrigado /></PublicLayout>} />

              <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
            </Routes>
          </BrowserRouter>
        </ConfiguratorProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
