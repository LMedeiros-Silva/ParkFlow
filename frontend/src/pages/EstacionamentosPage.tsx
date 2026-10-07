import { Building2, ChevronRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CabecalhoPagina } from '../components/Cabecalho';
import { IconeEstado } from '../components/Estado';
import { useParking } from '../contexts/useParking';
import { calcularIndicadores, formatarTaxa } from '../domain/indicadores';

export function EstacionamentosPage() {
  const { estrutura, vagas } = useParking();

  return (
    <>
      <CabecalhoPagina
        titulo="Estacionamentos"
        descricao="Selecione um estacionamento para ver seus setores e atualizar o estado das vagas."
        migalhas={[{ rotulo: 'Estacionamentos' }]}
      />
      <p className="nota">
        Nesta versão os estacionamentos, setores e vagas são fixos (dados de demonstração). Cadastro e edição da
        estrutura ficam para uma evolução futura.
      </p>
      <ul className="grade-cartoes">
        {estrutura.estacionamentos.map((estacionamento) => {
          const setores = estrutura.setores.filter((setor) => setor.estacionamentoId === estacionamento.id);
          const idsSetores = new Set(setores.map((setor) => setor.id));
          const indicadores = calcularIndicadores(vagas.filter((vaga) => idsSetores.has(vaga.setorId)));
          return (
            <li key={estacionamento.id} className="cartao">
              <div className="cartao__cabecalho">
                <h2 className="cartao__titulo">
                  <Building2 aria-hidden="true" size={20} />
                  {estacionamento.nome}
                </h2>
                <span className={`selo-status ${estacionamento.ativo ? 'selo-status--ativo' : ''}`}>
                  {estacionamento.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <p className="texto-apoio">
                <MapPin aria-hidden="true" size={14} /> {estacionamento.endereco}
              </p>
              <p className="cartao__taxa">
                <strong>{formatarTaxa(indicadores.taxaOcupacao)}</strong> de ocupação
              </p>
              <div className="medidor" aria-hidden="true">
                <span style={{ width: `${indicadores.taxaOcupacao ?? 0}%` }} />
              </div>
              <dl className="detalhes">
                <div>
                  <dt>Setores</dt>
                  <dd>{setores.length}</dd>
                </div>
                <div>
                  <dt>Total de vagas</dt>
                  <dd>{indicadores.total}</dd>
                </div>
              </dl>
              <ul className="contagens">
                <li className="estado--livre">
                  <IconeEstado estado="LIVRE" /> {indicadores.disponiveis} disponíveis
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
              <Link to={`/estacionamentos/${estacionamento.id}`} className="botao botao--primario">
                Visualizar setores
                <ChevronRight aria-hidden="true" size={18} />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
