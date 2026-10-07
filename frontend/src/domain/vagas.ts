import {
  ehEstadoVaga,
  ROTULO_ESTADO,
  type DadosOperacionais,
  type EstadoVaga,
  type OrigemAtualizacao,
  type RegistroHistorico,
  type Setor,
  type Vaga,
} from './tipos';

export class ErroAlteracaoVaga extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = 'ErroAlteracaoVaga';
  }
}

export interface ContextoAlteracao {
  agora: Date;
  origem: OrigemAtualizacao;
  responsavel: string | null;
  setores: readonly Setor[];
}

export interface ResultadoAlteracao {
  dados: DadosOperacionais;
  vaga: Vaga;
  registro: RegistroHistorico;
}

/**
 * Altera o estado de uma vaga e gera o registro histórico correspondente (RF08, RN04, RN08).
 * Função pura: devolve novos dados sem modificar os recebidos, para que vaga e histórico
 * sejam gravados juntos em uma única operação (RNF09).
 */
export function alterarEstadoVaga(
  dados: DadosOperacionais,
  vagaId: string,
  novoEstado: EstadoVaga,
  contexto: ContextoAlteracao,
): ResultadoAlteracao {
  if (!ehEstadoVaga(novoEstado)) {
    throw new ErroAlteracaoVaga('Estado informado não é permitido.');
  }

  const vagaAtual = dados.vagas.find((vaga) => vaga.id === vagaId);
  if (!vagaAtual) {
    throw new ErroAlteracaoVaga('Vaga não encontrada.');
  }
  if (!vagaAtual.ativa) {
    throw new ErroAlteracaoVaga(`A vaga ${vagaAtual.codigo} está desativada e não pode ter o estado alterado.`);
  }
  if (vagaAtual.estado === novoEstado) {
    throw new ErroAlteracaoVaga(
      `A vaga ${vagaAtual.codigo} já está ${ROTULO_ESTADO[novoEstado].toLowerCase()}; nenhuma alteração foi registrada.`,
    );
  }

  const setor = contexto.setores.find((item) => item.id === vagaAtual.setorId);
  if (!setor) {
    throw new ErroAlteracaoVaga('Setor da vaga não encontrado.');
  }

  const dataHora = contexto.agora.toISOString();
  const vaga: Vaga = { ...vagaAtual, estado: novoEstado, atualizadaEm: dataHora };
  const registro: RegistroHistorico = {
    id: `hist-${contexto.agora.getTime()}-${vagaAtual.id}-${dados.historico.length + 1}`,
    vagaId: vagaAtual.id,
    codigoVaga: vagaAtual.codigo,
    setorId: setor.id,
    estacionamentoId: setor.estacionamentoId,
    tipoId: vagaAtual.tipoId,
    estadoAnterior: vagaAtual.estado,
    estadoNovo: novoEstado,
    dataHora,
    origem: contexto.origem,
    responsavel: contexto.responsavel,
  };

  return {
    dados: {
      vagas: dados.vagas.map((item) => (item.id === vaga.id ? vaga : item)),
      historico: [registro, ...dados.historico],
    },
    vaga,
    registro,
  };
}

/** Momento mais recente em que alguma vaga do recorte mudou (indicação de última atualização, RF09). */
export function ultimaAtualizacao(vagas: readonly Vaga[]): string | null {
  let maisRecente: string | null = null;
  for (const vaga of vagas) {
    if (maisRecente === null || vaga.atualizadaEm > maisRecente) {
      maisRecente = vaga.atualizadaEm;
    }
  }
  return maisRecente;
}
