import { Lock, Search, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { CabecalhoPagina } from '../components/Cabecalho';
import { EstadoBadge } from '../components/Estado';
import { EstadoVazio } from '../components/EstadoVazio';
import { useParking } from '../contexts/useParking';
import { formatarDataHora } from '../domain/datas';
import { filtrarHistorico, periodoValido, type FiltroHistorico } from '../domain/filtros';
import { ESTADOS_VAGA, ROTULO_ESTADO, ROTULO_ORIGEM, type EstadoVaga, type TipoVagaId } from '../domain/tipos';

const FILTRO_INICIAL: FiltroHistorico = { busca: '', setorId: '', tipoId: '', estado: '', inicio: '', fim: '' };

/** Consulta do histórico de alterações de estado (RF13). Somente leitura (RN08). */
export function HistoricoPage() {
  const { estrutura, historico } = useParking();
  const [filtro, setFiltro] = useState<FiltroHistorico>(FILTRO_INICIAL);
  const valido = periodoValido(filtro);
  const registros = valido ? filtrarHistorico(historico, filtro) : [];
  const nomeSetor = new Map(estrutura.setores.map((setor) => [setor.id, setor.nome]));
  const nomeTipo = new Map(estrutura.tiposVaga.map((tipo) => [tipo.id, tipo.nome]));
  const filtrando = JSON.stringify(filtro) !== JSON.stringify(FILTRO_INICIAL);

  function atualizar(parcial: Partial<FiltroHistorico>) {
    setFiltro((atual) => ({ ...atual, ...parcial }));
  }

  return (
    <>
      <CabecalhoPagina
        titulo="Histórico de alterações"
        descricao="Todas as mudanças de estado das vagas, da mais recente para a mais antiga."
      />
      <p className="nota">
        <Lock aria-hidden="true" size={16} />
        Registros históricos são somente leitura: não podem ser editados nem excluídos pela interface.
      </p>

      <section className="painel" aria-labelledby="titulo-filtros-historico">
        <h2 id="titulo-filtros-historico" className="visualmente-oculto">
          Filtros do histórico
        </h2>
        <div className="filtros">
          <div className="campo campo--busca">
            <label htmlFor="hist-busca">Buscar vaga ou responsável</label>
            <div className="campo__com-icone">
              <Search aria-hidden="true" size={16} />
              <input
                id="hist-busca"
                type="search"
                placeholder="Ex.: A01"
                value={filtro.busca}
                onChange={(evento) => atualizar({ busca: evento.target.value })}
              />
            </div>
          </div>
          <div className="campo">
            <label htmlFor="hist-setor">Setor</label>
            <select id="hist-setor" value={filtro.setorId} onChange={(evento) => atualizar({ setorId: evento.target.value })}>
              <option value="">Todos</option>
              {estrutura.setores.map((setor) => (
                <option key={setor.id} value={setor.id}>
                  {setor.nome} — {setor.descricao}
                </option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="hist-tipo">Tipo</label>
            <select
              id="hist-tipo"
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
          <div className="campo">
            <label htmlFor="hist-estado">Novo estado</label>
            <select
              id="hist-estado"
              value={filtro.estado}
              onChange={(evento) => atualizar({ estado: evento.target.value as EstadoVaga | '' })}
            >
              <option value="">Todos</option>
              {ESTADOS_VAGA.map((estado) => (
                <option key={estado} value={estado}>
                  {ROTULO_ESTADO[estado]}
                </option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="hist-inicio">De</label>
            <input id="hist-inicio" type="date" value={filtro.inicio} onChange={(evento) => atualizar({ inicio: evento.target.value })} />
          </div>
          <div className="campo">
            <label htmlFor="hist-fim">Até</label>
            <input id="hist-fim" type="date" value={filtro.fim} onChange={(evento) => atualizar({ fim: evento.target.value })} />
          </div>
        </div>
        {filtrando && (
          <button type="button" className="botao botao--texto" onClick={() => setFiltro(FILTRO_INICIAL)}>
            Limpar filtros
          </button>
        )}
      </section>

      {!valido && (
        <p className="alerta alerta--erro" role="alert">
          <TriangleAlert aria-hidden="true" size={18} />A data inicial deve ser anterior ou igual à data final.
        </p>
      )}

      <p className="texto-apoio" aria-live="polite">
        {registros.length} {registros.length === 1 ? 'registro encontrado' : 'registros encontrados'}.
      </p>

      {valido && registros.length === 0 ? (
        <EstadoVazio titulo="Nenhum registro encontrado.">Ajuste os filtros para ampliar a busca.</EstadoVazio>
      ) : (
        registros.length > 0 && (
          <div className="tabela-rolagem">
            <table className="tabela">
              <caption className="visualmente-oculto">Histórico de alterações de estado</caption>
              <thead>
                <tr>
                  <th scope="col">Data e hora</th>
                  <th scope="col">Vaga</th>
                  <th scope="col">Setor</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Estado anterior</th>
                  <th scope="col">Novo estado</th>
                  <th scope="col">Origem / responsável</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro) => (
                  <tr key={registro.id}>
                    <td>
                      <time dateTime={registro.dataHora}>{formatarDataHora(registro.dataHora)}</time>
                    </td>
                    <th scope="row">{registro.codigoVaga}</th>
                    <td>{nomeSetor.get(registro.setorId)}</td>
                    <td>{nomeTipo.get(registro.tipoId)}</td>
                    <td>
                      <EstadoBadge estado={registro.estadoAnterior} />
                    </td>
                    <td>
                      <EstadoBadge estado={registro.estadoNovo} />
                    </td>
                    <td>
                      {ROTULO_ORIGEM[registro.origem]}
                      {registro.responsavel && <span className="texto-apoio bloco">{registro.responsavel}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </>
  );
}
