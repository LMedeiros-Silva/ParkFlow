import { createContext, useContext } from 'react';
import type { Sessao } from '../services/storage';

export interface ValorAuth {
  sessao: Sessao | null;
  entrar: (email: string, senha: string) => boolean;
  sair: () => void;
}

export const AuthContext = createContext<ValorAuth | null>(null);

export function useAuth(): ValorAuth {
  const valor = useContext(AuthContext);
  if (!valor) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return valor;
}
