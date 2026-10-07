# Requisitos não funcionais

Os critérios abaixo deverão ser refinados com a infraestrutura e o volume reais antes da implementação. Os valores adotados são metas iniciais verificáveis, adequadas a um MVP acadêmico, e não garantias contratuais.

> **Checkpoint 5:** cada item recebeu a linha “Status no Checkpoint 5”, que descreve o que o protótipo funcional em `frontend/` realmente atende (implementado, parcial, simulado, não implementado ou não aplicável). Os identificadores não foram renumerados. O resumo consolidado está em [`docs/checkpoint-5/status-implementacao.md`](../checkpoint-5/status-implementacao.md).

### RNF01 — Segurança de comunicação e credenciais

- **Categoria:** Segurança
- **Requisito:** O sistema deverá transmitir dados autenticados somente por conexão TLS e armazenar senhas exclusivamente por algoritmo de hash adaptativo com salt, nunca em texto puro.
- **Critério de aceitação:** inspeção de configuração sem protocolo HTTP autenticado, teste de banco sem senha recuperável e revisão automatizada sem credenciais versionadas.
- **Status no Checkpoint 5:** Não aplicável ao protótipo local e não atendido: não há servidor nem TLS, e as credenciais de demonstração são públicas no código.

### RNF02 — Desempenho das consultas comuns

- **Categoria:** Desempenho
- **Requisito:** Consultas de disponibilidade e carregamentos do dashboard deverão responder em até 2 segundos no percentil 95, em ambiente de homologação com até 100 sessões concorrentes e conjunto de dados de referência documentado.
- **Critério de aceitação:** teste de carga reproduzível com relatório de percentis e taxa de erro inferior a 1%.
- **Status no Checkpoint 5:** Não aplicável — não há servidor; nenhum teste de carga foi executado.

### RNF03 — Disponibilidade operacional

- **Categoria:** Disponibilidade
- **Requisito:** Após implantação produtiva, o serviço deverá atingir disponibilidade mensal mínima de 99,5%, desconsideradas janelas de manutenção programada comunicadas previamente.
- **Critério de aceitação:** cálculo mensal baseado em monitoramento externo, com indisponibilidade e manutenções registradas separadamente.
- **Status no Checkpoint 5:** Não aplicável — não há implantação produtiva.

### RNF04 — Usabilidade das tarefas principais

- **Categoria:** Usabilidade
- **Requisito:** Consulta de disponibilidade, atualização de vaga e aplicação de filtro deverão ser concluídas sem ajuda pelo menos por 4 de 5 participantes representativos em teste moderado do MVP.
- **Critério de aceitação:** roteiro de teste, registro de conclusão por tarefa e lista de problemas críticos encontrados.
- **Status no Checkpoint 5:** Não avaliado — nenhum teste moderado com usuários foi realizado.

### RNF05 — Responsividade

- **Categoria:** Responsividade
- **Requisito:** As telas deverão funcionar entre 360 e 1440 pixels de largura sem rolagem horizontal causada pelo layout e sem ocultar ações essenciais.
- **Critério de aceitação:** teste visual nas larguras 360, 768, 1024 e 1440 pixels, incluindo orientação retrato e paisagem quando aplicável.
- **Status no Checkpoint 5:** Atendido no protótipo — layout responsivo com menu lateral recolhível; conferência nas larguras 360, 768, 1024 e 1440 px registrada em `docs/checkpoint-5/status-implementacao.md`.

### RNF06 — Compatibilidade com navegadores

- **Categoria:** Compatibilidade
- **Requisito:** A aplicação web deverá suportar as duas versões estáveis mais recentes, disponíveis na data de cada versão do produto, de Chrome, Edge, Firefox e Safari.
- **Critério de aceitação:** matriz de testes registrada por navegador, versão e fluxo crítico, sem erro bloqueador.
- **Status no Checkpoint 5:** Não verificado — a matriz de navegadores não foi executada; a conferência manual foi feita apenas em navegador baseado em Chromium.

### RNF07 — Escalabilidade por configuração

- **Categoria:** Escalabilidade
- **Requisito:** A arquitetura deverá suportar pelo menos 20 estacionamentos e 10.000 vagas por cliente sem alteração do código-fonte ou da estrutura conceitual do domínio.
- **Critério de aceitação:** carga do conjunto de referência e execução dos testes de consulta e atualização dentro dos limites de `RNF02`.
- **Status no Checkpoint 5:** Não aplicável — dados de demonstração fixos (60 vagas) em `localStorage`.

### RNF08 — Manutenibilidade

- **Categoria:** Manutenibilidade
- **Requisito:** Regras de negócio e serviços críticos deverão possuir testes automatizados com cobertura de ramos mínima de 80%, e o pipeline não deverá apresentar erro crítico de análise estática.
- **Critério de aceitação:** relatório automatizado de cobertura e análise estática anexado a cada versão candidata.
- **Status no Checkpoint 5:** Parcial — testes automatizados (Vitest) das regras de domínio e do armazenamento e análise estática (ESLint) sem erros; cobertura de ramos não medida.

### RNF09 — Confiabilidade e consistência

- **Categoria:** Confiabilidade
- **Requisito:** Uma atualização de estado deverá gravar o novo estado e seu histórico em uma única operação atômica; em caso de falha, nenhum dos dois poderá permanecer parcialmente gravado.
- **Critério de aceitação:** testes de falha forçada confirmando rollback e ausência de divergência entre vaga e histórico.
- **Status no Checkpoint 5:** Simulado — vaga e histórico são gravados juntos em um único `setItem`; se a gravação falhar, nada muda. Não há transação de banco de dados.

### RNF10 — Privacidade e minimização

- **Categoria:** Privacidade
- **Requisito:** O sistema deverá coletar apenas dados pessoais necessários à administração, informar sua finalidade e permitir aplicação de prazos de retenção definidos pela organização e pela legislação aplicável.
- **Critério de aceitação:** inventário de dados pessoais, finalidade e retenção revisado antes da implantação; consulta pública sem identificação do motorista no MVP.
- **Status no Checkpoint 5:** Atendido no escopo do protótipo — a consulta pública não identifica o motorista e nenhum dado pessoal é coletado além do e-mail de demonstração.

### RNF11 — Acessibilidade

- **Categoria:** Acessibilidade
- **Requisito:** Os fluxos principais deverão ser operáveis por teclado, manter foco visível, fornecer nome acessível aos controles e contraste mínimo de 4,5:1 para texto comum; estados não poderão depender somente de cor.
- **Critério de aceitação:** execução de checklist manual, navegação completa por teclado e ferramenta automatizada sem violação crítica nos fluxos principais.
- **Status no Checkpoint 5:** Atendido nos fluxos principais por verificação manual — operação por teclado, foco visível, rótulos, diálogo nativo e estados com cor, ícone e texto; nenhuma ferramenta automatizada de acessibilidade foi executada.

### RNF12 — Recuperação e observabilidade

- **Categoria:** Recuperação e operação
- **Requisito:** O ambiente produtivo deverá manter logs estruturados de erro e cópia de segurança diária, com objetivo de ponto de recuperação de até 24 horas e objetivo de tempo de recuperação de até 4 horas.
- **Critério de aceitação:** teste documentado de restauração bem-sucedida e correlação de um erro simulado com seu registro de log, sem exposição de senha ou token.
- **Status no Checkpoint 5:** Não aplicável — não há ambiente produtivo, logs de servidor nem cópias de segurança.
