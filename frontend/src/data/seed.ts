import type {
  DadosOperacionais,
  EstadoVaga,
  Estrutura,
  RegistroHistorico,
  Setor,
  TipoVagaId,
  Vaga,
} from '../domain/tipos';

/**
 * Dados de demonstração determinísticos (sem aleatoriedade). Dado o mesmo "agora",
 * o resultado é sempre idêntico. Os estados são fictícios e não vêm de sensores.
 */

export const ESTRUTURA: Estrutura = {
  estacionamentos: [
    { id: 'est-center', nome: 'ParkFlow Center', endereco: 'São Paulo - SP', ativo: true },
  ],
  setores: [
    { id: 'set-a', estacionamentoId: 'est-center', nome: 'Setor A', descricao: 'Térreo', ativo: true },
    { id: 'set-b', estacionamentoId: 'est-center', nome: 'Setor B', descricao: 'Piso 1', ativo: true },
    { id: 'set-c', estacionamentoId: 'est-center', nome: 'Setor C', descricao: 'Subsolo', ativo: true },
  ],
  tiposVaga: [
    { id: 'COMUM', nome: 'Comum', especial: false },
    { id: 'PCD', nome: 'PCD', especial: true },
    { id: 'IDOSO', nome: 'Idoso', especial: true },
    { id: 'ELETRICA', nome: 'Elétrica', especial: false },
    { id: 'MOTO', nome: 'Moto', especial: false },
  ],
};

type Linha = readonly [TipoVagaId, EstadoVaga];

const L = 'LIVRE';
const O = 'OCUPADA';
const R = 'RESERVADA';
const I = 'INDISPONIVEL';

/** Tabela fixa por posição (01 a 20) de cada setor. */
const TABELA: Record<string, readonly Linha[]> = {
  // Térreo: 13 Comum, 3 PCD, 2 Idoso, 2 Elétrica — 9 ocupadas, 1 reservada, 2 indisponíveis (~56%).
  'set-a': [
    ['COMUM', L], ['COMUM', O], ['COMUM', O], ['COMUM', L], ['COMUM', O],
    ['COMUM', I], ['COMUM', O], ['COMUM', L], ['COMUM', O], ['COMUM', L],
    ['COMUM', O], ['COMUM', R], ['COMUM', L], ['PCD', O], ['PCD', L],
    ['PCD', L], ['IDOSO', O], ['IDOSO', L], ['ELETRICA', O], ['ELETRICA', I],
  ],
  // Piso 1: 12 Comum, 2 PCD, 2 Idoso, 4 Moto — 11 ocupadas, 2 reservadas, 3 indisponíveis (~76%).
  'set-b': [
    ['COMUM', O], ['COMUM', O], ['COMUM', L], ['COMUM', O], ['COMUM', O],
    ['COMUM', R], ['COMUM', O], ['COMUM', I], ['COMUM', O], ['COMUM', O],
    ['COMUM', L], ['COMUM', O], ['PCD', O], ['PCD', L], ['IDOSO', O],
    ['IDOSO', R], ['MOTO', O], ['MOTO', I], ['MOTO', L], ['MOTO', I],
  ],
  // Subsolo: 12 Comum, 1 PCD, 1 Idoso, 2 Elétrica, 4 Moto — 5 ocupadas, 1 reservada, 2 indisponíveis (~33%).
  'set-c': [
    ['COMUM', L], ['COMUM', O], ['COMUM', L], ['COMUM', L], ['COMUM', O],
    ['COMUM', L], ['COMUM', L], ['COMUM', I], ['COMUM', L], ['COMUM', O],
    ['COMUM', L], ['COMUM', L], ['PCD', L], ['IDOSO', O], ['ELETRICA', R],
    ['ELETRICA', L], ['MOTO', O], ['MOTO', L], ['MOTO', I], ['MOTO', L],
  ],
};

/** Movimentações iniciais: [código, estado anterior, minutos atrás]. O novo estado é o estado atual da vaga. */
const MOVIMENTACOES_INICIAIS: readonly (readonly [string, EstadoVaga, number])[] = [
  ['A02', 'LIVRE', 4],
  ['B06', 'LIVRE', 9],
  ['C14', 'LIVRE', 15],
  ['A15', 'OCUPADA', 22],
  ['B08', 'LIVRE', 31],
  ['A12', 'LIVRE', 44],
  ['C10', 'LIVRE', 58],
  ['B13', 'LIVRE', 73],
  ['C03', 'OCUPADA', 95],
  ['A20', 'LIVRE', 120],
];

/** Vagas sem movimentação inicial recebem esta idade de atualização. */
const MINUTOS_SEM_MOVIMENTACAO = 180;

function minutosAntes(agora: Date, minutos: number): string {
  return new Date(agora.getTime() - minutos * 60_000).toISOString();
}

function letraDoSetor(setor: Setor): string {
  return setor.nome.replace('Setor ', '');
}

export function criarDadosIniciais(agora: Date = new Date()): DadosOperacionais {
  const minutosPorCodigo = new Map(MOVIMENTACOES_INICIAIS.map(([codigo, , minutos]) => [codigo, minutos]));

  const vagas: Vaga[] = ESTRUTURA.setores.flatMap((setor) =>
    TABELA[setor.id].map(([tipoId, estado], indice) => {
      const codigo = `${letraDoSetor(setor)}${String(indice + 1).padStart(2, '0')}`;
      return {
        id: `vaga-${codigo.toLowerCase()}`,
        codigo,
        setorId: setor.id,
        tipoId,
        estado,
        ativa: true,
        atualizadaEm: minutosAntes(agora, minutosPorCodigo.get(codigo) ?? MINUTOS_SEM_MOVIMENTACAO),
      };
    }),
  );

  const historico: RegistroHistorico[] = MOVIMENTACOES_INICIAIS.map(([codigo, estadoAnterior, minutos], indice) => {
    const vaga = vagas.find((item) => item.codigo === codigo);
    const setor = ESTRUTURA.setores.find((item) => item.id === vaga?.setorId);
    if (!vaga || !setor) throw new Error(`Seed inconsistente: vaga ${codigo} não encontrada.`);
    return {
      id: `hist-seed-${String(indice + 1).padStart(2, '0')}`,
      vagaId: vaga.id,
      codigoVaga: vaga.codigo,
      setorId: setor.id,
      estacionamentoId: setor.estacionamentoId,
      tipoId: vaga.tipoId,
      estadoAnterior,
      estadoNovo: vaga.estado,
      dataHora: minutosAntes(agora, minutos),
      origem: 'CARGA_INICIAL',
      responsavel: null,
    };
  });

  return { vagas, historico };
}
