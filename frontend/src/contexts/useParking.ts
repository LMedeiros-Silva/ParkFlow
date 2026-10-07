import { createContext, useContext } from 'react';
import type { Indicadores } from '../domain/indicadores';
import type { EstadoVaga, Estrutura, RegistroHistorico, Vaga } from '../domain/tipos';

export type ResultadoSalvar =
  | { ok: true; vaga: Vaga; registro: RegistroHistorico }
  | { ok: false; erro: string };

export interface ValorParking {
  estrutura: Estrutura;
  vagas: Vaga[];
  historico: RegistroHistorico[];
  /** Indicadores derivados do estado corrente; nunca armazenados (RN09). */
  indicadores: Indicadores;
  indicadoresPorSetor: Map<string, Indicadores>;
  ultimaAtualizacao: string | null;
  /** Falso quando o localStorage está indisponível e os dados vivem só na memória. */
  persistente: boolean;
  aviso: string | null;
  dispensarAviso: () => void;
  alterarEstado: (vagaId: string, novoEstado: EstadoVaga, responsavel: string | null) => ResultadoSalvar;
  restaurar: () => void;
}

export const ParkingContext = createContext<ValorParking | null>(null);

export function useParking(): ValorParking {
  const valor = useContext(ParkingContext);
  if (!valor) throw new Error('useParking deve ser usado dentro de ParkingProvider.');
  return valor;
}
