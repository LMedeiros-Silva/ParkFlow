import { formatarDataHora } from './datas';
import { formatarTaxa, type Indicadores } from './indicadores';
import type { Relatorio } from './relatorio';
import { ROTULO_ESTADO, ROTULO_ORIGEM, type Estrutura } from './tipos';

/** BOM UTF-8 para o Excel reconhecer a acentuação. */
export const BOM = '﻿';
export const SEPARADOR = ';';

export function escaparCampo(valor: string | number): string {
  const texto = String(valor);
  if (/[;"\r\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}

function linha(...campos: (string | number)[]): string {
  return campos.map(escaparCampo).join(SEPARADOR);
}

const CABECALHO_INDICADORES = [
  'Total',
  'Disponíveis',
  'Ocupadas',
  'Reservadas',
  'Indisponíveis',
  'Inativas',
  'Operacionais',
  'Taxa de ocupação',
];

function camposIndicadores(indicadores: Indicadores): (string | number)[] {
  return [
    indicadores.total,
    indicadores.disponiveis,
    indicadores.ocupadas,
    indicadores.reservadas,
    indicadores.indisponiveis,
    indicadores.inativas,
    indicadores.operacionais,
    formatarTaxa(indicadores.taxaOcupacao),
  ];
}

/** Exporta o relatório já gerado (RF16), sem recalcular nada, preservando filtros, período e momento. */
export function relatorioParaCsv(relatorio: Relatorio, estrutura: Estrutura): string {
  const nomeSetor = new Map(estrutura.setores.map((setor) => [setor.id, setor.nome]));
  const nomeTipo = new Map(estrutura.tiposVaga.map((tipo) => [tipo.id, tipo.nome]));

  const linhas = [
    linha('Relatório operacional ParkFlow'),
    linha('Gerado em', formatarDataHora(relatorio.geradoEm)),
    linha('Estacionamento', relatorio.descricao.estacionamento),
    linha('Setor', relatorio.descricao.setor),
    linha('Tipo de vaga', relatorio.descricao.tipo),
    linha('Período das movimentações', relatorio.descricao.periodo),
    linha(
      'Observação',
      'Totais e taxa refletem o estado das vagas no momento da geração; o período filtra apenas as movimentações do histórico.',
    ),
    linha('Fórmula da taxa', '(ocupadas + reservadas) / operacionais x 100; operacionais = ativas e não indisponíveis'),
    '',
    linha('Resumo', ...CABECALHO_INDICADORES),
    linha('Recorte selecionado', ...camposIndicadores(relatorio.totais)),
    linha('Vagas especiais (PCD e Idoso)', ...camposIndicadores(relatorio.especiais)),
    '',
    linha('Setor', ...CABECALHO_INDICADORES),
    ...relatorio.porSetor.map((item) => linha(item.nome, ...camposIndicadores(item.indicadores))),
    '',
    linha('Tipo de vaga', ...CABECALHO_INDICADORES),
    ...relatorio.porTipo.map((item) => linha(item.nome, ...camposIndicadores(item.indicadores))),
    '',
    linha('Movimentações no período', relatorio.movimentacoes.length),
    linha('Data e hora', 'Vaga', 'Setor', 'Tipo', 'Estado anterior', 'Novo estado', 'Origem', 'Responsável'),
    ...relatorio.movimentacoes.map((registro) =>
      linha(
        formatarDataHora(registro.dataHora),
        registro.codigoVaga,
        nomeSetor.get(registro.setorId) ?? registro.setorId,
        nomeTipo.get(registro.tipoId) ?? registro.tipoId,
        ROTULO_ESTADO[registro.estadoAnterior],
        ROTULO_ESTADO[registro.estadoNovo],
        ROTULO_ORIGEM[registro.origem],
        registro.responsavel ?? '—',
      ),
    ),
  ];

  return BOM + linhas.join('\r\n') + '\r\n';
}

export function nomeArquivoRelatorio(geradoEm: string): string {
  const data = new Date(geradoEm);
  const doisDigitos = (valor: number) => String(valor).padStart(2, '0');
  return `parkflow-relatorio-${data.getFullYear()}${doisDigitos(data.getMonth() + 1)}${doisDigitos(data.getDate())}-${doisDigitos(data.getHours())}${doisDigitos(data.getMinutes())}.csv`;
}
