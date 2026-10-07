import { Clock3, Info } from 'lucide-react';
import { useState } from 'react';
import { CabecalhoPagina } from '../components/Cabecalho';
import { IconeEstado } from '../components/Estado';
import { EstadoVazio } from '../components/EstadoVazio';
import { useParking } from '../contexts/useParking';
import { formatarDataHora } from '../domain/datas';
import { filtrarVagas } from '../domain/filtros';
import { calcularIndicadores } from '../domain/indicadores';
import type { TipoVagaId } from '../domain/tipos';
import { ultimaAtualizacao } from '../domain/vagas';

/** Consulta pública de disponibilidade (RF09) com filtros por setor e tipo (RF10). Somente leitura. */
export function ConsultaPage() {
  const { estrutura, vagas } = useParking();
  const estacionamentosAtivos = estrutura.estacionamentos.filter((item) => item.ativo);
  const [estacionamentoId, setEstacionamentoId] = useState(estacionamentosAtivos[0]?.id ?? '');
  const [setorId, setSetorId] = useState('');
  const [tipoId, setTipoId] = useState<TipoVagaId | ''>('');

  const setoresDoEstacionamento = estrutura.setores.filter(
    (setor) => setor.ativo && setor.estacionamentoId === estacionamentoId,
  );
  const setoresVisiveis = setoresDoEstacionamento.filter((setor) => !setorId || setor.id === setorId);
  const tiposVisiveis = estrutura.tiposVaga.filter((tipo) => !tipoId || tipo.id === tipoId);

  const idsSetores = new Set(setoresVisiveis.map((setor) => setor.id));
  const vagasDoRecorte = filtrarVagas(vagas, { tipoId }).filter((vaga) => idsSetores.has(vaga.setorId));

  const total = calcularIndicadores(vagasDoRecorte);
  const atualizadoEm = ultimaAtualizacao(vagasDoRecorte);
  const estacionamento = estacionamentosAtivos.find((item) => item.id === estacionamentoId);

  return (
    <>
      <CabecalhoPagina
        titulo="Consulta de vagas"
        descricao="Veja quantas vagas estão livres agora em cada setor. Não é necessário login."
      />

      <section className="painel" aria-labelledby="titulo-filtros-consulta">
        <h2 id="titulo-filtros-consulta" className="visualmente-oculto">
          Filtros da consulta
        </h2>
        <div className="filtros">
          <div className="campo">
            <label htmlFor="consulta-estacionamento">Estacionamento</label>
            <select
              id="consulta-estacionamento"
              value={estacionamentoId}
              onChange={(evento) => {
                setEstacionamentoId(evento.target.value);
                setSetorId('');
              }}
            >
              {estacionamentosAtivos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome} — {item.endereco}
                </option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="consulta-setor">Setor</label>
            <select id="consulta-setor" value={setorId} onChange={(evento) => setSetorId(evento.target.value)}>
              <option value="">Todos os setores</option>
              {setoresDoEstacionamento.map((setor) => (
                <option key={setor.id} value={setor.id}>
                  {setor.nome} — {setor.descricao}
                </option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="consulta-tipo">Tipo de vaga</label>
            <select
              id="consulta-tipo"
              value={tipoId}
              onChange={(evento) => setTipoId(evento.target.value as TipoVagaId | '')}
            >
              <option value="">Todos os tipos</option>
              {estrutura.tiposVaga.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="consulta-resumo" aria-live="polite">
        <div className="consulta-resumo__numero estado--livre">
          <IconeEstado estado="LIVRE" size={32} />
          <span>
            <strong>{total.disponiveis}</strong> {total.disponiveis === 1 ? 'vaga livre' : 'vagas livres'}
          </span>
        </div>
        <p>
          {estacionamento?.nome ?? 'Estacionamento'}
          {setorId ? ` · ${setoresVisiveis[0]?.nome}` : ' · todos os setores'}
          {tipoId ? ` · tipo ${tiposVisiveis[0]?.nome}` : ''}
        </p>
        <p className="texto-apoio">
          <Clock3 aria-hidden="true" size={16} />
          Última atualização: {atualizadoEm ? formatarDataHora(atualizadoEm) : 'sem registro'}
        </p>
      </section>

      {setoresVisiveis.length === 0 ? (
        <EstadoVazio titulo="Nenhum setor disponível para consulta." />
      ) : (
        <ul className="grade-cartoes" aria-label="Disponibilidade por setor">
          {setoresVisiveis.map((setor) => {
            const vagasSetor = vagasDoRecorte.filter((vaga) => vaga.setorId === setor.id);
            const indicadores = calcularIndicadores(vagasSetor);
            return (
              <li key={setor.id} className="cartao">
                <h2 className="cartao__titulo">
                  {setor.nome} <span className="texto-apoio">· {setor.descricao}</span>
                </h2>
                <p className="cartao__destaque estado--livre">
                  <IconeEstado estado="LIVRE" size={20} />
                  <strong>{indicadores.disponiveis}</strong>
                  {indicadores.disponiveis === 1 ? 'vaga livre' : 'vagas livres'}
                </p>
                <ul className="lista-tipos" aria-label={`Vagas livres por tipo no ${setor.nome}`}>
                  {tiposVisiveis.map((tipo) => {
                    const doTipo = vagasSetor.filter((vaga) => vaga.tipoId === tipo.id);
                    if (doTipo.length === 0) return null;
                    const livres = calcularIndicadores(doTipo).disponiveis;
                    return (
                      <li key={tipo.id}>
                        <span>
                          {tipo.nome}
                          {tipo.especial && <span className="etiqueta">especial</span>}
                        </span>
                        <span>
                          <strong>{livres}</strong> de {doTipo.length}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {vagasSetor.length === 0 && <p className="texto-apoio">Este setor não possui vagas desse tipo.</p>}
              </li>
            );
          })}
        </ul>
      )}

      <p className="nota">
        <Info aria-hidden="true" size={16} />
        Uma vaga é considerada disponível somente quando está ativa e livre. Vagas reservadas ou indisponíveis não
        entram na contagem. Os dados são de demonstração e atualizados manualmente pelo painel administrativo.
      </p>
    </>
  );
}
