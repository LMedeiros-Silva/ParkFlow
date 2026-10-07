import { X } from 'lucide-react';
import { useEffect, useId, useRef, type ReactNode } from 'react';

interface Props {
  aberto: boolean;
  titulo: string;
  aoFechar: () => void;
  children: ReactNode;
  rodape?: ReactNode;
}

/** Diálogo modal nativo (<dialog>): foco preso, Esc fecha e o foco volta ao elemento de origem. */
export function Dialogo({ aberto, titulo, aoFechar, children, rodape }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) {
      dialogo.showModal();
    } else if (!aberto && dialogo.open) {
      dialogo.close();
    }
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      className="dialogo"
      aria-labelledby={idTitulo}
      onCancel={(evento) => {
        evento.preventDefault();
        aoFechar();
      }}
      onClick={(evento) => {
        // Clique no fundo (fora da caixa) fecha o diálogo.
        if (evento.target === ref.current) aoFechar();
      }}
    >
      {aberto && (
        <div className="dialogo__caixa">
          <header className="dialogo__cabecalho">
            <h2 id={idTitulo}>{titulo}</h2>
            <button type="button" className="botao-icone" onClick={aoFechar} aria-label="Fechar">
              <X aria-hidden="true" size={20} />
            </button>
          </header>
          <div className="dialogo__corpo">{children}</div>
          {rodape && <footer className="dialogo__rodape">{rodape}</footer>}
        </div>
      )}
    </dialog>
  );
}
