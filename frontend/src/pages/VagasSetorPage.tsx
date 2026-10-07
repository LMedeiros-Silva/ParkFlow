import { LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CabecalhoPagina } from '../components/Cabecalho';
import { EstadoBadge, IconeEstado } from '../components/Estado';
import { EstadoVazio } from '../components/EstadoVazio';
import { ModalVaga } from '../components/ModalVaga';
import { useParking } from '../contexts/useParking';
import { formatarDataHora } from '../domain/datas';
import { filtrarVagas } from '../domain/filtros';
import { calcularIndicadores, formatarTaxa } from '../domain/indicadores';
import { ESTADOS_VAGA, ROTULO_ESTADO, type EstadoVaga, type TipoVagaId } from '../domain/tipos';

type Visualizacao = 'mapa' | 'lista';

export function VagasSetorPage() {
  const { estacionamentoId, setorId } = useParams();
  const { estrutura, vagas } = useParking();
  const [visualizacao, setVisualizacao] = useState<Visualizacao>('mapa');
  const [tipoId, setTipoId] = useState<TipoVagaId | ''>('');
  const [estado, setEstado] = useState<EstadoVaga | ''>('');
  const [vagaAbertaId, setVagaAbertaId] = useState<string | null>(null);

  const estacionamento = estrutura.estacionamentos.find((item) => item.id === estacionamentoId);
  const setor = estrutura.setores.find((item) => item.id === setorId && item.estacionamentoId === estacionamentoId);
  if (!estacionamento || !setor) {
    return (
      <EstadoVazio titulo="Setor não encontrado.">
        <Link to="/estacionamentos">Voltar para estacionamentos</Link>
      </EstadoVazio>
    );
  }

  const vagasDoSetor = filtrarVagas(vagas, { setorId: setor.id });
  const visiveis = filtrarVagas(vagasDoSetor, { tipoId, estado });
  const indicadores = calcularIndicadores(vagasDoSetor);
  const nomeTipo = new Map(estrutura.tiposVaga.map((tipo) => [tipo.id, tipo.nome]));
  const vagaAberta = vagas.find((vaga) => vaga.id === vagaAbertaId) ?? null;
  const filtrando = tipoId !== '' || estado !== '';

  return (
    <>
      <CabecalhoPagina
        titulo={`${setor.nome} · ${setor.descricao}`}
        descricao={`${indicadores.total} vagas · ocupação ${formatarTaxa(indicadores.taxaOcupacao)}. Selecione uma vaga para ver detalhes e alterar o estado.`}
        migalhas={[
          { rotulo: 'Estacionamentos', para: '/estacionamentos' },
          { rotulo: estacionamento.nome, para: `/estacionamentos/${estacionamento.id}` },
          { rotulo: setor.nome },
        ]}
      />

      <ul className="contagens contagens--painel" aria-label="Resumo do setor">
        <li className="estado--livre">
          <IconeEstado estado="LIVRE" /> {indicadores.disponiveis} livres
        </li>
        <li className="estado--ocupada">
          <IconeEstado estado="OCUPADA" /> {indicadores.ocupadas} ocupadas
        </li>
        <li className="estado--reservada">
          <IconeEstado estado="RESERVADA" /> {indicadores.reservadas} reservadas
        </li>
        <li className="estado--indisponivel">
          <IconeEstado estado="INDISPONIVEL" /> {indicadores.indisponiveis} indisponíveis
        </li>
      </ul>

      <div className="barra-ferramentas">
        <div className="filtros filtros--linha">
          <div className="campo">
            <label htmlFor="filtro-tipo">Tipo</label>
            <select id="filtro-tipo" value={tipoId} onChange={(evento) => setTipoId(evento.target.value as TipoVagaId | '')}>
              <option value="">Todos</option>
              {estrutura.tiposVaga.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="filtro-estado">Estado</label>
            <select id="filtro-estado" value={estado} onChange={(evento) => setEstado(evento.target.value as EstadoVaga | '')}>
              <option value="">Todos</option>
              {ESTADOS_VAGA.map((item) => (
                <option key={item} value={item}>
                  {ROTULO_ESTADO[item]}
                </option>
              ))}
            </select>
          </div>
          {filtrando && (
            <button
              type="button"
              className="botao botao--texto"
              onClick={() => {
                setTipoId('');
                setEstado('');
              }}
            >
              Limpar filtros
            </button>
          )}
        </div>
        <div className="alternador" role="group" aria-label="Forma de visualização">
          <button type="button" aria-pressed={visualizacao === 'mapa'} onClick={() => setVisualizacao('mapa')}>
            <LayoutGrid aria-hidden="true" size={16} />
            Mapa
          </button>
          <button type="button" aria-pressed={visualizacao === 'lista'} onClick={() => setVisualizacao('lista')}>
            <List aria-hidden="true" size={16} />
            Lista
          </button>
        </div>
      </div>

      <p className="texto-apoio" aria-live="polite">
        Mostrando {visiveis.length} de {vagasDoSetor.length} vagas.
      </p>

      {visiveis.length === 0 ? (
        <EstadoVazio titulo="Nenhuma vaga corresponde aos filtros.">Ajuste ou limpe os filtros para ver as vagas.</EstadoVazio>
      ) : visualizacao === 'mapa' ? (
        <ul className="mapa-vagas" aria-label={`Mapa de vagas do ${setor.nome}`}>
          {visiveis.map((vaga) => (
            <li key={vaga.id}>
              <button
                type="button"
                className={`vaga vaga--${vaga.estado.toLowerCase()}`}
                onClick={() => setVagaAbertaId(vaga.id)}
                aria-label={`Vaga ${vaga.codigo}, ${nomeTipo.get(vaga.tipoId)}, ${ROTULO_ESTADO[vaga.estado]}${vaga.ativa ? '' : ', desativada'}. Abrir detalhes`}
              >
                <span className="vaga__codigo">{vaga.codigo}</span>
                <span className="vaga__estado">
                  <IconeEstado estado={vaga.estado} />
                  {ROTULO_ESTADO[vaga.estado]}
                </span>
                {vaga.tipoId !== 'COMUM' && <span className="vaga__tipo">{nomeTipo.get(vaga.tipoId)}</span>}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="tabela-rolagem">
          <table className="tabela">
            <caption className="visualmente-oculto">Vagas do {setor.nome}</caption>
            <thead>
              <tr>
                <th scope="col">Vaga</th>
                <th scope="col">Tipo</th>
                <th scope="col">Estado</th>
                <th scope="col">Última atualização</th>
                <th scope="col">
                  <span className="visualmente-oculto">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((vaga) => (
                <tr key={vaga.id}>
                  <th scope="row">{vaga.codigo}</th>
                  <td>{nomeTipo.get(vaga.tipoId)}</td>
                  <td>
                    <EstadoBadge estado={vaga.estado} />
                  </td>
                  <td>{formatarDataHora(vaga.atualizadaEm)}</td>
                  <td>
                    <button
                      type="button"
                      className="botao botao--secundario botao--pequeno"
                      onClick={() => setVagaAbertaId(vaga.id)}
                      aria-label={`Ver detalhes da vaga ${vaga.codigo}`}
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalVaga vaga={vagaAberta} aoFechar={() => setVagaAbertaId(null)} />
    </>
  );
}
