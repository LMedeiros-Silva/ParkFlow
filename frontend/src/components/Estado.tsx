import { Ban, Circle, CircleCheck, Clock, type LucideProps } from 'lucide-react';
import { ROTULO_ESTADO, type EstadoVaga } from '../domain/tipos';

/** Cada estado tem cor, ícone e rótulo — nunca apenas cor (RNF11). */
export function IconeEstado({ estado, size = 16 }: { estado: EstadoVaga; size?: number }) {
  const props: LucideProps = { size, 'aria-hidden': true, focusable: false };
  switch (estado) {
    case 'LIVRE':
      return <CircleCheck {...props} />;
    case 'OCUPADA':
      return <Circle {...props} fill="currentColor" />;
    case 'RESERVADA':
      return <Clock {...props} />;
    case 'INDISPONIVEL':
      return <Ban {...props} />;
  }
}

export function EstadoBadge({ estado }: { estado: EstadoVaga }) {
  return (
    <span className={`estado estado--${estado.toLowerCase()}`}>
      <IconeEstado estado={estado} />
      {ROTULO_ESTADO[estado]}
    </span>
  );
}
