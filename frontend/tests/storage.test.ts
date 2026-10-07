import { describe, expect, it } from 'vitest';
import { criarDadosIniciais, ESTRUTURA } from '../src/data/seed';
import { alterarEstadoVaga } from '../src/domain/vagas';
import { autenticar, CREDENCIAIS_DEMO } from '../src/services/auth';
import {
  carregarDados,
  carregarSessao,
  CHAVE_DADOS,
  CHAVE_SESSAO,
  criarStorageMemoria,
  encerrarSessao,
  restaurarDemonstracao,
  salvarDados,
  salvarSessao,
} from '../src/services/storage';

const AGORA = new Date('2026-10-07T15:00:00.000Z');

describe('storage de dados', () => {
  it('carrega o seed e o grava quando não há dados salvos', () => {
    const storage = criarStorageMemoria();
    const carga = carregarDados(storage, AGORA);
    expect(carga.aviso).toBeNull();
    expect(carga.dados).toEqual(criarDadosIniciais(AGORA));
    expect(JSON.parse(storage.getItem(CHAVE_DADOS) ?? '{}').versao).toBe(1);
  });

  it('persiste vagas e histórico juntos em uma única chave', () => {
    const storage = criarStorageMemoria();
    const { dados } = carregarDados(storage, AGORA);
    const alterado = alterarEstadoVaga(dados, 'vaga-a01', 'OCUPADA', {
      agora: AGORA,
      origem: 'PAINEL_ADMINISTRATIVO',
      responsavel: 'admin@parkflow.com',
      setores: ESTRUTURA.setores,
    });
    expect(salvarDados(storage, alterado.dados)).toBe(true);
    expect(storage.length).toBe(1);

    const recarregado = carregarDados(storage, new Date('2026-10-08T00:00:00.000Z'));
    expect(recarregado.aviso).toBeNull();
    expect(recarregado.dados.vagas[0].estado).toBe('OCUPADA');
    expect(recarregado.dados.historico[0].codigoVaga).toBe('A01');
  });

  it('não grava nada quando o storage falha, sinalizando o erro', () => {
    const storage = criarStorageMemoria();
    const original = carregarDados(storage, AGORA).dados;
    const bruto = storage.getItem(CHAVE_DADOS);
    const quebrado: Storage = {
      ...storage,
      getItem: storage.getItem,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    };
    const alterado = alterarEstadoVaga(original, 'vaga-a01', 'OCUPADA', {
      agora: AGORA,
      origem: 'PAINEL_ADMINISTRATIVO',
      responsavel: null,
      setores: ESTRUTURA.setores,
    });
    expect(salvarDados(quebrado, alterado.dados)).toBe(false);
    expect(storage.getItem(CHAVE_DADOS)).toBe(bruto);
  });

  it('recarrega o seed com aviso quando o JSON está corrompido', () => {
    const storage = criarStorageMemoria();
    storage.setItem(CHAVE_DADOS, '{isto não é json');
    const carga = carregarDados(storage, AGORA);
    expect(carga.aviso).toMatch(/recarregados/);
    expect(carga.dados.vagas).toHaveLength(60);
    expect(JSON.parse(storage.getItem(CHAVE_DADOS) ?? '{}').vagas).toHaveLength(60);
  });

  it('recarrega o seed com aviso quando a versão ou a estrutura são diferentes', () => {
    const storage = criarStorageMemoria();
    storage.setItem(CHAVE_DADOS, JSON.stringify({ versao: 2, vagas: [], historico: [] }));
    expect(carregarDados(storage, AGORA).aviso).not.toBeNull();

    const dados = criarDadosIniciais(AGORA);
    storage.setItem(
      CHAVE_DADOS,
      JSON.stringify({ versao: 1, vagas: [{ ...dados.vagas[0], estado: 'QUEBRADA' }], historico: [] }),
    );
    const carga = carregarDados(storage, AGORA);
    expect(carga.aviso).not.toBeNull();
    expect(carga.dados.vagas[0].estado).toBe('LIVRE');
  });

  it('restaura a demonstração descartando alterações', () => {
    const storage = criarStorageMemoria();
    const { dados } = carregarDados(storage, AGORA);
    const alterado = alterarEstadoVaga(dados, 'vaga-a01', 'OCUPADA', {
      agora: AGORA,
      origem: 'PAINEL_ADMINISTRATIVO',
      responsavel: null,
      setores: ESTRUTURA.setores,
    });
    salvarDados(storage, alterado.dados);
    const restaurado = restaurarDemonstracao(storage, AGORA);
    expect(restaurado.vagas[0].estado).toBe('LIVRE');
    expect(restaurado.historico).toHaveLength(10);
    expect(carregarDados(storage, AGORA).dados).toEqual(restaurado);
  });

  it('reset (storage limpo) volta ao seed sem aviso', () => {
    const storage = criarStorageMemoria();
    carregarDados(storage, AGORA);
    storage.clear();
    const carga = carregarDados(storage, AGORA);
    expect(carga.aviso).toBeNull();
    expect(carga.dados.vagas).toHaveLength(60);
  });
});

describe('sessão simulada (RF01, RF02)', () => {
  it('autentica apenas com as credenciais de demonstração', () => {
    expect(autenticar(CREDENCIAIS_DEMO.email, CREDENCIAIS_DEMO.senha, AGORA)).toEqual({
      email: 'admin@parkflow.com',
      nome: 'Administrador Demo',
      iniciadaEm: AGORA.toISOString(),
    });
    expect(autenticar(' Admin@ParkFlow.com ', '123456')).not.toBeNull();
    expect(autenticar('admin@parkflow.com', 'errada')).toBeNull();
    expect(autenticar('outro@parkflow.com', '123456')).toBeNull();
  });

  it('salva, carrega e encerra a sessão', () => {
    const storage = criarStorageMemoria();
    expect(carregarSessao(storage)).toBeNull();
    const sessao = autenticar(CREDENCIAIS_DEMO.email, CREDENCIAIS_DEMO.senha, AGORA);
    if (!sessao) throw new Error('falha de autenticação no teste');
    salvarSessao(storage, sessao);
    expect(carregarSessao(storage)).toEqual(sessao);
    encerrarSessao(storage);
    expect(carregarSessao(storage)).toBeNull();
    expect(storage.getItem(CHAVE_SESSAO)).toBeNull();
  });

  it('ignora sessão corrompida', () => {
    const storage = criarStorageMemoria();
    storage.setItem(CHAVE_SESSAO, 'corrompido');
    expect(carregarSessao(storage)).toBeNull();
    storage.setItem(CHAVE_SESSAO, JSON.stringify({ email: 1 }));
    expect(carregarSessao(storage)).toBeNull();
  });
});
