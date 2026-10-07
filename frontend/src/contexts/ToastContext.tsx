import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ToastContext, type TipoToast } from './useToast';

interface Toast {
  id: number;
  mensagem: string;
  tipo: TipoToast;
}

const DURACAO_MS = 5000;
const ICONES = { sucesso: CircleCheck, erro: TriangleAlert, info: Info } as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const proximoId = useRef(1);
  const temporizadores = useRef(new Map<number, number>());

  const remover = useCallback((id: number) => {
    setToasts((atuais) => atuais.filter((toast) => toast.id !== id));
    const temporizador = temporizadores.current.get(id);
    if (temporizador) window.clearTimeout(temporizador);
    temporizadores.current.delete(id);
  }, []);

  const notificar = useCallback(
    (mensagem: string, tipo: TipoToast = 'sucesso') => {
      const id = proximoId.current++;
      setToasts((atuais) => [...atuais.slice(-2), { id, mensagem, tipo }]);
      temporizadores.current.set(
        id,
        window.setTimeout(() => remover(id), DURACAO_MS),
      );
    },
    [remover],
  );

  useEffect(() => {
    const mapa = temporizadores.current;
    return () => mapa.forEach((temporizador) => window.clearTimeout(temporizador));
  }, []);

  const valor = useMemo(() => ({ notificar }), [notificar]);

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((toast) => {
          const Icone = ICONES[toast.tipo];
          return (
            <div key={toast.id} className={`toast toast--${toast.tipo}`}>
              <Icone aria-hidden="true" size={20} />
              <span>{toast.mensagem}</span>
              <button type="button" className="botao-icone" onClick={() => remover(toast.id)} aria-label="Fechar aviso">
                <X aria-hidden="true" size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
