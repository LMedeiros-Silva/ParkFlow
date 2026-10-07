import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

/** Redireciona para o login guardando a rota pedida, para voltar a ela após autenticar. */
export function RotaProtegida() {
  const { sessao } = useAuth();
  const local = useLocation();
  if (!sessao) {
    return <Navigate to="/login" replace state={{ de: `${local.pathname}${local.search}` }} />;
  }
  return <Outlet />;
}
