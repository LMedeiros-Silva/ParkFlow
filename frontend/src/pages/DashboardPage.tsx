import { Accessibility, Info, SquareParking, Percent } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CabecalhoPagina } from '../components/Cabecalho';
import { CartaoSetor } from '../components/CartaoSetor';
import { IconeEstado } from '../components/Estado';
import { GraficoOcupacao } from '../components/GraficoOcupacao';
import { Kpi } from '../components/Kpi';
import { ListaAtividade } from '../components/ListaAtividade';
import { useParking } from '../contexts/useParking';
import { formatarDataHora } from '../domain/datas';
import { calcularIndicadores, formatarTaxa } from '../domain/indicadores';

export function DashboardPage() {
  const { estrutura, vagas, historico, indicadores, indicadoresPorSetor, ultimaAtualizacao } = useParking();
  const estacionamento = estrutura.estacionamentos[0];
  const agora = new Date();

  const linhasGrafico = estrutura.setores.map((setor) => ({
    id: setor.id,
    nome: `${setor.nome} · ${setor.descricao}`,
    indicadores: indicadoresPorSetor.get(setor.id) ?? calcularIndicadores([]),
  }));

  // Vagas especiais (RF14) separadas por tipo e setor, com as mesmas fórmulas do restante do painel.
  const especiais = useMemo(() => {
    const tipos = estrutura.tiposVaga.filter((tipo) => tipo.especial);
    return tipos.flatMap((tipo) =>
      estrutura.setores.map((setor) => ({
        chave: `${tipo.id}-${setor.id}`,
        tipo: tipo.nome,
        setor: setor.nome,
        indicadores: calcularIndicadores(
          vagas.filter((vaga) => vaga.tipoId === tipo.id && vaga.setorId === setor.id),
        ),
      })),
    );
  }, [estrutura, vagas]);
  const totalEspeciais = calcularIndicadores(
    vagas.filter((vaga) => estrutura.tiposVaga.some((tipo) => tipo.especial && tipo.id === vaga.tipoId)),
  );

  return (
    <>
      <CabecalhoPagina
        titulo="Dashboard operacional"
        descricao={
          <>
            {estacionamento.nome} · {estacionamento.endereco} · última alteração em{' '}
            {ultimaAtualizacao ? formatarDataHora(ultimaAtualizacao) : '—'}
          </>
        }
      />

      <section aria-labelledby="titulo-kpis">
        <h2 id="titulo-kpis" className="visualmente-oculto">
          Indicadores gerais
        </h2>
        <dl className="kpis">
          <Kpi rotulo="Total de vagas" valor={indicadores.total} icone={<SquareParking aria-hidden="true" size={18} />} />
          <Kpi
            rotulo="Disponíveis"
            valor={indicadores.disponiveis}
            icone={<IconeEstado estado="LIVRE" size={18} />}
            variante="livre"
          />
          <Kpi
            rotulo="Ocupadas"
            valor={indicadores.ocupadas}
            icone={<IconeEstado estado="OCUPADA" size={18} />}
            variante="ocupada"
          />
          <Kpi
            rotulo="Reservadas"
            valor={indicadores.reservadas}
            icone={<IconeEstado estado="RESERVADA" size={18} />}
            variante="reservada"
          />
          <Kpi
            rotulo="Indisponíveis"
            valor={indicadores.indisponiveis}
            icone={<IconeEstado estado="INDISPONIVEL" size={18} />}
            variante="indisponivel"
          />
          <Kpi
            rotulo="Taxa de ocupação"
            valor={formatarTaxa(indicadores.taxaOcupacao)}
            icone={<Percent aria-hidden="true" size={18} />}
            variante="destaque"
            detalhe={`(${indicadores.ocupadas} + ${indicadores.reservadas}) ÷ ${indicadores.operacionais} operacionais`}
          />
        </dl>
        <p className="nota">
          <Info aria-hidden="true" size={16} />
          Taxa de ocupação = (ocupadas + reservadas) ÷ vagas operacionais × 100. Vagas operacionais são as ativas que
          não estão indisponíveis. Sem vagas operacionais, a taxa aparece como “não aplicável”.
        </p>
      </section>

      <div className="grade-dupla">
        <section className="painel" aria-labelledby="titulo-grafico">
          <h2 id="titulo-grafico" className="painel__titulo">
            Ocupação por setor
          </h2>
          <GraficoOcupacao linhas={linhasGrafico} titulo="Vagas por estado em cada setor" />
        </section>

        <section className="painel" aria-labelledby="titulo-atividade">
          <div className="painel__cabecalho">
            <h2 id="titulo-atividade" className="painel__titulo">
              Atividade recente
            </h2>
            <Link to="/historico">Ver histórico</Link>
          </div>
          {historico.length === 0 ? (
            <p className="texto-apoio">Nenhuma alteração registrada.</p>
          ) : (
            <ListaAtividade registros={historico.slice(0, 5)} setores={estrutura.setores} agora={agora} />
          )}
        </section>
      </div>

      <section aria-labelledby="titulo-setores" className="secao">
        <h2 id="titulo-setores" className="secao__titulo">
          Setores
        </h2>
        <div className="grade-cartoes">
          {estrutura.setores.map((setor) => (
            <CartaoSetor
              key={setor.id}
              setor={setor}
              indicadores={indicadoresPorSetor.get(setor.id) ?? calcularIndicadores([])}
            />
          ))}
        </div>
      </section>

      <section className="painel" aria-labelledby="titulo-especiais">
        <h2 id="titulo-especiais" className="painel__titulo">
          <Accessibility aria-hidden="true" size={20} />
          Vagas especiais (PCD e Idoso)
        </h2>
        <p className="texto-apoio">
          {totalEspeciais.total} vagas especiais · {totalEspeciais.disponiveis} livres · ocupação{' '}
          {formatarTaxa(totalEspeciais.taxaOcupacao)}. O sistema identifica essas vagas, mas não valida credenciais do
          motorista.
        </p>
        <div className="tabela-rolagem">
          <table className="tabela">
            <caption className="visualmente-oculto">Vagas especiais por tipo e setor</caption>
            <thead>
              <tr>
                <th scope="col">Tipo</th>
                <th scope="col">Setor</th>
                <th scope="col">Total</th>
                <th scope="col">Livres</th>
                <th scope="col">Ocupadas</th>
                <th scope="col">Reservadas</th>
                <th scope="col">Indisponíveis</th>
                <th scope="col">Taxa</th>
              </tr>
            </thead>
            <tbody>
              {especiais.map((linha) => (
                <tr key={linha.chave}>
                  <th scope="row">{linha.tipo}</th>
                  <td>{linha.setor}</td>
                  <td>{linha.indicadores.total}</td>
                  <td>{linha.indicadores.disponiveis}</td>
                  <td>{linha.indicadores.ocupadas}</td>
                  <td>{linha.indicadores.reservadas}</td>
                  <td>{linha.indicadores.indisponiveis}</td>
                  <td>{formatarTaxa(linha.indicadores.taxaOcupacao)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
