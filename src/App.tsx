import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfiguratorProvider } from "@/contexts/ConfiguratorContext";
import { AuthProvider } from "@/contexts/AuthContext";
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
import NotFound from "./pages/NotFound";

// NOVAS LANDING PAGES
import FestaInfantil from "./pages/festa-infantil/index";
import OrcamentoLP from "./pages/orcamento-lp/index";

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
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/reservas" element={<AdminReservas />} />
              <Route path="/admin/reservas-kanban" element={<AdminReservasKanban />} />
              <Route path="/admin/clientes" element={<AdminClientes />} />
              <Route path="/admin/recreadores" element={<AdminRecreadores />} />
              <Route path="/admin/casting" element={<AdminCasting />} />
              <Route path="/admin/financeiro" element={<AdminFinanceiro />} />
              <Route path="/admin/candidaturas" element={<AdminCandidaturas />} />
              <Route path="/admin/avaliacoes" element={<AdminAvaliacoes />} />
              <Route path="/admin/logs" element={<AdminLogs />} />
              <Route path="/admin/config-comunicacoes" element={<AdminConfigComunicacoes />} />

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

              <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
            </Routes>
          </BrowserRouter>
        </ConfiguratorProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
