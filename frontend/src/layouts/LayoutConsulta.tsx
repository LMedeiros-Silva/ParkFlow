import { useAuth } from '../contexts/useAuth';
import { AdminLayout } from './AdminLayout';
import { PublicLayout } from './PublicLayout';

/** A consulta é pública (RF09); quem já está autenticado a vê dentro do painel, sem controles extras. */
export function LayoutConsulta() {
  const { sessao } = useAuth();
  return sessao ? <AdminLayout /> : <PublicLayout />;
}
