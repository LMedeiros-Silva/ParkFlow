import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { RotaProtegida } from './components/RotaProtegida';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import { ParkingProvider } from './contexts/ParkingContext';
import { ToastProvider } from './contexts/ToastContext';
import { AdminLayout } from './layouts/AdminLayout';
import { LayoutConsulta } from './layouts/LayoutConsulta';
import { ConsultaPage } from './pages/ConsultaPage';
import { DashboardPage } from './pages/DashboardPage';
import { EstacionamentosPage } from './pages/EstacionamentosPage';
import { HistoricoPage } from './pages/HistoricoPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RelatoriosPage } from './pages/RelatoriosPage';
import { SetoresPage } from './pages/SetoresPage';
import { VagasSetorPage } from './pages/VagasSetorPage';

const TITULOS: [RegExp, string][] = [
  [/^\/login$/, 'Entrar'],
  [/^\/consulta$/, 'Consulta de vagas'],
  [/^\/dashboard$/, 'Dashboard'],
  [/^\/estacionamentos$/, 'Estacionamentos'],
  [/^\/estacionamentos\/[^/]+$/, 'Setores'],
  [/^\/estacionamentos\/[^/]+\/setores\/[^/]+$/, 'Vagas do setor'],
  [/^\/historico$/, 'Histórico'],
  [/^\/relatorios$/, 'Relatórios'],
];

/** Atualiza o título da aba a cada navegação, para orientar quem usa leitor de tela. */
function TituloDocumento() {
  const { pathname } = useLocation();
  useEffect(() => {
    const titulo = TITULOS.find(([padrao]) => padrao.test(pathname))?.[1] ?? 'Página não encontrada';
    document.title = `${titulo} · ParkFlow`;
  }, [pathname]);
  return null;
}

function Inicio() {
  const { sessao } = useAuth();
  return <Navigate to={sessao ? '/dashboard' : '/login'} replace />;
}

export function App() {
  return (
    <AuthProvider>
      <ParkingProvider>
        <ToastProvider>
          <BrowserRouter>
            <TituloDocumento />
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/login" element={<LoginPage />} />
              <Route element={<LayoutConsulta />}>
                <Route path="/consulta" element={<ConsultaPage />} />
              </Route>
              <Route element={<RotaProtegida />}>
                <Route element={<AdminLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/estacionamentos" element={<EstacionamentosPage />} />
                  <Route path="/estacionamentos/:estacionamentoId" element={<SetoresPage />} />
                  <Route path="/estacionamentos/:estacionamentoId/setores/:setorId" element={<VagasSetorPage />} />
                  <Route path="/historico" element={<HistoricoPage />} />
                  <Route path="/relatorios" element={<RelatoriosPage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </ParkingProvider>
    </AuthProvider>
  );
}
