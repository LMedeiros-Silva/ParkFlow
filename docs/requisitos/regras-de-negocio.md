# Regras de negócio

Regras de negócio definem restrições e cálculos do domínio, independentemente da tela ou tecnologia que os executará.

### RN01 — Hierarquia de estacionamento e setor

Cada setor deverá pertencer a exatamente um estacionamento. Um estacionamento poderá possuir vários setores, mas somente poderá ser publicado para consulta quando tiver ao menos um setor ativo.

### RN02 — Identificação e vínculo da vaga

Cada vaga deverá pertencer a exatamente um setor e possuir um código único dentro do estacionamento. A mudança de setor deverá preservar sua rastreabilidade histórica.

### RN03 — Classificação e estados permitidos

Cada vaga deverá possuir exatamente um tipo e um estado corrente. Os estados permitidos no MVP serão `LIVRE`, `OCUPADA`, `RESERVADA` e `INDISPONIVEL`.

### RN04 — Transição de estado

Uma alteração deverá informar o novo estado, data e hora, origem e responsável quando houver usuário autenticado. Repetir o mesmo estado sem mudança operacional não deverá criar novo evento de ocupação.

### RN05 — Vagas especiais

Tipos de vaga poderão ser marcados como especiais, como pessoa com deficiência, pessoa idosa ou outro tipo regulamentado pela organização. O ParkFlow identificará e contabilizará essas vagas, mas não validará credenciais do motorista no MVP.

### RN06 — Disponibilidade

Uma vaga será considerada disponível somente quando estiver ativa e no estado `LIVRE`. Vagas `OCUPADA`, `RESERVADA`, `INDISPONIVEL` ou desativadas não integrarão a quantidade disponível.

### RN07 — Taxa de ocupação

A taxa de ocupação será calculada por `(vagas OCUPADAS + vagas RESERVADAS) / vagas operacionais × 100`. Vagas operacionais são as vagas ativas que não estão `INDISPONIVEIS`. Quando não houver vaga operacional, a taxa será apresentada como “não aplicável”, nunca como zero.

### RN08 — Histórico imutável

Cada mudança efetiva de estado deverá gerar um registro histórico com o estado anterior, o novo estado, data e hora, origem e responsável quando aplicável. Registros históricos não poderão ser alterados nem excluídos por usuários comuns.

### RN09 — Consistência dos agregados

Dashboard, consulta do motorista, indicadores e relatórios deverão derivar do estado corrente e das mesmas regras de disponibilidade e ocupação. Um mesmo recorte e momento de referência não poderão apresentar totais divergentes.

### RN10 — Desativação e preservação

Estacionamentos, setores, tipos, vagas e usuários com histórico associado deverão ser desativados logicamente, sem exclusão física pelo fluxo comum. Elementos desativados não aparecerão como operacionais, mas continuarão disponíveis em consultas históricas autorizadas.
