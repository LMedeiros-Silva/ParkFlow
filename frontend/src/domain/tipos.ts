/** Estados operacionais admitidos no MVP (RN03). */
export const ESTADOS_VAGA = ['LIVRE', 'OCUPADA', 'RESERVADA', 'INDISPONIVEL'] as const;
export type EstadoVaga = (typeof ESTADOS_VAGA)[number];

export const ROTULO_ESTADO: Record<EstadoVaga, string> = {
  LIVRE: 'Livre',
  OCUPADA: 'Ocupada',
  RESERVADA: 'Reservada',
  INDISPONIVEL: 'Indisponível',
};

export type TipoVagaId = 'COMUM' | 'PCD' | 'IDOSO' | 'ELETRICA' | 'MOTO';

export interface TipoVaga {
  id: TipoVagaId;
  nome: string;
  /** Vagas especiais são contabilizadas à parte (RN05). */
  especial: boolean;
}

export interface Estacionamento {
  id: string;
  nome: string;
  endereco: string;
  ativo: boolean;
}

export interface Setor {
  id: string;
  estacionamentoId: string;
  nome: string;
  descricao: string;
  ativo: boolean;
}

export interface Vaga {
  id: string;
  codigo: string;
  setorId: string;
  tipoId: TipoVagaId;
  estado: EstadoVaga;
  /** Vagas inativas não são operacionais nem disponíveis (RN06, RN10). */
  ativa: boolean;
  /** Data e hora ISO 8601 da última mudança de estado. */
  atualizadaEm: string;
}

export type OrigemAtualizacao = 'PAINEL_ADMINISTRATIVO' | 'CARGA_INICIAL';

export const ROTULO_ORIGEM: Record<OrigemAtualizacao, string> = {
  PAINEL_ADMINISTRATIVO: 'Painel administrativo',
  CARGA_INICIAL: 'Carga inicial de demonstração',
};

/** Registro imutável de uma mudança efetiva de estado (RN08). */
export interface RegistroHistorico {
  id: string;
  vagaId: string;
  codigoVaga: string;
  setorId: string;
  estacionamentoId: string;
  tipoId: TipoVagaId;
  estadoAnterior: EstadoVaga;
  estadoNovo: EstadoVaga;
  dataHora: string;
  origem: OrigemAtualizacao;
  /** Responsável autenticado, quando houver (RN04). */
  responsavel: string | null;
}

/** Estrutura física do estacionamento, fixa no Checkpoint 5. */
export interface Estrutura {
  estacionamentos: Estacionamento[];
  setores: Setor[];
  tiposVaga: TipoVaga[];
}

/** Dados mutáveis persistidos no navegador. */
export interface DadosOperacionais {
  vagas: Vaga[];
  historico: RegistroHistorico[];
}

export function ehEstadoVaga(valor: unknown): valor is EstadoVaga {
  return typeof valor === 'string' && (ESTADOS_VAGA as readonly string[]).includes(valor);
}
