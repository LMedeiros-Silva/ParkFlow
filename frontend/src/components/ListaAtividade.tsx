import { ArrowRight } from 'lucide-react';
import { formatarDataHora, formatarTempoRelativo } from '../domain/datas';
import { ROTULO_ORIGEM, type RegistroHistorico, type Setor } from '../domain/tipos';
import { EstadoBadge } from './Estado';

interface Props {
  registros: RegistroHistorico[];
  setores: Setor[];
  agora: Date;
}

export function ListaAtividade({ registros, setores, agora }: Props) {
  return (
    <ol className="atividade">
      {registros.map((registro) => {
        const setor = setores.find((item) => item.id === registro.setorId);
        return (
          <li key={registro.id} className="atividade__item">
            <div className="atividade__vaga">
              <strong>{registro.codigoVaga}</strong>
              <span className="texto-apoio">{setor?.nome}</span>
            </div>
            <div className="atividade__transicao">
              <EstadoBadge estado={registro.estadoAnterior} />
              <ArrowRight aria-hidden="true" size={16} />
              <span className="visualmente-oculto">para</span>
              <EstadoBadge estado={registro.estadoNovo} />
            </div>
            <div className="atividade__meta texto-apoio">
              <time dateTime={registro.dataHora} title={formatarDataHora(registro.dataHora)}>
                {formatarTempoRelativo(registro.dataHora, agora)}
              </time>
              <span>{registro.responsavel ?? ROTULO_ORIGEM[registro.origem]}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
