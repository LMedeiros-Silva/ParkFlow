import { formatarTaxa, type Indicadores } from '../domain/indicadores';
import { ROTULO_ESTADO, type EstadoVaga } from '../domain/tipos';
import { IconeEstado } from './Estado';

export interface LinhaGrafico {
  id: string;
  nome: string;
  indicadores: Indicadores;
}

const SEGMENTOS: { estado: EstadoVaga; chave: keyof Indicadores }[] = [
  { estado: 'OCUPADA', chave: 'ocupadas' },
  { estado: 'RESERVADA', chave: 'reservadas' },
  { estado: 'LIVRE', chave: 'disponiveis' },
  { estado: 'INDISPONIVEL', chave: 'indisponiveis' },
];

/**
 * Barras empilhadas feitas com CSS (sem biblioteca de gráficos). O desenho é decorativo para
 * leitores de tela; a mesma informação está na tabela logo abaixo.
 */
export function GraficoOcupacao({ linhas, titulo }: { linhas: LinhaGrafico[]; titulo: string }) {
  return (
    <figure className="grafico">
      <figcaption className="grafico__titulo">{titulo}</figcaption>
      <ul className="grafico__legenda" aria-hidden="true">
        {SEGMENTOS.map(({ estado }) => (
          <li key={estado} className={`grafico__legenda-item estado--${estado.toLowerCase()}`}>
            <span className={`grafico__amostra segmento--${estado.toLowerCase()}`} />
            <IconeEstado estado={estado} size={14} />
            {ROTULO_ESTADO[estado]}
          </li>
        ))}
      </ul>
      <div className="grafico__linhas" aria-hidden="true">
        {linhas.map((linha) => {
          const ativas = linha.indicadores.total - linha.indicadores.inativas;
          return (
            <div key={linha.id} className="grafico__linha">
              <div className="grafico__rotulo">
                <span>{linha.nome}</span>
                <strong>{formatarTaxa(linha.indicadores.taxaOcupacao)}</strong>
              </div>
              <div className="grafico__barra">
                {SEGMENTOS.map(({ estado, chave }) => {
                  const quantidade = linha.indicadores[chave] as number;
                  if (quantidade === 0 || ativas === 0) return null;
                  return (
                    <span
                      key={estado}
                      className={`grafico__segmento segmento--${estado.toLowerCase()}`}
                      style={{ flexGrow: quantidade }}
                      title={`${ROTULO_ESTADO[estado]}: ${quantidade}`}
                    >
                      {quantidade}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="tabela-rolagem">
        <table className="tabela tabela--compacta">
          <caption className="visualmente-oculto">Dados do gráfico: {titulo}</caption>
          <thead>
            <tr>
              <th scope="col">Setor</th>
              <th scope="col">Ocupadas</th>
              <th scope="col">Reservadas</th>
              <th scope="col">Livres</th>
              <th scope="col">Indisponíveis</th>
              <th scope="col">Taxa</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => (
              <tr key={linha.id}>
                <th scope="row">{linha.nome}</th>
                <td>{linha.indicadores.ocupadas}</td>
                <td>{linha.indicadores.reservadas}</td>
                <td>{linha.indicadores.disponiveis}</td>
                <td>{linha.indicadores.indisponiveis}</td>
                <td>{formatarTaxa(linha.indicadores.taxaOcupacao)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
