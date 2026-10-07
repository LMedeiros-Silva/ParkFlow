import { Link, useParams } from 'react-router-dom';
import { CabecalhoPagina } from '../components/Cabecalho';
import { CartaoSetor } from '../components/CartaoSetor';
import { EstadoVazio } from '../components/EstadoVazio';
import { useParking } from '../contexts/useParking';
import { calcularIndicadores, formatarTaxa } from '../domain/indicadores';

export function SetoresPage() {
  const { estacionamentoId } = useParams();
  const { estrutura, vagas, indicadoresPorSetor } = useParking();
  const estacionamento = estrutura.estacionamentos.find((item) => item.id === estacionamentoId);
  if (!estacionamento) {
    return (
      <EstadoVazio titulo="Estacionamento não encontrado.">
        <Link to="/estacionamentos">Voltar para estacionamentos</Link>
      </EstadoVazio>
    );
  }

  const setores = estrutura.setores.filter((setor) => setor.estacionamentoId === estacionamento.id);
  const idsSetores = new Set(setores.map((setor) => setor.id));
  const total = calcularIndicadores(vagas.filter((vaga) => idsSetores.has(vaga.setorId)));

  return (
    <>
      <CabecalhoPagina
        titulo={estacionamento.nome}
        descricao={`${estacionamento.endereco} · ${total.total} vagas · ${total.disponiveis} livres · ocupação ${formatarTaxa(total.taxaOcupacao)}`}
        migalhas={[{ rotulo: 'Estacionamentos', para: '/estacionamentos' }, { rotulo: estacionamento.nome }]}
      />
      <h2 className="secao__titulo">Setores</h2>
      {setores.length === 0 ? (
        <EstadoVazio titulo="Este estacionamento ainda não possui setores." />
      ) : (
        <div className="grade-cartoes">
          {setores.map((setor) => (
            <CartaoSetor
              key={setor.id}
              setor={setor}
              indicadores={indicadoresPorSetor.get(setor.id) ?? calcularIndicadores([])}
            />
          ))}
        </div>
      )}
    </>
  );
}
