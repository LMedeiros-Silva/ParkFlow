import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { useAuth } from '../contexts/useAuth';

export function NotFoundPage() {
  const { sessao } = useAuth();
  return (
    <div className="login">
      <main className="login__cartao" id="conteudo">
        <Logo largura={200} />
        <p className="nao-encontrado__codigo">404</p>
        <h1>Página não encontrada</h1>
        <p className="login__subtitulo">O endereço acessado não existe ou foi digitado incorretamente.</p>
        <div className="acoes-linha">
          <Link to={sessao ? '/dashboard' : '/login'} className="botao botao--primario">
            {sessao ? 'Ir para o dashboard' : 'Ir para o login'}
          </Link>
          <Link to="/consulta" className="botao botao--secundario">
            Consultar vagas
          </Link>
        </div>
      </main>
    </div>
  );
}
