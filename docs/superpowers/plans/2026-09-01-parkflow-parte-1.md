# ParkFlow Parte 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a Parte 1 documental, visual e organizacional do ParkFlow na raiz atual, pronta para avaliação acadêmica e para evolução futura.

**Architecture:** A entrega usa documentos Markdown como fonte de verdade, diagramas draw.io como modelos editáveis e um validador PowerShell como controle automatizado de integridade. A rastreabilidade liga objetivos, requisitos, casos de uso, classes, regras e escopo; o roteiro de vídeo permanece exclusivamente fora do repositório.

**Tech Stack:** Markdown, XML do diagrams.net, SVG, PowerShell, Git/GitHub como destino futuro.

**Spec:** `docs/superpowers/specs/2026-09-01-parkflow-parte-1-design.md`

## Global Constraints

- Usar português brasileiro em toda a entrega acadêmica.
- Manter a pasta atual como raiz; não criar `parkflow/`.
- Não implementar frontend, backend, banco, API ou integração funcional.
- Criar exatamente 18 RFs, 12 RNFs e 10 regras de negócio.
- Manter MVP, fora do escopo e evoluções claramente separados.
- Não salvar o conteúdo do roteiro do vídeo de dois minutos em nenhum arquivo.
- Não inventar integrantes, estatísticas, preços ou requisitos acadêmicos futuros.
- Não realizar commit, push, criação de Trello ou outra alteração remota.
- Usar licença MIT.

---

### Task 1: Estrutura e apresentação do repositório

**Files:**
- Create: `README.md`
- Create: `.gitignore`
- Create: `LICENSE`
- Create: `frontend/README.md`
- Create: `backend/README.md`
- Create: `database/README.md`
- Create: `assets/images/README.md`

**Interfaces:**
- Consumes: decisões e escopo da especificação aprovada.
- Produces: navegação principal e limites explícitos das futuras áreas técnicas.

- [x] **Step 1: Criar a estrutura mínima**

Criar os diretórios previstos pela especificação sem adicionar código funcional ou arquivos artificiais.

- [x] **Step 2: Criar metadados do repositório**

Adicionar licença MIT e `.gitignore` neutro para sistemas operacionais, IDEs, variáveis locais, logs e artefatos futuros comuns de Node/Python.

- [x] **Step 3: Criar READMEs das áreas futuras**

Explicar finalidade, limites da Parte 1 e tecnologias apenas consideradas, sem apresentar a stack como decisão definitiva.

- [x] **Step 4: Criar o README principal**

Cobrir produto, problema, solução, públicos, funcionalidades do MVP, diferenciais, UML, marca, estrutura, documentação, roadmap, equipe, tecnologias consideradas, status e licença com links relativos válidos.

- [x] **Step 5: Verificar estrutura**

Run: `rg --files`

Expected: somente arquivos planejados e nenhuma implementação funcional.

### Task 2: Requisitos e rastreabilidade

**Files:**
- Create: `docs/requisitos/problema.md`
- Create: `docs/requisitos/objetivos.md`
- Create: `docs/requisitos/publico-alvo.md`
- Create: `docs/requisitos/personas.md`
- Create: `docs/requisitos/requisitos-funcionais.md`
- Create: `docs/requisitos/requisitos-nao-funcionais.md`
- Create: `docs/requisitos/regras-de-negocio.md`
- Create: `docs/requisitos/escopo.md`
- Create: `docs/uml/matriz-rastreabilidade.md`

**Interfaces:**
- Consumes: problema e limites de MVP definidos na especificação.
- Produces: RF01–RF18, RNF01–RNF12, RN01–RN10 e relações usadas pelos diagramas.

- [x] **Step 1: Documentar problema, objetivos e públicos**

Separar impacto sobre motoristas e gestores, compradores e usuários finais; criar personas realistas de motorista e gestor sem dados estatísticos inventados.

- [x] **Step 2: Definir requisitos funcionais**

Usar 18 itens cobrindo autenticação, usuários gestores, estacionamentos, setores, tipos, vagas, estados, disponibilidade ao motorista, dashboard, histórico, indicadores, relatórios, auditoria e encerramento de sessão.

- [x] **Step 3: Definir requisitos não funcionais**

Usar 12 critérios verificáveis de segurança, desempenho, disponibilidade, usabilidade, responsividade, compatibilidade, escalabilidade, manutenibilidade, confiabilidade, privacidade, acessibilidade e observabilidade/backup.

- [x] **Step 4: Definir regras e escopo**

Usar 10 regras para hierarquia, unicidade, estados, transições, vagas especiais, disponibilidade, ocupação, histórico, consistência e exclusão lógica. Separar MVP, fora do escopo e evoluções.

- [x] **Step 5: Criar matriz de rastreabilidade**

Relacionar objetivos específicos, RFs, casos de uso, classes e regras sem deixar caso de uso ou classe principal órfã.

- [x] **Step 6: Verificar contagens**

Run: `rg -o '^### RF[0-9]{2}' docs/requisitos/requisitos-funcionais.md | Measure-Object`

Expected: `Count = 18`; repetir para RNF (`12`) e RN (`10`).

### Task 3: Diagramas UML editáveis

**Files:**
- Create: `docs/uml/diagrama-casos-de-uso.drawio`
- Create: `docs/uml/diagrama-classes.drawio`
- Create: `docs/uml/README.md`

