import { Save, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useParking } from '../contexts/useParking';
import { useToast } from '../contexts/useToast';
import { formatarDataHora } from '../domain/datas';
import { ESTADOS_VAGA, ROTULO_ESTADO, ROTULO_ORIGEM, type EstadoVaga, type Vaga } from '../domain/tipos';
import { Dialogo } from './Dialogo';
import { EstadoBadge, IconeEstado } from './Estado';

interface Props {
  vaga: Vaga | null;
  aoFechar: () => void;
}

export function ModalVaga({ vaga, aoFechar }: Props) {
  return (
    <Dialogo aberto={vaga !== null} titulo={vaga ? `Vaga ${vaga.codigo}` : 'Vaga'} aoFechar={aoFechar}>
      {/* A chave reinicia o formulário sempre que outra vaga é aberta. */}
      {vaga && <ConteudoVaga key={vaga.id} vaga={vaga} aoFechar={aoFechar} />}
    </Dialogo>
  );
}

function ConteudoVaga({ vaga, aoFechar }: { vaga: Vaga; aoFechar: () => void }) {
  const { estrutura, historico, alterarEstado } = useParking();
  const { sessao } = useAuth();
  const { notificar } = useToast();
  const [novoEstado, setNovoEstado] = useState<EstadoVaga>(vaga.estado);
  const [erro, setErro] = useState<string | null>(null);

  const setor = estrutura.setores.find((item) => item.id === vaga.setorId);
  const tipo = estrutura.tiposVaga.find((item) => item.id === vaga.tipoId);
  const estacionamento = estrutura.estacionamentos.find((item) => item.id === setor?.estacionamentoId);
  const registros = historico.filter((registro) => registro.vagaId === vaga.id).slice(0, 3);
  const semMudanca = novoEstado === vaga.estado;

  function salvar() {
    const resultado = alterarEstado(vaga.id, novoEstado, sessao?.email ?? null);
    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }
    notificar(`Vaga ${resultado.vaga.codigo} alterada para ${ROTULO_ESTADO[resultado.vaga.estado]}.`, 'sucesso');
    aoFechar();
  }

  return (
    <>
      <dl className="detalhes">
        <div>
          <dt>Estacionamento</dt>
          <dd>{estacionamento?.nome}</dd>
        </div>
        <div>
          <dt>Setor</dt>
          <dd>
            {setor?.nome} · {setor?.descricao}
          </dd>
        </div>
        <div>
          <dt>Tipo</dt>
          <dd>
            {tipo?.nome}
            {tipo?.especial && <span className="etiqueta">especial</span>}
          </dd>
        </div>
        <div>
          <dt>Estado atual</dt>
          <dd>
            <EstadoBadge estado={vaga.estado} />
          </dd>
        </div>
        <div>
          <dt>Situação do cadastro</dt>
          <dd>{vaga.ativa ? 'Ativa' : 'Desativada'}</dd>
        </div>
        <div>
          <dt>Última atualização</dt>
          <dd>{formatarDataHora(vaga.atualizadaEm)}</dd>
        </div>
      </dl>

      {vaga.ativa ? (
        <form
          className="formulario"
          onSubmit={(evento) => {
            evento.preventDefault();
            if (!semMudanca) salvar();
          }}
        >
          <fieldset className="opcoes-estado">
            <legend>Alterar estado</legend>
            {ESTADOS_VAGA.map((estado) => (
              <label key={estado} className={`opcao-estado estado--${estado.toLowerCase()}`}>
                <input
                  type="radio"
                  name="novo-estado"
                  value={estado}
                  checked={novoEstado === estado}
                  onChange={() => {
                    setNovoEstado(estado);
                    setErro(null);
                  }}
                />
                <IconeEstado estado={estado} size={18} />
                <span>
                  {ROTULO_ESTADO[estado]}
                  {estado === vaga.estado && <span className="texto-apoio"> (atual)</span>}
                </span>
              </label>
            ))}
          </fieldset>
          {erro && (
            <p className="alerta alerta--erro" role="alert">
              <TriangleAlert aria-hidden="true" size={18} />
              {erro}
            </p>
          )}
          <p className="texto-apoio" id="ajuda-salvar">
            {semMudanca
              ? 'Escolha um estado diferente do atual para habilitar o salvamento.'
              : `A alteração de ${ROTULO_ESTADO[vaga.estado]} para ${ROTULO_ESTADO[novoEstado]} será registrada no histórico.`}
          </p>
          <div className="acoes-linha acoes-linha--fim">
            <button type="button" className="botao botao--secundario" onClick={aoFechar}>
              Cancelar
            </button>
            <button
              type="submit"
              className="botao botao--primario"
              disabled={semMudanca}
              aria-describedby="ajuda-salvar"
            >
              <Save aria-hidden="true" size={18} />
              Salvar alteração
            </button>
          </div>
        </form>
      ) : (
        <p className="alerta alerta--aviso">
          <TriangleAlert aria-hidden="true" size={18} />
          Vagas desativadas não podem ter o estado alterado.
        </p>
      )}

      <section className="detalhes-historico" aria-labelledby={`hist-${vaga.id}`}>
        <h3 id={`hist-${vaga.id}`}>Últimas alterações desta vaga</h3>
        {registros.length === 0 ? (
          <p className="texto-apoio">Nenhuma alteração registrada.</p>
        ) : (
          <ul>
            {registros.map((registro) => (
              <li key={registro.id}>
                <time dateTime={registro.dataHora}>{formatarDataHora(registro.dataHora)}</time>
                <span>
                  {ROTULO_ESTADO[registro.estadoAnterior]} → {ROTULO_ESTADO[registro.estadoNovo]}
                </span>
                <span className="texto-apoio">{registro.responsavel ?? ROTULO_ORIGEM[registro.origem]}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
