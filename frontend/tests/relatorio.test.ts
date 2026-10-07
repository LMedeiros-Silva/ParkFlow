import { describe, expect, it } from 'vitest';
import { criarDadosIniciais, ESTRUTURA } from '../src/data/seed';
import { BOM, escaparCampo, nomeArquivoRelatorio, relatorioParaCsv } from '../src/domain/csv';
import { paraDataInput } from '../src/domain/datas';
import { calcularIndicadores } from '../src/domain/indicadores';
import { gerarRelatorio, type FiltroRelatorio } from '../src/domain/relatorio';
import { alterarEstadoVaga } from '../src/domain/vagas';

const AGORA = new Date(2026, 9, 7, 15, 0, 0);
const HOJE = paraDataInput(AGORA);
const SEM_FILTRO: FiltroRelatorio = { estacionamentoId: '', setorId: '', tipoId: '', inicio: '', fim: '' };

describe('gerarRelatorio (RF15, RN09)', () => {
  it('usa os mesmos cálculos do dashboard para o estado corrente', () => {
    const dados = criarDadosIniciais(AGORA);
    const relatorio = gerarRelatorio(ESTRUTURA, dados, SEM_FILTRO, AGORA);
    expect(relatorio.totais).toEqual(calcularIndicadores(dados.vagas));
    expect(relatorio.porSetor.map((linha) => linha.indicadores.total)).toEqual([20, 20, 20]);
    expect(relatorio.porTipo.reduce((soma, linha) => soma + linha.indicadores.total, 0)).toBe(60);
    expect(relatorio.especiais.total).toBe(11);
    expect(relatorio.geradoEm).toBe(AGORA.toISOString());
  });

  it('aplica setor e tipo aos totais e às movimentações', () => {
    const dados = criarDadosIniciais(AGORA);
    const relatorio = gerarRelatorio(
      ESTRUTURA,
      dados,
      { ...SEM_FILTRO, estacionamentoId: 'est-center', setorId: 'set-a', tipoId: 'PCD' },
      AGORA,
    );
    expect(relatorio.totais.total).toBe(3);
    expect(relatorio.porSetor).toHaveLength(1);
    expect(relatorio.porTipo).toHaveLength(1);
    expect(relatorio.movimentacoes.map((registro) => registro.codigoVaga)).toEqual(['A15']);
    expect(relatorio.descricao.setor).toBe('Setor A (Térreo)');
    expect(relatorio.descricao.tipo).toBe('PCD');
  });

  it('o período filtra só as movimentações; os totais continuam sendo a fotografia atual', () => {
    const dados = criarDadosIniciais(AGORA);
    const semPeriodo = gerarRelatorio(ESTRUTURA, dados, SEM_FILTRO, AGORA);
    const periodoFuturo = gerarRelatorio(ESTRUTURA, dados, { ...SEM_FILTRO, inicio: '2026-10-08', fim: '2026-10-09' }, AGORA);
    expect(periodoFuturo.totais).toEqual(semPeriodo.totais);
    expect(periodoFuturo.movimentacoes).toHaveLength(0);
    expect(semPeriodo.movimentacoes).toHaveLength(10);
    expect(periodoFuturo.descricao.periodo).toBe('08/10/2026 a 09/10/2026');
  });

  it('conta movimentações por novo estado e reflete alterações recentes', () => {
    const inicial = criarDadosIniciais(AGORA);
    const { dados } = alterarEstadoVaga(inicial, 'vaga-a01', 'OCUPADA', {
      agora: AGORA,
      origem: 'PAINEL_ADMINISTRATIVO',
      responsavel: 'admin@parkflow.com',
      setores: ESTRUTURA.setores,
    });
    const relatorio = gerarRelatorio(ESTRUTURA, dados, { ...SEM_FILTRO, inicio: HOJE, fim: HOJE }, AGORA);
    expect(relatorio.movimentacoes).toHaveLength(11);
    expect(relatorio.movimentacoesPorEstado.OCUPADA).toBe(5);
    expect(relatorio.totais.ocupadas).toBe(26);
  });
});

describe('exportação CSV (RF16)', () => {
  it('escapa separador, aspas e quebras de linha', () => {
    expect(escaparCampo('simples')).toBe('simples');
    expect(escaparCampo('a;b')).toBe('"a;b"');
    expect(escaparCampo('diz "oi"')).toBe('"diz ""oi"""');
    expect(escaparCampo('linha\nnova')).toBe('"linha\nnova"');
    expect(escaparCampo(42)).toBe('42');
  });

  it('gera CSV com BOM, ponto e vírgula, filtros, momento e linhas de dados', () => {
    const dados = criarDadosIniciais(AGORA);
    const relatorio = gerarRelatorio(ESTRUTURA, dados, { ...SEM_FILTRO, estacionamentoId: 'est-center' }, AGORA);
    const csv = relatorioParaCsv(relatorio, ESTRUTURA);
    const linhas = csv.slice(1).split('\r\n');

    expect(csv.startsWith(BOM)).toBe(true);
    expect(linhas[0]).toBe('Relatório operacional ParkFlow');
    expect(linhas[1]).toMatch(/^Gerado em;07\/10\/2026/);
    expect(linhas).toContain('Estacionamento;ParkFlow Center');
    expect(linhas).toContain('Período das movimentações;Todo o histórico');
    expect(linhas).toContain('Recorte selecionado;60;24;25;4;7;0;53;54,7%');
    expect(linhas).toContain('Setor A — Térreo;20;8;9;1;2;0;18;55,6%');
    expect(linhas).toContain('Movimentações no período;10');
    expect(linhas.some((linha) => linha.startsWith('07/10/2026') && linha.includes(';A02;Setor A;Comum;Livre;Ocupada;'))).toBe(
      true,
    );
  });

  it('nomeia o arquivo com data e hora da geração', () => {
    expect(nomeArquivoRelatorio(AGORA.toISOString())).toBe('parkflow-relatorio-20261007-1500.csv');
  });
});
