import { createContext, useContext } from 'react';

export type TipoToast = 'sucesso' | 'erro' | 'info';

export interface ValorToast {
  notificar: (mensagem: string, tipo?: TipoToast) => void;
}

export const ToastContext = createContext<ValorToast | null>(null);

export function useToast(): ValorToast {
  const valor = useContext(ToastContext);
  if (!valor) throw new Error('useToast deve ser usado dentro de ToastProvider.');
  return valor;
}
