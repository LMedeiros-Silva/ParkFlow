import { describe, expect, it } from 'vitest';
import { criarDadosIniciais, ESTRUTURA } from '../src/data/seed';
import { alterarEstadoVaga, ErroAlteracaoVaga, ultimaAtualizacao } from '../src/domain/vagas';
import type { ContextoAlteracao } from '../src/domain/vagas';

const AGORA = new Date('2026-10-07T15:00:00.000Z');
const DEPOIS = new Date('2026-10-07T15:05:00.000Z');

const contexto: ContextoAlteracao = {
  agora: DEPOIS,
  origem: 'PAINEL_ADMINISTRATIVO',
  responsavel: 'admin@parkflow.com',
  setores: ESTRUTURA.setores,
};

describe('alterarEstadoVaga (RF08, RN04, RN08)', () => {
  it('altera o estado, atualiza a data e cria um registro histórico completo', () => {
    const dados = criarDadosIniciais(AGORA);
    const resultado = alterarEstadoVaga(dados, 'vaga-a01', 'OCUPADA', contexto);

    expect(resultado.vaga).toMatchObject({ codigo: 'A01', estado: 'OCUPADA', atualizadaEm: DEPOIS.toISOString() });
    expect(resultado.registro).toMatchObject({
      vagaId: 'vaga-a01',
      codigoVaga: 'A01',
      setorId: 'set-a',
      estacionamentoId: 'est-center',
      tipoId: 'COMUM',
      estadoAnterior: 'LIVRE',
      estadoNovo: 'OCUPADA',
      dataHora: DEPOIS.toISOString(),
      origem: 'PAINEL_ADMINISTRATIVO',
      responsavel: 'admin@parkflow.com',
    });
    expect(resultado.dados.historico[0]).toBe(resultado.registro);
    expect(resultado.dados.historico).toHaveLength(dados.historico.length + 1);
    expect(resultado.dados.vagas.find((vaga) => vaga.id === 'vaga-a01')?.estado).toBe('OCUPADA');
  });

  it('não modifica os dados recebidos (função pura)', () => {
    const dados = criarDadosIniciais(AGORA);
    const copia = structuredClone(dados);
    alterarEstadoVaga(dados, 'vaga-a01', 'RESERVADA', contexto);
    expect(dados).toEqual(copia);
  });

  it('rejeita repetir o mesmo estado sem criar evento', () => {
    const dados = criarDadosIniciais(AGORA);
    expect(() => alterarEstadoVaga(dados, 'vaga-a01', 'LIVRE', contexto)).toThrow(ErroAlteracaoVaga);
    expect(() => alterarEstadoVaga(dados, 'vaga-a01', 'LIVRE', contexto)).toThrow(/já está livre/);
  });

  it('rejeita vaga desativada', () => {
    const dados = criarDadosIniciais(AGORA);
    dados.vagas = dados.vagas.map((vaga) => (vaga.id === 'vaga-a01' ? { ...vaga, ativa: false } : vaga));
    expect(() => alterarEstadoVaga(dados, 'vaga-a01', 'OCUPADA', contexto)).toThrow(/desativada/);
  });

  it('rejeita vaga inexistente e estado inválido', () => {
    const dados = criarDadosIniciais(AGORA);
    expect(() => alterarEstadoVaga(dados, 'vaga-z99', 'OCUPADA', contexto)).toThrow(/não encontrada/);
    expect(() => alterarEstadoVaga(dados, 'vaga-a01', 'QUEBRADA' as never, contexto)).toThrow(/não é permitido/);
  });

  it('gera identificadores distintos para alterações sucessivas', () => {
    const dados = criarDadosIniciais(AGORA);
    const primeira = alterarEstadoVaga(dados, 'vaga-a01', 'OCUPADA', contexto);
    const segunda = alterarEstadoVaga(primeira.dados, 'vaga-a01', 'LIVRE', contexto);
    expect(segunda.registro.id).not.toBe(primeira.registro.id);
    expect(segunda.registro.estadoAnterior).toBe('OCUPADA');
  });

  it('informa a última atualização mais recente', () => {
    const dados = criarDadosIniciais(AGORA);
    expect(ultimaAtualizacao(dados.vagas)).toBe(new Date(AGORA.getTime() - 4 * 60_000).toISOString());
    const alterado = alterarEstadoVaga(dados, 'vaga-c01', 'OCUPADA', contexto);
    expect(ultimaAtualizacao(alterado.dados.vagas)).toBe(DEPOIS.toISOString());
    expect(ultimaAtualizacao([])).toBeNull();
  });
});
