import { TriangleAlert, X } from 'lucide-react';
import { useParking } from '../contexts/useParking';

/** Mostra avisos de carga dos dados (JSON corrompido, versão diferente ou armazenamento indisponível). */
export function AvisoDados() {
  const { aviso, dispensarAviso } = useParking();
  if (!aviso) return null;
  return (
    <div className="alerta alerta--aviso" role="alert">
      <TriangleAlert aria-hidden="true" size={20} />
      <p>{aviso}</p>
      <button type="button" className="botao-icone" onClick={dispensarAviso} aria-label="Dispensar aviso">
        <X aria-hidden="true" size={16} />
      </button>
    </div>
  );
}
