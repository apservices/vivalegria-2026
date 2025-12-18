import React, { ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";

import { AuthProvider } from "./contexts/AuthContext";
import { ConfiguratorProvider } from "./contexts/ConfiguratorContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import CookieConsent from "./components/CookieConsent";

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
import AvaliacaoEvento from "./pages/AvaliacaoEvento";
import PesquisaSatisfacao from "./pages/PesquisaSatisfacao";
import Obrigado from "./pages/Obrigado";
import FestaInfantil from "./pages/FestaInfantil";
import OrcamentoLP from "./pages/OrcamentoLP";
import RecreacaoInfantilSP from "./pages/recreacao-infantil-sp";
import EventosCorporativosInfantis from "./pages/eventos-corporativos-infantis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/* ====================== LAYOUT PÚBLICO ====================== */
const PublicLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />

    {/* Compensa Header fixo */}
    <main className="flex-grow pt-24 md:pt-28">
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

                {/* ADMIN */}
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

                {/* RECREADOR */}
                <Route path="/recreador/login" element={<RecreadorLogin />} />
                <Route
                  path="/recreador"
                  element={
                    <RoleGuard allowedRoles={["recreador"]}>
                      <RecreadorDashboard />
                    </RoleGuard>
                  }
                />

                {/* PÚBLICO */}
                <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                <Route path="/pacotes" element={<PublicLayout><Pacotes /></PublicLayout>} />
                <Route path="/oficinas" element={<PublicLayout><Oficinas /></PublicLayout>} />
                <Route path="/quem-somos" element={<PublicLayout><QuemSomos /></PublicLayout>} />
                <Route path="/corporativo" element={<PublicLayout><Corporativo /></PublicLayout>} />
                <Route path="/contato" element={<PublicLayout><Contato /></PublicLayout>} />
                <Route path="/contratar" element={<PublicLayout><Contratar /></PublicLayout>} />

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
