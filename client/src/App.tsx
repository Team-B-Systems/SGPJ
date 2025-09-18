import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./lib/auth-context";
import { LoginForm } from "./components/auth/login-form";
import { DashboardLayout } from "./components/layout/dashboard-layout";
import { DashboardHome } from "./components/dashboard/dashboard-home";
import { ProcessosPage } from "./components/processos/processos-page";
import { DocumentosPage } from "./components/documentos/documentos-page";
import { FuncionariosPage } from "./components/funcionarios/funcionarios-page";
import { PerfilPage } from "./components/perfil/perfil-page";
import { QueixasPage } from "./components/queixas/queixas-page";
import { ReunioesPage } from "./components/reunioes/reunioes-page";
import { ComissoesPage } from "./components/comissoes/comissoes-page";
import { EnvolvidosPage } from "./components/envolvidos/envolvidos-page";
import { ProcessosProvider } from "./lib/processos-context";

function PrivateRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // ou spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/processos" element={<ProcessosPage />} />
        <Route path="/documentos" element={<DocumentosPage />} />
        <Route path="/funcionarios" element={<FuncionariosPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/queixas" element={<QueixasPage />} />
        <Route path="/reunioes" element={<ReunioesPage />} />
        <Route path="/comissoes" element={<ComissoesPage />} />
        <Route path="/envolvidos" element={<EnvolvidosPage />} />
        {/* rota fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/*" element={<PrivateRoutes />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProcessosProvider>
        <AppContent />
      </ProcessosProvider>
    </AuthProvider>
  );
}
