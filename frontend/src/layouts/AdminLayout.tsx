import { Building2, FileText, History, LayoutDashboard, Menu, MapPin, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AvisoDados } from '../components/AvisoDados';
import { Logo } from '../components/Logo';
import { MenuUsuario } from './MenuUsuario';

const ITENS_MENU = [
  { para: '/dashboard', rotulo: 'Dashboard', Icone: LayoutDashboard },
  { para: '/estacionamentos', rotulo: 'Estacionamentos', Icone: Building2 },
  { para: '/consulta', rotulo: 'Consulta de vagas', Icone: MapPin },
  { para: '/historico', rotulo: 'Histórico', Icone: History },
  { para: '/relatorios', rotulo: 'Relatórios', Icone: FileText },
];

export function AdminLayout() {
  const { pathname } = useLocation();
  // O menu lateral (telas pequenas) vale só para a rota em que foi aberto: navegar o fecha.
  const [menuAbertoEm, setMenuAbertoEm] = useState<string | null>(null);
  const menuAberto = menuAbertoEm === pathname;
  const setMenuAberto = (aberto: boolean) => setMenuAbertoEm(aberto ? pathname : null);

  useEffect(() => {
    if (!menuAberto) return;
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') setMenuAbertoEm(null);
    }
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [menuAberto]);

  return (
    <div className={`admin ${menuAberto ? 'admin--menu-aberto' : ''}`}>
      <a className="pular-conteudo" href="#conteudo">
        Pular para o conteúdo
      </a>

      <aside className="sidebar" id="menu-lateral" aria-label="Menu principal">
        <div className="sidebar__topo">
          <Logo largura={168} />
          <button
            type="button"
            className="botao-icone sidebar__fechar"
            onClick={() => setMenuAberto(false)}
            aria-label="Fechar menu"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>
        <nav>
          <ul className="sidebar__lista">
            {ITENS_MENU.map(({ para, rotulo, Icone }) => (
              <li key={para}>
                <NavLink to={para} className="sidebar__link">
                  <Icone aria-hidden="true" size={20} />
                  {rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <p className="sidebar__nota">Protótipo acadêmico · dados de demonstração salvos neste navegador.</p>
      </aside>
      {menuAberto && <div className="admin__veu" onClick={() => setMenuAberto(false)} aria-hidden="true" />}

      <div className="admin__principal">
        <header className="topbar">
          <button
            type="button"
            className="botao-icone topbar__menu"
            aria-expanded={menuAberto}
            aria-controls="menu-lateral"
            aria-label="Abrir menu"
            onClick={() => setMenuAberto(true)}
          >
            <Menu aria-hidden="true" size={24} />
          </button>
          <span className="selo-demo">Ambiente de demonstração</span>
          <MenuUsuario />
        </header>
        <main id="conteudo" className="conteudo" tabIndex={-1}>
          <AvisoDados />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
