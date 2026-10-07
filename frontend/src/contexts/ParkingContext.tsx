import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ESTRUTURA } from '../data/seed';
import { calcularIndicadores, indicadoresPor } from '../domain/indicadores';
import { alterarEstadoVaga, ErroAlteracaoVaga, ultimaAtualizacao } from '../domain/vagas';
import type { EstadoVaga } from '../domain/tipos';
import { ambiente } from '../services/ambiente';
import { carregarDados, CHAVE_DADOS, restaurarDemonstracao, salvarDados } from '../services/storage';
import { ParkingContext, type ResultadoSalvar, type ValorParking } from './useParking';

const AVISO_MEMORIA =
  'O armazenamento do navegador está indisponível. As alterações valem apenas enquanto esta página estiver aberta.';

export function ParkingProvider({ children }: { children: ReactNode }) {
  const [carga] = useState(() => carregarDados(ambiente.storage));
  const [dados, setDados] = useState(carga.dados);
  const [aviso, setAviso] = useState<string | null>(carga.aviso ?? (ambiente.persistente ? null : AVISO_MEMORIA));

  // Outra aba gravou dados: recarrega para manter as telas coerentes.
  useEffect(() => {
    function aoMudarStorage(evento: StorageEvent) {
      if (evento.key === CHAVE_DADOS || evento.key === null) {
        const recarga = carregarDados(ambiente.storage);
        setDados(recarga.dados);
        if (recarga.aviso) setAviso(recarga.aviso);
      }
    }
    window.addEventListener('storage', aoMudarStorage);
    return () => window.removeEventListener('storage', aoMudarStorage);
  }, []);

  const alterarEstado = useCallback(
    (vagaId: string, novoEstado: EstadoVaga, responsavel: string | null): ResultadoSalvar => {
      try {
        const resultado = alterarEstadoVaga(dados, vagaId, novoEstado, {
          agora: new Date(),
          origem: 'PAINEL_ADMINISTRATIVO',
          responsavel,
          setores: ESTRUTURA.setores,
        });
        // Vaga e histórico são gravados juntos; se a gravação falhar, a tela não muda.
        if (!salvarDados(ambiente.storage, resultado.dados)) {
          return { ok: false, erro: 'Não foi possível salvar a alteração no navegador. Nada foi alterado.' };
        }
        setDados(resultado.dados);
        return { ok: true, vaga: resultado.vaga, registro: resultado.registro };
      } catch (erro) {
        if (erro instanceof ErroAlteracaoVaga) return { ok: false, erro: erro.message };
        throw erro;
      }
    },
    [dados],
  );

  const restaurar = useCallback(() => {
    setDados(restaurarDemonstracao(ambiente.storage));
    setAviso(ambiente.persistente ? null : AVISO_MEMORIA);
  }, []);

  const dispensarAviso = useCallback(() => setAviso(null), []);

  const indicadores = useMemo(() => calcularIndicadores(dados.vagas), [dados.vagas]);
  const indicadoresPorSetor = useMemo(
    () =>
      indicadoresPor(
        dados.vagas,
        ESTRUTURA.setores.map((setor) => setor.id),
        (vaga) => vaga.setorId,
      ),
    [dados.vagas],
  );
  const ultima = useMemo(() => ultimaAtualizacao(dados.vagas), [dados.vagas]);

  const valor = useMemo<ValorParking>(
    () => ({
      estrutura: ESTRUTURA,
      vagas: dados.vagas,
      historico: dados.historico,
      indicadores,
      indicadoresPorSetor,
      ultimaAtualizacao: ultima,
      persistente: ambiente.persistente,
      aviso,
      dispensarAviso,
      alterarEstado,
      restaurar,
    }),
    [dados, indicadores, indicadoresPorSetor, ultima, aviso, dispensarAviso, alterarEstado, restaurar],
  );

  return <ParkingContext.Provider value={valor}>{children}</ParkingContext.Provider>;
}
