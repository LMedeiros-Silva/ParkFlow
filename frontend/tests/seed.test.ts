import { describe, expect, it } from 'vitest';
import { criarDadosIniciais, ESTRUTURA } from '../src/data/seed';
import { calcularIndicadores } from '../src/domain/indicadores';

const AGORA = new Date('2026-10-07T15:00:00.000Z');

describe('seed de demonstração', () => {
  const dados = criarDadosIniciais(AGORA);

  it('possui 1 estacionamento, 3 setores e 60 vagas, 20 por setor', () => {
    expect(ESTRUTURA.estacionamentos).toHaveLength(1);
    expect(ESTRUTURA.setores.map((setor) => setor.descricao)).toEqual(['Térreo', 'Piso 1', 'Subsolo']);
    expect(dados.vagas).toHaveLength(60);
    for (const setor of ESTRUTURA.setores) {
      expect(dados.vagas.filter((vaga) => vaga.setorId === setor.id)).toHaveLength(20);
    }
  });

  it('usa códigos e IDs únicos de A01 a C20', () => {
    const codigos = dados.vagas.map((vaga) => vaga.codigo);
    expect(new Set(codigos).size).toBe(60);
    expect(new Set(dados.vagas.map((vaga) => vaga.id)).size).toBe(60);
    expect(codigos[0]).toBe('A01');
    expect(codigos[59]).toBe('C20');
    expect(codigos.every((codigo) => /^[ABC](0[1-9]|1\d|20)$/.test(codigo))).toBe(true);
  });

  it('mantém A01 como vaga comum e livre para a demonstração', () => {
    expect(dados.vagas[0]).toMatchObject({ codigo: 'A01', tipoId: 'COMUM', estado: 'LIVRE', ativa: true });
  });

  it('distribui os tipos conforme a tabela de cada setor', () => {
    const contar = (setorId: string) =>
      dados.vagas
        .filter((vaga) => vaga.setorId === setorId)
        .reduce<Record<string, number>>((acc, vaga) => ({ ...acc, [vaga.tipoId]: (acc[vaga.tipoId] ?? 0) + 1 }), {});
    expect(contar('set-a')).toEqual({ COMUM: 13, PCD: 3, IDOSO: 2, ELETRICA: 2 });
    expect(contar('set-b')).toEqual({ COMUM: 12, PCD: 2, IDOSO: 2, MOTO: 4 });
    expect(contar('set-c')).toEqual({ COMUM: 12, PCD: 1, IDOSO: 1, ELETRICA: 2, MOTO: 4 });
  });

  it('tem ocupação diferente por setor e estados variados', () => {
    const taxa = (setorId: string) =>
      calcularIndicadores(dados.vagas.filter((vaga) => vaga.setorId === setorId)).taxaOcupacao ?? 0;
    expect(taxa('set-a')).toBeCloseTo(55.6, 1);
    expect(taxa('set-b')).toBeCloseTo(76.5, 1);
    expect(taxa('set-c')).toBeCloseTo(33.3, 1);
    const geral = calcularIndicadores(dados.vagas);
    expect(geral).toMatchObject({ disponiveis: 24, ocupadas: 25, reservadas: 4, indisponiveis: 7, operacionais: 53 });
  });

  it('marca PCD e Idoso como especiais', () => {
    expect(ESTRUTURA.tiposVaga.filter((tipo) => tipo.especial).map((tipo) => tipo.id)).toEqual(['PCD', 'IDOSO']);
  });

  it('é determinístico para o mesmo instante', () => {
    expect(criarDadosIniciais(AGORA)).toEqual(dados);
  });

  it('gera histórico inicial coerente com o estado atual das vagas', () => {
    expect(dados.historico).toHaveLength(10);
    for (const registro of dados.historico) {
      const vaga = dados.vagas.find((item) => item.id === registro.vagaId);
      expect(vaga?.estado).toBe(registro.estadoNovo);
      expect(vaga?.atualizadaEm).toBe(registro.dataHora);
      expect(registro.estadoAnterior).not.toBe(registro.estadoNovo);
      expect(registro.origem).toBe('CARGA_INICIAL');
      expect(new Date(registro.dataHora).getTime()).toBeLessThan(AGORA.getTime());
    }
  });
});
