# Auditoria do Checkpoint 5 — MVP funcional

**Produto:** ParkFlow — Sistema Inteligente de Gestão de Estacionamentos<br>
**Data da revisão:** 7 de outubro de 2026<br>
**Escopo:** MVP em `frontend/`, documentação atualizada e diagramas UML do Checkpoint 5.

A auditoria usa os critérios de avaliação da etapa e marca como concluído somente o que foi verificado. As notas são estimativas da equipe, não a avaliação oficial. A auditoria da Parte 1 continua em [`docs/AUDITORIA-ENTREGA.md`](../AUDITORIA-ENTREGA.md).

## Resultado das verificações automáticas

| Verificação | Resultado |
|---|---|
| `npm install` | concluído, 0 vulnerabilidades |
| `npm run lint` | 0 problemas |
| `npm test` | 48 testes aprovados em 6 arquivos |
| `npm run build` | sem erros de TypeScript; build gerado |
| `scripts/validar-entrega.ps1` | 15 verificações aprovadas, 0 falhas |

## A) Funcionalidade do protótipo — 30%

- [x] Telas navegáveis: login, dashboard, estacionamentos, setores, vagas, consulta, histórico, relatórios e 404
- [x] Estado compartilhado: a alteração de A01 refletiu no setor, no estacionamento, no dashboard, na consulta, no histórico e no relatório
- [x] Alteração validada (estado igual bloqueado; vaga inativa rejeitada) e persistida após recarregar
- [x] Reset, logout e rotas protegidas funcionando
- [ ] Cadastro, edição e desativação da estrutura (RF04–RF07 apenas consulta)
- [ ] RF03, RF17 e RF18

**Estimativa:** 27/30. O fluxo crítico funciona de ponta a ponta; os cadastros não fazem parte deste MVP.

## B) Ambiente de teste — 20%

- [x] `npm install` e `npm run dev` na raiz, sem backend, banco, Docker, `.env` ou conta externa
- [x] `npm run build` e `npm run preview` funcionando; rota profunda servida pelo build
- [x] README com pré-requisitos, comandos, credenciais, roteiro de teste e reset
- [ ] Exige Node.js 22.12 ou superior instalado na máquina; não há demonstração online

**Estimativa:** 19/20.

## C) Documentação atualizada — 20%

- [x] Linha “Status no Checkpoint 5” em todos os RF, RNF e RN, sem renumeração
- [x] [Status de implementação](status-implementacao.md) com evidências e verificações
- [x] Escopo, matriz de rastreabilidade, roadmap, backlog e READMEs atualizados
- [x] Limitações declaradas: autenticação simulada, dados fictícios, `localStorage`, ausência de backend
- [ ] Os demais documentos da Parte 1 (pitch, personas, Trello) não foram revisados nesta etapa

**Estimativa:** 18/20.

## D) Diagramas UML atualizados — 15%

- [x] [Diagrama de Atividade](../uml/diagrama-atividade-mvp.drawio) do fluxo real (login, navegação, validação, gravação, indicadores)
- [x] [Diagrama de Sequência](../uml/diagrama-sequencia-mvp.drawio) com participantes que existem no código (`ModalVaga`, `ParkingProvider`, `alterarEstadoVaga`, `salvarDados`, `localStorage`, `ToastProvider`)
- [x] XML não compactado, IDs únicos e geometrias válidas (verificado pelo script)
- [ ] Abertura e conferência visual no diagrams.net e exportação PNG (ação manual da equipe)

**Estimativa:** 12/15.

## E) Qualidade da simulação/demo — 15%

- [x] Roteiro de 16 passos do README executado no navegador integrado
- [x] Dados determinísticos, com A01 livre para a demonstração e reset em um clique
- [x] Feedback visível (aviso de sucesso, erros, confirmação)
- [ ] Não verificado em Firefox, Safari ou Edge

**Estimativa:** 14/15.

## Resultado consolidado

| Critério | Peso | Estimativa |
|---|---:|---:|
| Funcionalidade | 30 | 27 |
| Ambiente de teste | 20 | 19 |
| Documentação | 20 | 18 |
| UML | 15 | 12 |
| Demonstração | 15 | 14 |
| **Total** | **100** | **90** |

## Critérios de aceite

| Critério | Situação |
|---|---|
| Projeto existente preservado | sim (diagramas e documentos da Parte 1 mantidos; documentos atualizados apenas onde necessário) |
| Identidade visual respeitada | sim (paleta, Inter, logo e estados com ícone e texto) |
| Login, erro de login, sessão, logout e rotas protegidas | verificados no navegador |
| Dashboard e indicadores dinâmicos | verificados |
| Estacionamento, setores, vagas e filtros | verificados |
| Alteração de estado, persistência após refresh e histórico | verificados |
| Dashboard, setor, estacionamento e consulta atualizados após alteração | verificados |
| Relatórios, CSV, reset e feedback | verificados |
| Responsividade básica | verificada em 360, 768, 1024 e 1440 px |
| README, requisitos e UML coerentes com o código | revisados |
| `npm install`, `dev`, `build`, lint e testes | aprovados |
| Erros no console, rotas e assets quebrados | nenhum encontrado na execução final |
| Segredos versionados | nenhum; a única credencial é a de demonstração, pública por definição |

## Pontos a confirmar pelo grupo

1. Abrir os dois diagramas novos no diagrams.net, conferir o layout e exportar os PNGs para `assets/images/`.
2. Testar o fluxo em pelo menos mais um navegador (Firefox ou Edge).
3. Revisar o texto e commitar as alterações após a revisão.
