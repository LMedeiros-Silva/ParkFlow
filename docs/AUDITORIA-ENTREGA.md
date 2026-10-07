# Auditoria da entrega — Parte 1

**Produto:** ParkFlow — Sistema Inteligente de Gestão de Estacionamentos<br>
**Data da revisão:** 2 de setembro de 2026<br>
**Escopo:** documentação, UML, marca, pitch, planejamento e organização do repositório.

Esta auditoria usa a rubrica acadêmica e marca como concluídos somente itens apoiados por um artefato existente. O resultado automatizado deve ser reproduzido com:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/validar-entrega.ps1
```

## 1. Documentação e requisitos — 25%

- [x] Problema claramente definido
- [x] Público-alvo e diferença entre comprador e usuário definidos
- [x] Duas personas coerentes
- [x] 18 requisitos funcionais identificados e priorizados
- [x] 12 requisitos não funcionais verificáveis
- [x] 10 regras de negócio separadas dos requisitos funcionais
- [x] Escopo dividido entre MVP, exclusões e evoluções
- [x] Matriz de rastreabilidade
- [x] Consistência entre problema, objetivos, requisitos, UML e escopo

**Evidências:** `docs/requisitos/` e `docs/uml/matriz-rastreabilidade.md`.

## 2. UML — 20%

- [x] Diagrama de Casos de Uso criado
- [x] Diagrama de Classes criado
- [x] Arquivos `.drawio` com XML bem formado, IDs únicos e elementos editáveis
- [x] Casos, restrições, classes e cardinalidades coerentes com requisitos e regras
- [ ] Abertura e inspeção visual final realizadas por um integrante no diagrams.net

**Evidências:** `docs/uml/diagrama-casos-de-uso.drawio`, `docs/uml/diagrama-classes.drawio` e `docs/uml/README.md`.

**Limitação:** a validação local cobre estrutura, XML, células, referências e geometrias. A abertura gráfica no diagrams.net deve ser confirmada pela equipe antes da apresentação.

## 3. Identidade visual — 20%

- [x] Nome e slogan preservados
- [x] Logo principal e símbolo reduzido em SVG original
- [x] Briefing para refinamento futuro
- [x] Paleta principal e secundária com códigos HEX
- [x] Tipografia e hierarquia definidas
- [x] Estados com sinais além da cor
- [x] Coerência declarada com mobilidade, tecnologia, segurança e público B2B
- [ ] Aprovação visual final da marca realizada pelo grupo

**Evidências:** `docs/marca/identidade-visual.md` e `assets/logo/`.

## 4. Pitch — 15%

- [x] Proposta de valor
- [x] Diferencial de plataforma operacional
- [x] Hipótese comercial SaaS B2B sem preços definitivos
- [x] Pitch de aproximadamente um minuto
- [x] Vídeo pitch publicado externamente e vinculado no README
- [x] Vídeo de pitch e apresentação do projeto publicado externamente e vinculado no README

**Evidências no repositório:** `docs/pitch/proposta-de-valor.md` e links externos no `README.md`.

**Política do vídeo:** o roteiro é uma entrega acadêmica obrigatória, mas, por decisão do grupo, seu conteúdo não pode ser salvo ou versionado neste repositório. Ele deverá ser recebido externamente, distribuído entre os integrantes e ensaiado.

## 5. Trello — 10%

- [x] Estrutura BACKLOG, TO DO, DOING, REVIEW e DONE definida
- [x] Cards reais da Parte 1 especificados
- [x] Responsáveis genéricos usados sem inventar integrantes
- [x] Prioridades, checklists e critérios de conclusão definidos
- [x] Quadro real criado e vinculado
- [ ] Integrantes reais atribuídos e movimentações registradas

**Evidência:** `docs/planejamento/trello.md`.

## 6. GitHub — 10%

- [x] README principal profissional e navegável
- [x] Estrutura mínima organizada
- [x] Documentação ligada por caminhos relativos
- [x] `.gitignore` e licença MIT presentes
- [x] Áreas futuras delimitadas sem código funcional
- [x] Validação automatizada incluída
- [x] Repositório remoto definido e envio autorizado pelo grupo

**Evidências:** `README.md`, `.gitignore`, `LICENSE`, READMEs das áreas futuras e `scripts/validar-entrega.ps1`.

## Resultado consolidado

Os artefatos locais cobrem os componentes documentais da rubrica. Os vídeos externos e o quadro Trello foram vinculados, e o envio ao repositório remoto foi autorizado. A entrega ainda depende de ações humanas que não devem ser simuladas: abrir os diagramas no diagrams.net, aprovar visualmente a marca, ensaiar a apresentação e substituir os placeholders da equipe.

**Resultado automatizado em 2 de setembro de 2026:** `VALIDAÇÃO APROVADA`, com 12 verificações aprovadas e 0 falhas. Foram confirmados 32 arquivos obrigatórios, 18 RFs, 12 RNFs, 10 regras, 46 links Markdown locais, XML/SVG válidos e ausência de código funcional ou roteiro de vídeo salvo.

## Pontos a confirmar pelo grupo

1. nomes e quantidade de integrantes;
2. distribuição real das tarefas;
3. aprovação dos diagramas após abertura visual;
4. aprovação ou refinamento do logo no Figma;
5. escolha de quem apresentará cada trecho do vídeo;
6. uso efetivo do Trello pela equipe;
7. requisitos acadêmicos das Partes 2 e 3.
