import React, { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";

import { AuthProvider } from "./contexts/AuthContext";
import { ConfiguratorProvider } from "./contexts/ConfiguratorContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import CookieConsent from "./components/CookieConsent";
import ScrollToTop from "./components/ScrollToTop";

import RoleGuard from "./components/auth/RoleGuard";

/* ====================== ADMIN ====================== */
import AdminLogin from "./pages/admin/Login";
import Setup2FA from "./pages/admin/Setup2FA";
import Verify2FA from "./pages/admin/Verify2FA";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminReservas from "./pages/admin/Reservas";
import AdminReservasKanban from "./pages/admin/ReservasKanban";
import AdminClientes from "./pages/admin/clientes";
import AdminRecreadores from "./pages/admin/recreadores";
import AdminCasting from "./pages/admin/Casting";
import AdminFinanceiro from "./pages/admin/Financeiro";
import AdminCandidaturas from "./pages/admin/Candidaturas";
import AdminAvaliacoes from "./pages/admin/Avaliacoes";
import AdminLogs from "./pages/admin/Logs";
import AdminReclamacoes from "./pages/admin/Reclamacoes";
import AdminImportarDados from "./pages/admin/ImportarDados";
import AdminConfigComunicacoes from "./pages/admin/ConfigComunicacoes";

/* ====================== RECREADOR ====================== */
import RecreadorLogin from "./pages/recreador/login";
import RecreadorAuthCallback from "./pages/recreador/AuthCallback";
import RecreadorDashboard from "./pages/recreador/Dashboard";
import RecreadorEventos from "./pages/recreador/Eventos";
import RecreadorPagamentos from "./pages/recreador/Pagamentos";
import RecreadorPerfil from "./pages/recreador/Perfil";

/* ====================== PÚBLICO ====================== */
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
import CadastroRecreador from "./pages/CadastroRecreador";
import AvaliacaoEvento from "./pages/AvaliacaoEvento";
import PesquisaSatisfacao from "./pages/PesquisaSatisfacao";
import Obrigado from "./pages/Obrigado";
import FestaInfantil from "./pages/FestaInfantil";
import OrcamentoLP from "./pages/OrcamentoLP";
import RecreacaoInfantilSP from "./pages/recreacao-infantil-sp";
import EventosCorporativosInfantis from "./pages/eventos-corporativos-infantis";
import NotFound from "./pages/NotFound";
import RedefinirSenha from "./pages/RedefinirSenha";

const queryClient = new QueryClient();

/* ====================== HOME LAYOUT (SEM OFFSET) ====================== */
const HomeLayout = ({ children }: { children: ReactNode }) => (
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

/* ====================== LAYOUT PÚBLICO (OFFSET ÚNICO DO HEADER) ====================== */
const PublicLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />

    {/* Compensa exatamente a altura real do Header (h-16 = 64px) */}
    <main className="flex-grow pt-16">
      {children}
    </main>

    <Footer />
    <WhatsAppButton />
    <CookieConsent />
  </div>
);

/* ====================== APP ====================== */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ConfiguratorProvider>
            <Toaster />

            <BrowserRouter>
              <Routes>

                {/* ========== REDIRECTS ========== */}
                <Route
                  path="/login"
                  element={<Navigate to="/admin/login" replace />}
                />
                <Route
                  path="/redefinir-senha"
                  element={<RedefinirSenha />}
                />

                {/* ========== ADMIN ========== */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/setup-2fa" element={<Setup2FA />} />
                <Route path="/admin/verify-2fa" element={<Verify2FA />} />

                <Route
                  path="/admin"
                  element={
                    <RoleGuard allowedRoles={["admin", "casting"]}>
                      <AdminDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/reservas"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminReservas />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/reservas-kanban"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminReservasKanban />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/clientes"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminClientes />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/recreadores"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminRecreadores />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/casting"
                  element={
                    <RoleGuard allowedRoles={["admin", "casting"]}>
                      <AdminCasting />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/financeiro"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminFinanceiro />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/candidaturas"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminCandidaturas />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/avaliacoes"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminAvaliacoes />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/logs"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminLogs />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/reclamacoes"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminReclamacoes />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/importar-dados"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminImportarDados />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/comunicacoes"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <AdminConfigComunicacoes />
                    </RoleGuard>
                  }
                />

                {/* ========== RECREADOR ========== */}
                <Route path="/recreador/login" element={<RecreadorLogin />} />
                <Route path="/recreador/auth-callback" element={<RecreadorAuthCallback />} />
                <Route
                  path="/recreador"
                  element={
                    <RoleGuard allowedRoles={["recreador"]}>
                      <RecreadorDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/recreador/eventos"
                  element={
                    <RoleGuard allowedRoles={["recreador"]}>
                      <RecreadorEventos />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/recreador/pagamentos"
                  element={
                    <RoleGuard allowedRoles={["recreador"]}>
                      <RecreadorPagamentos />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/recreador/perfil"
                  element={
                    <RoleGuard allowedRoles={["recreador"]}>
                      <RecreadorPerfil />
                    </RoleGuard>
                  }
                />

                {/* ========== PÚBLICO ========== */}
                <Route path="/" element={<HomeLayout><Home /></HomeLayout>} />
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
                <Route path="/cadastro-recreador" element={<PublicLayout><CadastroRecreador /></PublicLayout>} />
                <Route path="/avaliacao-evento" element={<PublicLayout><AvaliacaoEvento /></PublicLayout>} />
                <Route path="/pesquisa-satisfacao" element={<PublicLayout><PesquisaSatisfacao /></PublicLayout>} />
                <Route path="/obrigado" element={<PublicLayout><Obrigado /></PublicLayout>} />
                <Route path="/festa-infantil" element={<PublicLayout><FestaInfantil /></PublicLayout>} />
                <Route path="/orcamento" element={<PublicLayout><OrcamentoLP /></PublicLayout>} />
                <Route path="/recreacao-infantil-sp" element={<PublicLayout><RecreacaoInfantilSP /></PublicLayout>} />
                <Route path="/eventos-corporativos-infantis" element={<PublicLayout><EventosCorporativosInfantis /></PublicLayout>} />

                {/* 404 */}
                <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />

              </Routes>
            </BrowserRouter>

          </ConfiguratorProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
