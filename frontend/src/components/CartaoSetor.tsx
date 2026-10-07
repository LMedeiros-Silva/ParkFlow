import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatarTaxa, type Indicadores } from '../domain/indicadores';
import type { Setor } from '../domain/tipos';
import { IconeEstado } from './Estado';

export function CartaoSetor({ setor, indicadores }: { setor: Setor; indicadores: Indicadores }) {
  const taxa = indicadores.taxaOcupacao;
  return (
    <Link to={`/estacionamentos/${setor.estacionamentoId}/setores/${setor.id}`} className="cartao cartao--link">
      <div className="cartao__cabecalho">
        <h3 className="cartao__titulo">
          {setor.nome} <span className="texto-apoio">· {setor.descricao}</span>
        </h3>
        <ChevronRight aria-hidden="true" size={20} />
      </div>
      <p className="cartao__taxa">
        <strong>{formatarTaxa(taxa)}</strong> de ocupação
      </p>
      <div className="medidor" aria-hidden="true">
        <span style={{ width: `${taxa ?? 0}%` }} />
      </div>
      <ul className="contagens">
        <li className="estado--livre">
          <IconeEstado estado="LIVRE" /> {indicadores.disponiveis} livres
        </li>
        <li className="estado--ocupada">
          <IconeEstado estado="OCUPADA" /> {indicadores.ocupadas} ocupadas
        </li>
        <li className="estado--reservada">
          <IconeEstado estado="RESERVADA" /> {indicadores.reservadas} reservadas
        </li>
        <li className="estado--indisponivel">
          <IconeEstado estado="INDISPONIVEL" /> {indicadores.indisponiveis} indisponíveis
        </li>
      </ul>
      <p className="texto-apoio">
        {indicadores.total} vagas · {indicadores.operacionais} operacionais
      </p>
    </Link>
  );
}
