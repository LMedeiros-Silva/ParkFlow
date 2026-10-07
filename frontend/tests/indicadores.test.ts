import { describe, expect, it } from 'vitest';
import {
  calcularIndicadores,
  calcularTaxaOcupacao,
  ehDisponivel,
  formatarTaxa,
  indicadoresPor,
} from '../src/domain/indicadores';
import type { EstadoVaga, Vaga } from '../src/domain/tipos';

let sequencia = 0;

function vaga(estado: EstadoVaga, extra: Partial<Vaga> = {}): Vaga {
  sequencia++;
  return {
    id: `v-${sequencia}`,
    codigo: 'X01',
    setorId: 'set-a',
    tipoId: 'COMUM',
    estado,
    ativa: true,
    atualizadaEm: '2026-10-07T12:00:00.000Z',
    ...extra,
  };
}

describe('indicadores (RN06, RN07)', () => {
  it('considera disponível apenas vaga ativa e LIVRE', () => {
    expect(ehDisponivel(vaga('LIVRE'))).toBe(true);
    expect(ehDisponivel(vaga('LIVRE', { ativa: false }))).toBe(false);
    expect(ehDisponivel(vaga('OCUPADA'))).toBe(false);
    expect(ehDisponivel(vaga('RESERVADA'))).toBe(false);
    expect(ehDisponivel(vaga('INDISPONIVEL'))).toBe(false);
  });

  it('conta estados e calcula a taxa com ocupadas + reservadas sobre operacionais', () => {
    const resultado = calcularIndicadores([
      vaga('LIVRE'),
      vaga('LIVRE'),
      vaga('OCUPADA'),
      vaga('OCUPADA'),
      vaga('OCUPADA'),
      vaga('RESERVADA'),
      vaga('INDISPONIVEL'),
      vaga('INDISPONIVEL'),
    ]);
    expect(resultado).toMatchObject({
      total: 8,
      disponiveis: 2,
      ocupadas: 3,
      reservadas: 1,
      indisponiveis: 2,
      inativas: 0,
      operacionais: 6,
    });
    expect(resultado.taxaOcupacao).toBeCloseTo((4 / 6) * 100);
  });

  it('exclui vagas inativas dos operacionais e das disponíveis, mas as mantém no total', () => {
    const resultado = calcularIndicadores([
      vaga('LIVRE', { ativa: false }),
      vaga('OCUPADA', { ativa: false }),
      vaga('OCUPADA'),
      vaga('LIVRE'),
    ]);
    expect(resultado.total).toBe(4);
    expect(resultado.inativas).toBe(2);
    expect(resultado.disponiveis).toBe(1);
    expect(resultado.ocupadas).toBe(1);
    expect(resultado.operacionais).toBe(2);
    expect(resultado.taxaOcupacao).toBe(50);
  });

  it('retorna taxa não aplicável (null) quando não há vaga operacional, nunca zero', () => {
    expect(calcularIndicadores([]).taxaOcupacao).toBeNull();
    expect(calcularIndicadores([vaga('INDISPONIVEL'), vaga('LIVRE', { ativa: false })]).taxaOcupacao).toBeNull();
    expect(calcularTaxaOcupacao(0, 0, 0)).toBeNull();
    expect(formatarTaxa(null)).toBe('não aplicável');
  });

  it('retorna 0% quando há operacionais e nenhuma ocupada ou reservada', () => {
    expect(calcularIndicadores([vaga('LIVRE')]).taxaOcupacao).toBe(0);
  });

  it('formata a taxa com uma casa decimal no padrão brasileiro', () => {
    expect(formatarTaxa(54.716)).toBe('54,7%');
    expect(formatarTaxa(100)).toBe('100,0%');
  });

  it('agrupa por chave mantendo grupos vazios', () => {
    const mapa = indicadoresPor(
      [vaga('OCUPADA', { setorId: 'set-a' }), vaga('LIVRE', { setorId: 'set-b' })],
      ['set-a', 'set-b', 'set-c'],
      (item) => item.setorId as 'set-a' | 'set-b' | 'set-c',
    );
    expect(mapa.get('set-a')?.taxaOcupacao).toBe(100);
    expect(mapa.get('set-b')?.taxaOcupacao).toBe(0);
    expect(mapa.get('set-c')?.total).toBe(0);
    expect(mapa.get('set-c')?.taxaOcupacao).toBeNull();
  });
});
