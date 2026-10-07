import { Info, LogIn, MapPin, TriangleAlert } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { useAuth } from '../contexts/useAuth';
import { CREDENCIAIS_DEMO } from '../services/auth';

function destinoSeguro(estado: unknown): string {
  const de = (estado as { de?: unknown } | null)?.de;
  // Só aceita caminhos internos, evitando redirecionar para fora da aplicação.
  return typeof de === 'string' && de.startsWith('/') && !de.startsWith('//') && de !== '/login' ? de : '/dashboard';
}

export function LoginPage() {
  const { sessao, entrar } = useAuth();
  const navegar = useNavigate();
  const local = useLocation();
  const destino = destinoSeguro(local.state);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  if (sessao) return <Navigate to={destino} replace />;

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!email.trim() || !senha) {
      setErro('Informe e-mail e senha.');
      return;
    }
    if (entrar(email, senha)) {
      navegar(destino, { replace: true });
    } else {
      setErro('E-mail ou senha inválidos.');
    }
  }

  return (
    <div className="login">
      <main className="login__cartao" id="conteudo">
        <Logo largura={220} />
        <h1>Acesso administrativo</h1>
        <p className="login__subtitulo">Entre para gerenciar vagas, acompanhar indicadores e gerar relatórios.</p>

        <form onSubmit={aoEnviar} noValidate className="formulario">
          {erro && (
            <p className="alerta alerta--erro" role="alert" id="erro-login">
              <TriangleAlert aria-hidden="true" size={18} />
              {erro}
            </p>
          )}
          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              aria-invalid={erro ? true : undefined}
              aria-describedby={erro ? 'erro-login' : undefined}
              required
            />
          </div>
          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              aria-invalid={erro ? true : undefined}
              aria-describedby={erro ? 'erro-login' : undefined}
              required
            />
          </div>
          <button type="submit" className="botao botao--primario botao--largo">
            <LogIn aria-hidden="true" size={18} />
            Entrar
          </button>
        </form>

        <div className="alerta alerta--info login__aviso">
          <Info aria-hidden="true" size={18} />
          <p>
            <strong>Acesso simulado.</strong> Este protótipo não possui servidor: a sessão fica apenas neste navegador e
            não há proteção real de credenciais.
          </p>
        </div>

        <details className="login__demo">
          <summary>Credenciais de demonstração</summary>
          <p>
            E-mail: <code>{CREDENCIAIS_DEMO.email}</code>
            <br />
            Senha: <code>{CREDENCIAIS_DEMO.senha}</code>
          </p>
        </details>

        <Link to="/consulta" className="login__consulta">
          <MapPin aria-hidden="true" size={16} />
          Consultar vagas disponíveis sem login
        </Link>
      </main>
    </div>
  );
}
