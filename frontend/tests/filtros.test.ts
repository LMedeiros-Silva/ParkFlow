import { describe, expect, it } from 'vitest';
import { criarDadosIniciais } from '../src/data/seed';
import { paraDataInput } from '../src/domain/datas';
import { dentroDoPeriodo, filtrarHistorico, filtrarVagas, periodoValido } from '../src/domain/filtros';

const AGORA = new Date(2026, 9, 7, 15, 0, 0);
const dados = criarDadosIniciais(AGORA);

describe('filtrarVagas', () => {
  it('filtra por setor, tipo e estado combinados', () => {
    expect(filtrarVagas(dados.vagas, { setorId: 'set-a' })).toHaveLength(20);
    expect(filtrarVagas(dados.vagas, { tipoId: 'PCD' })).toHaveLength(6);
    expect(filtrarVagas(dados.vagas, { setorId: 'set-a', tipoId: 'PCD', estado: 'LIVRE' }).map((v) => v.codigo)).toEqual([
      'A15',
      'A16',
    ]);
  });

  it('sem filtros devolve todas as vagas', () => {
    expect(filtrarVagas(dados.vagas, {})).toHaveLength(60);
    expect(filtrarVagas(dados.vagas, { tipoId: '', estado: '' })).toHaveLength(60);
  });
});

describe('filtrarHistorico (RF13)', () => {
  it('ordena do mais recente para o mais antigo', () => {
    const registros = filtrarHistorico([...dados.historico].reverse(), {});
    const datas = registros.map((registro) => registro.dataHora);
    expect(datas).toEqual([...datas].sort().reverse());
    expect(registros[0].codigoVaga).toBe('A02');
  });

  it('busca por código da vaga sem diferenciar maiúsculas', () => {
    expect(filtrarHistorico(dados.historico, { busca: 'a1' }).map((r) => r.codigoVaga)).toEqual(['A15', 'A12']);
  });

  it('filtra por setor e por novo estado', () => {
    expect(filtrarHistorico(dados.historico, { setorId: 'set-b' })).toHaveLength(3);
    expect(filtrarHistorico(dados.historico, { estado: 'INDISPONIVEL' }).map((r) => r.codigoVaga)).toEqual(['B08', 'A20']);
  });

  it('filtra por período inclusivo em dias locais', () => {
    const hoje = paraDataInput(AGORA);
    expect(filtrarHistorico(dados.historico, { inicio: hoje, fim: hoje })).toHaveLength(10);
    expect(filtrarHistorico(dados.historico, { inicio: '2026-10-08' })).toHaveLength(0);
    expect(filtrarHistorico(dados.historico, { fim: '2026-10-06' })).toHaveLength(0);
  });

  it('não altera a lista original', () => {
    const original = [...dados.historico];
    filtrarHistorico(dados.historico, { busca: 'c' });
    expect(dados.historico).toEqual(original);
  });
});

describe('período', () => {
  it('valida início anterior ou igual ao fim', () => {
    expect(periodoValido({ inicio: '2026-10-01', fim: '2026-10-07' })).toBe(true);
    expect(periodoValido({ inicio: '2026-10-07', fim: '2026-10-07' })).toBe(true);
    expect(periodoValido({ inicio: '2026-10-08', fim: '2026-10-07' })).toBe(false);
    expect(periodoValido({})).toBe(true);
  });

  it('considera os limites do dia', () => {
    expect(dentroDoPeriodo(new Date(2026, 9, 7, 23, 59).toISOString(), { fim: '2026-10-07' })).toBe(true);
    expect(dentroDoPeriodo(new Date(2026, 9, 8, 0, 0).toISOString(), { fim: '2026-10-07' })).toBe(false);
    expect(dentroDoPeriodo(new Date(2026, 9, 7, 0, 0).toISOString(), { inicio: '2026-10-07' })).toBe(true);
  });
});
