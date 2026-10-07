import { LogIn } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { AvisoDados } from '../components/AvisoDados';
import { Logo } from '../components/Logo';

export function PublicLayout() {
  return (
    <div className="publico">
      <a className="pular-conteudo" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="publico__topo">
        <Link to="/consulta" className="publico__marca">
          <Logo largura={168} />
        </Link>
        <Link to="/login" className="botao botao--secundario">
          <LogIn aria-hidden="true" size={16} />
          Área administrativa
        </Link>
      </header>
      <main id="conteudo" className="conteudo conteudo--publico" tabIndex={-1}>
        <AvisoDados />
        <Outlet />
      </main>
      <footer className="publico__rodape">
        ParkFlow · Protótipo acadêmico. Os estados das vagas são dados de demonstração, sem sensores.
      </footer>
    </div>
  );
}
