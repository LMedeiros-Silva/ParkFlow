import { SearchX } from 'lucide-react';
import type { ReactNode } from 'react';

export function EstadoVazio({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className="estado-vazio">
      <SearchX aria-hidden="true" size={32} />
      <p className="estado-vazio__titulo">{titulo}</p>
      {children && <div className="estado-vazio__texto">{children}</div>}
    </div>
  );
}
