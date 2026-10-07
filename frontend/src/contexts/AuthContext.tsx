import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ambiente } from '../services/ambiente';
import { autenticar } from '../services/auth';
import { carregarSessao, CHAVE_SESSAO, encerrarSessao, salvarSessao } from '../services/storage';
import { AuthContext, type ValorAuth } from './useAuth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState(() => carregarSessao(ambiente.storage));

  // Mantém a sessão sincronizada entre abas (login ou logout em outra aba).
  useEffect(() => {
    function aoMudarStorage(evento: StorageEvent) {
      if (evento.key === CHAVE_SESSAO || evento.key === null) {
        setSessao(carregarSessao(ambiente.storage));
      }
    }
    window.addEventListener('storage', aoMudarStorage);
    return () => window.removeEventListener('storage', aoMudarStorage);
  }, []);

  const entrar = useCallback((email: string, senha: string) => {
    const nova = autenticar(email, senha);
    if (!nova) return false;
    salvarSessao(ambiente.storage, nova);
    setSessao(nova);
    return true;
  }, []);

  const sair = useCallback(() => {
    encerrarSessao(ambiente.storage);
    setSessao(null);
  }, []);

  const valor = useMemo<ValorAuth>(() => ({ sessao, entrar, sair }), [sessao, entrar, sair]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
