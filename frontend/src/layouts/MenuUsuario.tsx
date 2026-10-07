import { ChevronDown, LogOut, RotateCcw, UserRound } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialogo } from '../components/Dialogo';
import { useAuth } from '../contexts/useAuth';
import { useParking } from '../contexts/useParking';
import { useToast } from '../contexts/useToast';

export function MenuUsuario() {
  const { sessao, sair } = useAuth();
  const { restaurar } = useParking();
  const { notificar } = useToast();
  const navegar = useNavigate();
  const [aberto, setAberto] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const idMenu = useId();

  useEffect(() => {
    if (!aberto) return;
    function aoClicarFora(evento: MouseEvent) {
      if (!raiz.current?.contains(evento.target as Node)) setAberto(false);
    }
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        setAberto(false);
        botao.current?.focus();
      }
    }
    document.addEventListener('mousedown', aoClicarFora);
    document.addEventListener('keydown', aoTeclar);
    return () => {
      document.removeEventListener('mousedown', aoClicarFora);
      document.removeEventListener('keydown', aoTeclar);
    };
  }, [aberto]);

  if (!sessao) return null;

  return (
    <div className="menu-usuario" ref={raiz}>
      <button
        ref={botao}
        type="button"
        className="menu-usuario__botao"
        aria-expanded={aberto}
        aria-controls={idMenu}
        aria-label={`Menu do usuário: ${sessao.nome}`}
        onClick={() => setAberto((valor) => !valor)}
      >
        <UserRound aria-hidden="true" size={20} />
        <span className="menu-usuario__nome">{sessao.nome}</span>
        <ChevronDown aria-hidden="true" size={16} />
      </button>
      {aberto && (
        <div className="menu-usuario__painel" id={idMenu}>
          <p className="menu-usuario__identificacao">
            <strong>{sessao.nome}</strong>
            <span>{sessao.email}</span>
          </p>
          <ul>
            <li>
              <button
                type="button"
                onClick={() => {
                  setAberto(false);
                  setConfirmando(true);
                }}
              >
                <RotateCcw aria-hidden="true" size={16} />
                Restaurar dados de demonstração
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  sair();
                  navegar('/login', { replace: true });
                }}
              >
                <LogOut aria-hidden="true" size={16} />
                Sair
              </button>
            </li>
          </ul>
        </div>
      )}

      <Dialogo
        aberto={confirmando}
        titulo="Restaurar dados de demonstração?"
        aoFechar={() => setConfirmando(false)}
        rodape={
          <>
            <button type="button" className="botao botao--secundario" onClick={() => setConfirmando(false)}>
              Cancelar
            </button>
            <button
              type="button"
              className="botao botao--perigo"
              onClick={() => {
                restaurar();
                setConfirmando(false);
                notificar('Dados de demonstração restaurados.', 'sucesso');
              }}
            >
              Restaurar
            </button>
          </>
        }
      >
        <p>
          Todas as alterações de estado e o histórico registrados neste navegador serão descartados, e as 60 vagas
          voltarão à situação inicial da demonstração. Sua sessão continuará ativa.
        </p>
      </Dialogo>
    </div>
  );
}
