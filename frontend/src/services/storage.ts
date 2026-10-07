import { criarDadosIniciais, ESTRUTURA } from '../data/seed';
import { ehEstadoVaga, type DadosOperacionais, type RegistroHistorico, type Vaga } from '../domain/tipos';

/**
 * Único ponto de acesso ao armazenamento do navegador. Recebe o Storage por parâmetro
 * para poder ser testado sem navegador. Não há backend: os dados vivem no localStorage.
 */

export const CHAVE_SESSAO = 'parkflow:sessao';
export const CHAVE_DADOS = 'parkflow:dados:v1';
export const VERSAO_DADOS = 1;

export interface DadosPersistidos extends DadosOperacionais {
  versao: typeof VERSAO_DADOS;
}

export interface ResultadoCarga {
  dados: DadosOperacionais;
  /** Mensagem para o usuário quando os dados precisaram ser recriados. */
  aviso: string | null;
}

export interface Sessao {
  email: string;
  nome: string;
  iniciadaEm: string;
}

/** Storage em memória, usado em testes e quando o localStorage está indisponível. */
export function criarStorageMemoria(): Storage {
  const itens = new Map<string, string>();
  return {
    get length() {
      return itens.size;
    },
    clear: () => itens.clear(),
    getItem: (chave) => itens.get(chave) ?? null,
    key: (indice) => [...itens.keys()][indice] ?? null,
    removeItem: (chave) => {
      itens.delete(chave);
    },
    setItem: (chave, valor) => {
      itens.set(chave, String(valor));
    },
  };
}

export interface StorageDisponivel {
  storage: Storage;
  persistente: boolean;
}

/** Usa o localStorage quando ele funciona; caso contrário, cai para memória (dados se perdem ao recarregar). */
export function obterStorageNavegador(): StorageDisponivel {
  try {
    const storage = window.localStorage;
    const teste = 'parkflow:teste';
    storage.setItem(teste, '1');
    storage.removeItem(teste);
    return { storage, persistente: true };
  } catch {
    return { storage: criarStorageMemoria(), persistente: false };
  }
}

const IDS_SETORES = new Set(ESTRUTURA.setores.map((setor) => setor.id));
const IDS_TIPOS = new Set<string>(ESTRUTURA.tiposVaga.map((tipo) => tipo.id));

function vagaValida(valor: unknown): valor is Vaga {
  if (typeof valor !== 'object' || valor === null) return false;
  const vaga = valor as Record<string, unknown>;
  return (
    typeof vaga.id === 'string' &&
    typeof vaga.codigo === 'string' &&
    typeof vaga.setorId === 'string' &&
    IDS_SETORES.has(vaga.setorId) &&
    typeof vaga.tipoId === 'string' &&
    IDS_TIPOS.has(vaga.tipoId) &&
    ehEstadoVaga(vaga.estado) &&
    typeof vaga.ativa === 'boolean' &&
    typeof vaga.atualizadaEm === 'string'
  );
}

function registroValido(valor: unknown): valor is RegistroHistorico {
  if (typeof valor !== 'object' || valor === null) return false;
  const registro = valor as Record<string, unknown>;
  return (
    typeof registro.id === 'string' &&
    typeof registro.vagaId === 'string' &&
    typeof registro.codigoVaga === 'string' &&
    typeof registro.setorId === 'string' &&
    ehEstadoVaga(registro.estadoAnterior) &&
    ehEstadoVaga(registro.estadoNovo) &&
    typeof registro.dataHora === 'string'
  );
}

function dadosValidos(valor: unknown): valor is DadosPersistidos {
  if (typeof valor !== 'object' || valor === null) return false;
  const dados = valor as Record<string, unknown>;
  return (
    dados.versao === VERSAO_DADOS &&
    Array.isArray(dados.vagas) &&
    dados.vagas.length > 0 &&
    dados.vagas.every(vagaValida) &&
    Array.isArray(dados.historico) &&
    dados.historico.every(registroValido)
  );
}

/**
 * Grava vagas e histórico juntos em um único setItem, simulando a atomicidade do RNF09:
 * ou o conjunto inteiro é gravado, ou nada muda.
 */
export function salvarDados(storage: Storage, dados: DadosOperacionais): boolean {
  const persistidos: DadosPersistidos = { versao: VERSAO_DADOS, vagas: dados.vagas, historico: dados.historico };
  try {
    storage.setItem(CHAVE_DADOS, JSON.stringify(persistidos));
    return true;
  } catch {
    return false;
  }
}

export function restaurarDemonstracao(storage: Storage, agora: Date = new Date()): DadosOperacionais {
  const dados = criarDadosIniciais(agora);
  salvarDados(storage, dados);
  return dados;
}

export function carregarDados(storage: Storage, agora: Date = new Date()): ResultadoCarga {
  let bruto: string | null;
  try {
    bruto = storage.getItem(CHAVE_DADOS);
  } catch {
    bruto = null;
  }

  if (bruto === null) {
    return { dados: restaurarDemonstracao(storage, agora), aviso: null };
  }

  try {
    const valor: unknown = JSON.parse(bruto);
    if (dadosValidos(valor)) {
      return { dados: { vagas: valor.vagas, historico: valor.historico }, aviso: null };
    }
  } catch {
    // JSON corrompido: tratado abaixo, recarregando a demonstração.
  }

  return {
    dados: restaurarDemonstracao(storage, agora),
    aviso: 'Os dados salvos neste navegador estavam inválidos ou eram de outra versão. Os dados de demonstração foram recarregados.',
  };
}

function sessaoValida(valor: unknown): valor is Sessao {
  if (typeof valor !== 'object' || valor === null) return false;
  const sessao = valor as Record<string, unknown>;
  return typeof sessao.email === 'string' && typeof sessao.nome === 'string' && typeof sessao.iniciadaEm === 'string';
}

export function carregarSessao(storage: Storage): Sessao | null {
  try {
    const bruto = storage.getItem(CHAVE_SESSAO);
    if (bruto === null) return null;
    const valor: unknown = JSON.parse(bruto);
    return sessaoValida(valor) ? valor : null;
  } catch {
    return null;
  }
}

export function salvarSessao(storage: Storage, sessao: Sessao): void {
  try {
    storage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  } catch {
    // Sem persistência, a sessão vale apenas enquanto a página estiver aberta.
  }
}

export function encerrarSessao(storage: Storage): void {
  try {
    storage.removeItem(CHAVE_SESSAO);
  } catch {
    // Nada a remover.
  }
}
