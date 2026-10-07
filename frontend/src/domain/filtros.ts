import { limiteDoDia } from './datas';
import type { EstadoVaga, RegistroHistorico, TipoVagaId, Vaga } from './tipos';

export interface FiltroVagas {
  setorId?: string;
  tipoId?: TipoVagaId | '';
  estado?: EstadoVaga | '';
}

export function filtrarVagas(vagas: readonly Vaga[], filtro: FiltroVagas): Vaga[] {
  return vagas.filter(
    (vaga) =>
      (!filtro.setorId || vaga.setorId === filtro.setorId) &&
      (!filtro.tipoId || vaga.tipoId === filtro.tipoId) &&
      (!filtro.estado || vaga.estado === filtro.estado),
  );
}

export interface FiltroPeriodo {
  /** AAAA-MM-DD, inclusivo. Vazio = sem limite. */
  inicio?: string;
  /** AAAA-MM-DD, inclusivo. Vazio = sem limite. */
  fim?: string;
}

export interface FiltroHistorico extends FiltroPeriodo {
  busca?: string;
  estacionamentoId?: string;
  setorId?: string;
  tipoId?: TipoVagaId | '';
  /** Filtra pelo estado de destino da alteração. */
  estado?: EstadoVaga | '';
}

export function periodoValido(periodo: FiltroPeriodo): boolean {
  if (!periodo.inicio || !periodo.fim) return true;
  const inicio = limiteDoDia(periodo.inicio, 'inicio');
  const fim = limiteDoDia(periodo.fim, 'fim');
  return !inicio || !fim || inicio <= fim;
}

export function dentroDoPeriodo(iso: string, periodo: FiltroPeriodo): boolean {
  const momento = new Date(iso).getTime();
  const inicio = periodo.inicio ? limiteDoDia(periodo.inicio, 'inicio') : null;
  const fim = periodo.fim ? limiteDoDia(periodo.fim, 'fim') : null;
  if (inicio && momento < inicio.getTime()) return false;
  if (fim && momento > fim.getTime()) return false;
  return true;
}

/** Filtra o histórico e devolve do mais recente para o mais antigo. Não altera a lista recebida (RN08). */
export function filtrarHistorico(historico: readonly RegistroHistorico[], filtro: FiltroHistorico): RegistroHistorico[] {
  const busca = filtro.busca?.trim().toLocaleLowerCase('pt-BR') ?? '';
  return historico
    .filter(
      (registro) =>
        (!busca ||
          registro.codigoVaga.toLocaleLowerCase('pt-BR').includes(busca) ||
          (registro.responsavel ?? '').toLocaleLowerCase('pt-BR').includes(busca)) &&
        (!filtro.estacionamentoId || registro.estacionamentoId === filtro.estacionamentoId) &&
        (!filtro.setorId || registro.setorId === filtro.setorId) &&
        (!filtro.tipoId || registro.tipoId === filtro.tipoId) &&
        (!filtro.estado || registro.estadoNovo === filtro.estado) &&
        dentroDoPeriodo(registro.dataHora, filtro),
    )
    .sort((a, b) => b.dataHora.localeCompare(a.dataHora));
}
