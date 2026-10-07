import type { EstadoVaga, Vaga } from './tipos';

/**
 * Fonte única dos cálculos de disponibilidade e ocupação (RN06, RN07, RN09).
 * Dashboard, consulta pública, setores e relatórios usam somente estas funções.
 */
export interface Indicadores {
  /** Vagas cadastradas no recorte, ativas ou não. */
  total: number;
  /** Vagas ativas e LIVRE (RN06). */
  disponiveis: number;
  ocupadas: number;
  reservadas: number;
  indisponiveis: number;
  /** Vagas desativadas logicamente (RN10). */
  inativas: number;
  /** Vagas ativas que não estão INDISPONIVEL (RN07). */
  operacionais: number;
  /** Percentual de 0 a 100, ou null quando não há vaga operacional ("não aplicável"). */
  taxaOcupacao: number | null;
}

export function ehDisponivel(vaga: Vaga): boolean {
  return vaga.ativa && vaga.estado === 'LIVRE';
}

export function ehOperacional(vaga: Vaga): boolean {
  return vaga.ativa && vaga.estado !== 'INDISPONIVEL';
}

export function calcularTaxaOcupacao(ocupadas: number, reservadas: number, operacionais: number): number | null {
  if (operacionais <= 0) return null;
  return ((ocupadas + reservadas) / operacionais) * 100;
}

export function calcularIndicadores(vagas: readonly Vaga[]): Indicadores {
  const ativas: Record<EstadoVaga, number> = { LIVRE: 0, OCUPADA: 0, RESERVADA: 0, INDISPONIVEL: 0 };
  let inativas = 0;

  for (const vaga of vagas) {
    if (!vaga.ativa) {
      inativas++;
      continue;
    }
    ativas[vaga.estado]++;
  }

  const operacionais = ativas.LIVRE + ativas.OCUPADA + ativas.RESERVADA;

  return {
    total: vagas.length,
    disponiveis: ativas.LIVRE,
    ocupadas: ativas.OCUPADA,
    reservadas: ativas.RESERVADA,
    indisponiveis: ativas.INDISPONIVEL,
    inativas,
    operacionais,
    taxaOcupacao: calcularTaxaOcupacao(ativas.OCUPADA, ativas.RESERVADA, operacionais),
  };
}

/** Agrupa vagas por uma chave e calcula os indicadores de cada grupo, preservando a ordem das chaves. */
export function indicadoresPor<K extends string>(
  vagas: readonly Vaga[],
  chaves: readonly K[],
  chaveDaVaga: (vaga: Vaga) => K,
): Map<K, Indicadores> {
  const grupos = new Map<K, Vaga[]>(chaves.map((chave) => [chave, []]));
  for (const vaga of vagas) {
    grupos.get(chaveDaVaga(vaga))?.push(vaga);
  }
  return new Map([...grupos].map(([chave, lista]) => [chave, calcularIndicadores(lista)]));
}

export const TEXTO_NAO_APLICAVEL = 'não aplicável';

export function formatarTaxa(taxa: number | null): string {
  if (taxa === null) return TEXTO_NAO_APLICAVEL;
  return `${taxa.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}