**Interfaces:**
- Consumes: RF01–RF18, RN01–RN10 e matriz de rastreabilidade.
- Produces: células `mxCell` editáveis com IDs únicos, geometria, associações e cardinalidades.

- [x] **Step 1: Modelar casos de uso**

Criar fronteira ParkFlow, atores Motorista e Administrador/Gestor e casos derivados dos RFs. Usar `include` somente para autenticação obrigatória quando semanticamente necessário.

- [x] **Step 2: Modelar classes**

Criar Usuario, Administrador, Estacionamento, Setor, Vaga, TipoVaga, HistoricoOcupacao e RelatorioOperacional com atributos, operações, herança, composições, associações e cardinalidades coerentes.

- [x] **Step 3: Documentar os diagramas**

Explicar finalidade, escopo, edição no diagrams.net, decisões de modelagem e limitação de eventual validação gráfica.

- [x] **Step 4: Validar XML estruturalmente**

Run: `[xml](Get-Content -Raw docs/uml/diagrama-casos-de-uso.drawio) | Out-Null`

Expected: nenhum erro; repetir para o diagrama de classes.

### Task 4: Identidade visual e logo

**Files:**
- Create: `docs/marca/identidade-visual.md`
- Create: `docs/marca/README.md`
- Create: `assets/logo/parkflow-logo.svg`
- Create: `assets/logo/parkflow-simbolo.svg`

**Interfaces:**
- Consumes: nome, slogan, posicionamento B2B e estados de vaga.
- Produces: marca vetorial e regras de cor/tipografia reutilizáveis.

- [x] **Step 1: Definir a identidade**

Documentar conceito, personalidade, públicos, logo, paletas com HEX, tipografia, hierarquia, estados acessíveis, aplicações, área de proteção e usos incorretos.

- [x] **Step 2: Criar os SVGs**

Combinar P, localização e fluxo em formas vetoriais originais; criar assinatura principal e símbolo reduzido com `viewBox`, título acessível e sem imagem raster embutida.

- [x] **Step 3: Validar os SVGs**

Run: `[xml](Get-Content -Raw assets/logo/parkflow-logo.svg) | Out-Null`

Expected: nenhum erro e presença de elementos vetoriais separados.

### Task 5: Proposta, pitch e planejamento

**Files:**
- Create: `docs/pitch/proposta-de-valor.md`
- Create: `docs/planejamento/trello.md`
- Create: `docs/planejamento/backlog.md`
- Create: `docs/planejamento/roadmap.md`

**Interfaces:**
- Consumes: problema, escopo, requisitos e posicionamento aprovados.
- Produces: mensagem comercial, hipótese SaaS B2B e organização acadêmica da Parte 1.

- [x] **Step 1: Criar proposta de valor**

Cobrir problema, públicos, solução, valor, diferenciais, benefícios, posicionamento e hipótese Starter/Business/Enterprise sem preços.

- [x] **Step 2: Criar pitch de um minuto**

Produzir fala natural com problema, solução, funcionamento, diferencial, valor e fechamento, adequada a aproximadamente um minuto.

- [x] **Step 3: Planejar o Trello**

Definir BACKLOG, TO DO, DOING, REVIEW e DONE; criar cards da Parte 1 com descrição, `[Membro N]`, prioridade, checklist e critério de conclusão.

- [x] **Step 4: Criar backlog e roadmap**

Separar MVP, melhorias e futuro; organizar as três partes sem inventar instruções acadêmicas ainda não fornecidas.

- [x] **Step 5: Confirmar exclusão do roteiro**

Run: `rg --files | rg 'roteiro.*video|video.*roteiro'`

Expected: nenhum resultado.

### Task 6: Validação automatizada e auditoria final

**Files:**
- Create: `scripts/validar-entrega.ps1`
- Create: `docs/AUDITORIA-ENTREGA.md`
- Modify: `README.md`
- Modify: arquivos com links ou inconsistências identificadas pela validação.

**Interfaces:**
- Consumes: todos os artefatos das tarefas anteriores.
- Produces: relatório automatizado de integridade e auditoria baseada em evidências.

- [x] **Step 1: Criar o validador PowerShell**

Implementar funções para arquivos obrigatórios, contagens por IDs, XML/draw.io, IDs duplicados, geometria, SVG, links Markdown locais, ausência do roteiro e marcadores de pendência.

- [x] **Step 2: Executar o validador**

Run: `powershell -ExecutionPolicy Bypass -File scripts/validar-entrega.ps1`

Expected: saída final `VALIDAÇÃO APROVADA` e exit code `0`.

- [x] **Step 3: Criar a auditoria**

Marcar somente critérios respaldados por arquivos e validações; registrar que o roteiro é externo, a validação gráfica completa depende do diagrams.net e ações humanas continuam abertas.

- [x] **Step 4: Revisar conteúdo e links**

Executar buscas de IDs, termos de futuro, marcadores de pendência e referências ao roteiro; corrigir toda contradição encontrada sem inserir o conteúdo externo.

- [x] **Step 5: Registrar o estado final sem commit**

Run: `rg --files | Sort-Object`

Expected: estrutura completa, nenhum roteiro de vídeo e nenhum código funcional.
