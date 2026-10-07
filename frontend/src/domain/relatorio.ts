import { formatarData } from './datas';
import { filtrarHistorico, type FiltroPeriodo } from './filtros';
import { calcularIndicadores, type Indicadores } from './indicadores';
import {
  ESTADOS_VAGA,
  type DadosOperacionais,
  type EstadoVaga,
  type Estrutura,
  type RegistroHistorico,
  type TipoVagaId,
} from './tipos';

export interface FiltroRelatorio extends FiltroPeriodo {
  estacionamentoId: string;
  setorId: string;
  tipoId: TipoVagaId | '';
}

export interface LinhaRelatorio {
  id: string;
  nome: string;
  indicadores: Indicadores;
}

export interface DescricaoFiltros {
  estacionamento: string;
  setor: string;
  tipo: string;
  periodo: string;
}

/**
 * Relatório operacional (RF15). Totais e taxa são uma fotografia do estado corrente no momento
 * da geração; o período restringe apenas as movimentações do histórico.
 */
export interface Relatorio {
  geradoEm: string;
  filtros: FiltroRelatorio;
  descricao: DescricaoFiltros;
  totais: Indicadores;
  especiais: Indicadores;
  porSetor: LinhaRelatorio[];
  porTipo: LinhaRelatorio[];
  movimentacoes: RegistroHistorico[];
  movimentacoesPorEstado: Record<EstadoVaga, number>;
}

export function descreverPeriodo(periodo: FiltroPeriodo): string {
  if (periodo.inicio && periodo.fim) return `${formatarData(periodo.inicio)} a ${formatarData(periodo.fim)}`;
  if (periodo.inicio) return `A partir de ${formatarData(periodo.inicio)}`;
  if (periodo.fim) return `Até ${formatarData(periodo.fim)}`;
  return 'Todo o histórico';
}

export function gerarRelatorio(
  estrutura: Estrutura,
  dados: DadosOperacionais,
  filtros: FiltroRelatorio,
  agora: Date,
): Relatorio {
  const setoresNoRecorte = estrutura.setores.filter(
    (setor) =>
      (!filtros.estacionamentoId || setor.estacionamentoId === filtros.estacionamentoId) &&
      (!filtros.setorId || setor.id === filtros.setorId),
  );
  const idsSetores = new Set(setoresNoRecorte.map((setor) => setor.id));
  const tiposNoRecorte = estrutura.tiposVaga.filter((tipo) => !filtros.tipoId || tipo.id === filtros.tipoId);
  const idsTipos = new Set(tiposNoRecorte.map((tipo) => tipo.id));
  const idsEspeciais = new Set(estrutura.tiposVaga.filter((tipo) => tipo.especial).map((tipo) => tipo.id));

  const vagas = dados.vagas.filter((vaga) => idsSetores.has(vaga.setorId) && idsTipos.has(vaga.tipoId));

  const movimentacoes = filtrarHistorico(dados.historico, {
    inicio: filtros.inicio,
    fim: filtros.fim,
    estacionamentoId: filtros.estacionamentoId,
    setorId: filtros.setorId,
    tipoId: filtros.tipoId,
  });

  const movimentacoesPorEstado = Object.fromEntries(ESTADOS_VAGA.map((estado) => [estado, 0])) as Record<
    EstadoVaga,
    number
  >;
  for (const registro of movimentacoes) movimentacoesPorEstado[registro.estadoNovo]++;

  const estacionamento = estrutura.estacionamentos.find((item) => item.id === filtros.estacionamentoId);
  const setor = estrutura.setores.find((item) => item.id === filtros.setorId);
  const tipo = estrutura.tiposVaga.find((item) => item.id === filtros.tipoId);

  return {
    geradoEm: agora.toISOString(),
    filtros: { ...filtros },
    descricao: {
      estacionamento: estacionamento?.nome ?? 'Todos os estacionamentos',
      setor: setor ? `${setor.nome} (${setor.descricao})` : 'Todos os setores',
      tipo: tipo?.nome ?? 'Todos os tipos',
      periodo: descreverPeriodo(filtros),
    },
    totais: calcularIndicadores(vagas),
    especiais: calcularIndicadores(vagas.filter((vaga) => idsEspeciais.has(vaga.tipoId))),
    porSetor: setoresNoRecorte.map((item) => ({
      id: item.id,
      nome: `${item.nome} — ${item.descricao}`,
      indicadores: calcularIndicadores(vagas.filter((vaga) => vaga.setorId === item.id)),
    })),
    porTipo: tiposNoRecorte.map((item) => ({
      id: item.id,
      nome: item.nome,
      indicadores: calcularIndicadores(vagas.filter((vaga) => vaga.tipoId === item.id)),
    })),
    movimentacoes,
    movimentacoesPorEstado,
  };
}
