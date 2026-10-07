import type { ReactNode } from 'react';

interface Props {
  rotulo: string;
  valor: ReactNode;
  icone?: ReactNode;
  detalhe?: ReactNode;
  variante?: 'padrao' | 'livre' | 'ocupada' | 'reservada' | 'indisponivel' | 'destaque';
}

export function Kpi({ rotulo, valor, icone, detalhe, variante = 'padrao' }: Props) {
  return (
    <div className={`kpi kpi--${variante}`}>
      <dt className="kpi__rotulo">
        {icone}
        {rotulo}
      </dt>
      <dd className="kpi__valor">{valor}</dd>
      {detalhe && <dd className="kpi__detalhe">{detalhe}</dd>}
    </div>
  );
}
