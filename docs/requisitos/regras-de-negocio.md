# Regras de negócio

Regras de negócio definem restrições e cálculos do domínio, independentemente da tela ou tecnologia que os executará.

> **Checkpoint 5:** cada item recebeu a linha “Status no Checkpoint 5”, que descreve o que o protótipo funcional em `frontend/` realmente atende (implementado, parcial, simulado, não implementado ou não aplicável). Os identificadores não foram renumerados. O resumo consolidado está em [`docs/checkpoint-5/status-implementacao.md`](../checkpoint-5/status-implementacao.md).

### RN01 — Hierarquia de estacionamento e setor

Cada setor deverá pertencer a exatamente um estacionamento. Um estacionamento poderá possuir vários setores, mas somente poderá ser publicado para consulta quando tiver ao menos um setor ativo.

**Status no Checkpoint 5:** Atendido — cada setor pertence a um estacionamento; a consulta pública lista apenas setores ativos.

### RN02 — Identificação e vínculo da vaga

Cada vaga deverá pertencer a exatamente um setor e possuir um código único dentro do estacionamento. A mudança de setor deverá preservar sua rastreabilidade histórica.

**Status no Checkpoint 5:** Atendido — códigos únicos de A01 a C20; mudança de setor não existe nesta versão.

### RN03 — Classificação e estados permitidos

Cada vaga deverá possuir exatamente um tipo e um estado corrente. Os estados permitidos no MVP serão `LIVRE`, `OCUPADA`, `RESERVADA` e `INDISPONIVEL`.

**Status no Checkpoint 5:** Atendido — quatro estados (`LIVRE`, `OCUPADA`, `RESERVADA`, `INDISPONIVEL`) e um tipo por vaga. `RESERVADA` é definida manualmente, sem fluxo de reserva.

### RN04 — Transição de estado

Uma alteração deverá informar o novo estado, data e hora, origem e responsável quando houver usuário autenticado. Repetir o mesmo estado sem mudança operacional não deverá criar novo evento de ocupação.

**Status no Checkpoint 5:** Atendido — o registro guarda estado anterior e novo, data e hora, origem (`PAINEL_ADMINISTRATIVO` ou `CARGA_INICIAL`) e responsável; repetir o estado é bloqueado na interface e rejeitado no domínio.

### RN05 — Vagas especiais

Tipos de vaga poderão ser marcados como especiais, como pessoa com deficiência, pessoa idosa ou outro tipo regulamentado pela organização. O ParkFlow identificará e contabilizará essas vagas, mas não validará credenciais do motorista no MVP.

**Status no Checkpoint 5:** Atendido — PCD e Idoso são marcados como especiais e contabilizados à parte, sem validação de credenciais.

### RN06 — Disponibilidade

Uma vaga será considerada disponível somente quando estiver ativa e no estado `LIVRE`. Vagas `OCUPADA`, `RESERVADA`, `INDISPONIVEL` ou desativadas não integrarão a quantidade disponível.

**Status no Checkpoint 5:** Atendido — `domain/indicadores.ts` considera disponível apenas vaga ativa e livre.

### RN07 — Taxa de ocupação

A taxa de ocupação será calculada por `(vagas OCUPADAS + vagas RESERVADAS) / vagas operacionais × 100`. Vagas operacionais são as vagas ativas que não estão `INDISPONIVEIS`. Quando não houver vaga operacional, a taxa será apresentada como “não aplicável”, nunca como zero.

**Status no Checkpoint 5:** Atendido — fórmula única em `domain/indicadores.ts`; sem vaga operacional a taxa aparece como “não aplicável”.

### RN08 — Histórico imutável

Cada mudança efetiva de estado deverá gerar um registro histórico com o estado anterior, o novo estado, data e hora, origem e responsável quando aplicável. Registros históricos não poderão ser alterados nem excluídos por usuários comuns.

**Status no Checkpoint 5:** Atendido na interface — o histórico é somente leitura. Ressalva: “Restaurar dados de demonstração” recria todo o conjunto de dados, e o `localStorage` pode ser apagado pelo próprio navegador.

### RN09 — Consistência dos agregados

Dashboard, consulta do motorista, indicadores e relatórios deverão derivar do estado corrente e das mesmas regras de disponibilidade e ocupação. Um mesmo recorte e momento de referência não poderão apresentar totais divergentes.

**Status no Checkpoint 5:** Atendido — dashboard, consulta, setores e relatórios usam as mesmas funções de cálculo, derivadas do estado corrente.

### RN10 — Desativação e preservação

Estacionamentos, setores, tipos, vagas e usuários com histórico associado deverão ser desativados logicamente, sem exclusão física pelo fluxo comum. Elementos desativados não aparecerão como operacionais, mas continuarão disponíveis em consultas históricas autorizadas.

**Status no Checkpoint 5:** Parcial — o campo `ativa` é respeitado nos cálculos e bloqueia alterações, mas não há fluxo de desativação lógica.
