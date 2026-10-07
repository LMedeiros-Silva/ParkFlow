import { Camera, Download, FileText, TriangleAlert } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { CabecalhoPagina } from '../components/Cabecalho';
import { EstadoBadge } from '../components/Estado';
import { Kpi } from '../components/Kpi';
import { useParking } from '../contexts/useParking';
import { useToast } from '../contexts/useToast';
import { nomeArquivoRelatorio, relatorioParaCsv } from '../domain/csv';
import { formatarDataHora, paraDataInput } from '../domain/datas';
import { periodoValido } from '../domain/filtros';
import { formatarTaxa, type Indicadores } from '../domain/indicadores';
import { gerarRelatorio, type FiltroRelatorio, type LinhaRelatorio, type Relatorio } from '../domain/relatorio';
import { ESTADOS_VAGA, ROTULO_ESTADO, ROTULO_ORIGEM, type TipoVagaId } from '../domain/tipos';

function filtroInicial(estacionamentoId: string): FiltroRelatorio {
  const hoje = new Date();
  const seteDiasAtras = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 6);
  return { inicio: paraDataInput(seteDiasAtras), fim: paraDataInput(hoje), estacionamentoId, setorId: '', tipoId: '' };
}

function TabelaIndicadores({ titulo, rotuloLinha, linhas }: { titulo: string; rotuloLinha: string; linhas: LinhaRelatorio[] }) {
  return (
    <div className="tabela-rolagem">
      <table className="tabela">
        <caption>{titulo}</caption>
        <thead>
          <tr>
            <th scope="col">{rotuloLinha}</th>
            <th scope="col">Total</th>
            <th scope="col">Livres</th>
            <th scope="col">Ocupadas</th>
            <th scope="col">Reservadas</th>
            <th scope="col">Indisponíveis</th>
            <th scope="col">Operacionais</th>
            <th scope="col">Taxa</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map(({ id, nome, indicadores }) => (
            <tr key={id}>
              <th scope="row">{nome}</th>
              <CelulasIndicadores indicadores={indicadores} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CelulasIndicadores({ indicadores }: { indicadores: Indicadores }) {
  return (
    <>
      <td>{indicadores.total}</td>
      <td>{indicadores.disponiveis}</td>
      <td>{indicadores.ocupadas}</td>
      <td>{indicadores.reservadas}</td>
      <td>{indicadores.indisponiveis}</td>
      <td>{indicadores.operacionais}</td>
      <td>{formatarTaxa(indicadores.taxaOcupacao)}</td>
    </>
  );
}

/** Geração (RF15) e exportação CSV (RF16) do relatório operacional. */
export function RelatoriosPage() {
  const { estrutura, vagas, historico } = useParking();
  const { notificar } = useToast();
  const [filtro, setFiltro] = useState<FiltroRelatorio>(() => filtroInicial(estrutura.estacionamentos[0]?.id ?? ''));
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const setores = estrutura.setores.filter(
    (setor) => !filtro.estacionamentoId || setor.estacionamentoId === filtro.estacionamentoId,
  );
  const nomeSetor = new Map(estrutura.setores.map((setor) => [setor.id, setor.nome]));
  const filtrosMudaram = relatorio !== null && JSON.stringify(relatorio.filtros) !== JSON.stringify(filtro);

  function atualizar(parcial: Partial<FiltroRelatorio>) {
    setFiltro((atual) => ({ ...atual, ...parcial }));
  }

  function gerar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!periodoValido(filtro)) {
      setErro('A data inicial deve ser anterior ou igual à data final.');
      return;
    }
    setErro(null);
    setRelatorio(gerarRelatorio(estrutura, { vagas, historico }, filtro, new Date()));
  }

  function exportar() {
    if (!relatorio) return;
    const conteudo = relatorioParaCsv(relatorio, estrutura);
    const url = URL.createObjectURL(new Blob([conteudo], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivoRelatorio(relatorio.geradoEm);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notificar('Arquivo CSV gerado.', 'sucesso');
  }

  return (
    <>
      <CabecalhoPagina
        titulo="Relatórios operacionais"
        descricao="Escolha os filtros e gere um relatório de ocupação. O resultado pode ser exportado em CSV."
      />

      <form className="painel" onSubmit={gerar} aria-labelledby="titulo-filtros-relatorio" noValidate>
        <h2 id="titulo-filtros-relatorio" className="painel__titulo">
          Filtros
        </h2>
        <div className="filtros">
          <div className="campo">
            <label htmlFor="rel-inicio">Movimentações de</label>
            <input id="rel-inicio" type="date" value={filtro.inicio} onChange={(evento) => atualizar({ inicio: evento.target.value })} />
          </div>
          <div className="campo">
            <label htmlFor="rel-fim">Até</label>
            <input id="rel-fim" type="date" value={filtro.fim} onChange={(evento) => atualizar({ fim: evento.target.value })} />
          </div>
          <div className="campo">
            <label htmlFor="rel-estacionamento">Estacionamento</label>
            <select
              id="rel-estacionamento"
              value={filtro.estacionamentoId}
              onChange={(evento) => atualizar({ estacionamentoId: evento.target.value, setorId: '' })}
            >
              <option value="">Todos</option>
              {estrutura.estacionamentos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="rel-setor">Setor</label>
            <select id="rel-setor" value={filtro.setorId} onChange={(evento) => atualizar({ setorId: evento.target.value })}>
              <option value="">Todos</option>
              {setores.map((setor) => (
                <option key={setor.id} value={setor.id}>
                  {setor.nome} — {setor.descricao}
                </option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="rel-tipo">Tipo de vaga</label>
            <select
              id="rel-tipo"
              value={filtro.tipoId}
              onChange={(evento) => atualizar({ tipoId: evento.target.value as TipoVagaId | '' })}
            >
              <option value="">Todos</option>
              {estrutura.tiposVaga.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        {erro && (
          <p className="alerta alerta--erro" role="alert">
            <TriangleAlert aria-hidden="true" size={18} />
            {erro}
          </p>
        )}
        <div className="acoes-linha">
          <button type="submit" className="botao botao--primario">
            <FileText aria-hidden="true" size={18} />
            Gerar relatório
          </button>
        </div>
      </form>

      <p className="nota">
        <Camera aria-hidden="true" size={16} />
        Totais e taxa de ocupação são uma fotografia do estado das vagas no momento da geração. O período filtra apenas
        as movimentações do histórico.
      </p>

      {relatorio && (
        <section className="painel relatorio" aria-labelledby="titulo-relatorio">
          <div className="painel__cabecalho">
            <h2 id="titulo-relatorio" className="painel__titulo">
              Relatório gerado em {formatarDataHora(relatorio.geradoEm)}
            </h2>
            <button type="button" className="botao botao--secundario" onClick={exportar}>
              <Download aria-hidden="true" size={18} />
              Exportar CSV
            </button>
          </div>
          {filtrosMudaram && (
            <p className="alerta alerta--info" role="status">
              Os filtros foram alterados depois da geração. Clique em “Gerar relatório” para atualizar.
            </p>
          )}
          <dl className="detalhes detalhes--linha">
            <div>
              <dt>Estacionamento</dt>
              <dd>{relatorio.descricao.estacionamento}</dd>
            </div>
            <div>
              <dt>Setor</dt>
              <dd>{relatorio.descricao.setor}</dd>
            </div>
            <div>
              <dt>Tipo</dt>
              <dd>{relatorio.descricao.tipo}</dd>
            </div>
            <div>
              <dt>Período das movimentações</dt>
              <dd>{relatorio.descricao.periodo}</dd>
            </div>
          </dl>

          <h3 className="secao__titulo">Situação no momento da geração</h3>
          <dl className="kpis">
            <Kpi rotulo="Total" valor={relatorio.totais.total} />
            <Kpi rotulo="Disponíveis" valor={relatorio.totais.disponiveis} variante="livre" />
            <Kpi rotulo="Ocupadas" valor={relatorio.totais.ocupadas} variante="ocupada" />
            <Kpi rotulo="Reservadas" valor={relatorio.totais.reservadas} variante="reservada" />
            <Kpi rotulo="Indisponíveis" valor={relatorio.totais.indisponiveis} variante="indisponivel" />
            <Kpi
              rotulo="Taxa de ocupação"
              valor={formatarTaxa(relatorio.totais.taxaOcupacao)}
              variante="destaque"
              detalhe={`${relatorio.totais.operacionais} vagas operacionais`}
            />
          </dl>

          <TabelaIndicadores titulo="Por setor" rotuloLinha="Setor" linhas={relatorio.porSetor} />
          <TabelaIndicadores titulo="Por tipo de vaga" rotuloLinha="Tipo" linhas={relatorio.porTipo} />
          <TabelaIndicadores
            titulo="Vagas especiais (PCD e Idoso)"
            rotuloLinha="Recorte"
            linhas={[{ id: 'especiais', nome: 'Especiais', indicadores: relatorio.especiais }]}
          />

          <h3 className="secao__titulo">Movimentações no período ({relatorio.movimentacoes.length})</h3>
          <ul className="contagens">
            {ESTADOS_VAGA.map((estado) => (
              <li key={estado}>
                <EstadoBadge estado={estado} /> {relatorio.movimentacoesPorEstado[estado]}
              </li>
            ))}
          </ul>
          {relatorio.movimentacoes.length === 0 ? (
            <p className="texto-apoio">Nenhuma movimentação no período e recorte selecionados.</p>
          ) : (
            <div className="tabela-rolagem">
              <table className="tabela">
                <caption className="visualmente-oculto">Movimentações no período</caption>
                <thead>
                  <tr>
                    <th scope="col">Data e hora</th>
                    <th scope="col">Vaga</th>
                    <th scope="col">Setor</th>
                    <th scope="col">Alteração</th>
                    <th scope="col">Origem / responsável</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorio.movimentacoes.map((registro) => (
                    <tr key={registro.id}>
                      <td>{formatarDataHora(registro.dataHora)}</td>
                      <th scope="row">{registro.codigoVaga}</th>
                      <td>{nomeSetor.get(registro.setorId)}</td>
                      <td>
                        {ROTULO_ESTADO[registro.estadoAnterior]} → {ROTULO_ESTADO[registro.estadoNovo]}
                      </td>
                      <td>{registro.responsavel ?? ROTULO_ORIGEM[registro.origem]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </>
  );
}
