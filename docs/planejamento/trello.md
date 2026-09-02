# Planejamento do quadro Trello

**Quadro da equipe:** [ParkFlow no Trello](https://trello.com/invite/b/6a9779afc06e67580b01f7d2/ATTI7d90a07a7bab493777a42f626d428ddd713726CD/parkflow)

Este documento especifica como a equipe deverá organizar a Parte 1 no quadro real do Trello já criado. Os responsáveis permanecem como placeholders até a composição da equipe ser informada.

## Estrutura das listas

1. **BACKLOG:** demandas identificadas, ainda não priorizadas para execução imediata.
2. **TO DO:** cards priorizados e prontos para começar.
3. **DOING:** trabalho em andamento, limitado pela capacidade da equipe.
4. **REVIEW:** artefatos concluídos aguardando revisão por outra pessoa.
5. **DONE:** itens revisados que atendem ao critério de conclusão.

## Etiquetas sugeridas

- `Essencial` — vermelho;
- `Importante` — âmbar;
- `Desejável` — azul;
- `Documentação` — roxo;
- `UML` — ciano;
- `Marca` — verde;
- `Apresentação` — rosa;
- `Revisão` — cinza.

## Política de movimentação

- um card somente entra em `DOING` com responsável definido;
- quem produz um artefato não deve ser a única pessoa a revisá-lo;
- um card entra em `REVIEW` com checklist completo e link para a evidência;
- um card entra em `DONE` apenas quando o critério de conclusão for confirmado;
- bloqueios devem ser registrados em comentário, sem marcar o card como concluído.

## Cards da Parte 1

### Card 01 — Definir problema

- **Lista inicial sugerida:** DONE
- **Descrição:** consolidar contexto, impactos, oportunidade, solução e benefícios esperados sem estatísticas inventadas.
- **Responsável:** `[Membro 1]`
- **Prioridade:** Essencial
- **Checklist:** contexto; impacto no motorista; impacto no gestor; oportunidade; solução; revisão de linguagem.
- **Critério de conclusão:** `docs/requisitos/problema.md` revisado e coerente com o escopo.

### Card 02 — Definir objetivos e público-alvo

- **Lista inicial sugerida:** DONE
- **Descrição:** registrar objetivo geral, objetivos específicos mensuráveis e diferença entre comprador e usuário.
- **Responsável:** `[Membro 1]`
- **Prioridade:** Essencial
- **Checklist:** objetivo geral; objetivos específicos; compradores; motoristas; gestores.
- **Critério de conclusão:** documentos de objetivos e público-alvo possuem referências coerentes aos requisitos.

### Card 03 — Criar personas

- **Lista inicial sugerida:** DONE
- **Descrição:** criar uma persona de motorista e uma de gestor com contexto, necessidades, dores e benefícios.
- **Responsável:** `[Membro 2]`
- **Prioridade:** Importante
- **Checklist:** motorista; gestor; hipóteses a validar; ausência de nomes da equipe.
- **Critério de conclusão:** duas personas completas e compatíveis com os públicos definidos.

### Card 04 — Especificar requisitos funcionais

- **Lista inicial sugerida:** DONE
- **Descrição:** definir RF01 a RF18 com ator, prioridade e descrição formal.
- **Responsável:** `[Membro 1]`
- **Prioridade:** Essencial
- **Checklist:** 18 IDs únicos; linguagem “O sistema deverá”; atores; prioridades; escopo.
- **Critério de conclusão:** contagem automatizada igual a 18 e nenhum RF fora do MVP.

### Card 05 — Especificar requisitos não funcionais

- **Lista inicial sugerida:** DONE
- **Descrição:** definir 12 qualidades com critérios de aceitação verificáveis.
- **Responsável:** `[Membro 2]`
- **Prioridade:** Essencial
- **Checklist:** segurança; desempenho; disponibilidade; experiência; evolução; operação.
- **Critério de conclusão:** contagem igual a 12 e ausência de requisito vago.

### Card 06 — Definir regras de negócio e escopo

- **Lista inicial sugerida:** DONE
- **Descrição:** registrar 10 regras do domínio e separar MVP, exclusões e evoluções.
- **Responsável:** `[Membro 2]`
- **Prioridade:** Essencial
- **Checklist:** hierarquia; estados; especiais; disponibilidade; ocupação; histórico; limites.
- **Critério de conclusão:** regras e escopo não se contradizem e a contagem é 10.

### Card 07 — Criar Diagrama de Casos de Uso

- **Lista inicial sugerida:** REVIEW
- **Descrição:** modelar atores, fronteira ParkFlow, casos e relações semanticamente necessárias.
- **Responsável:** `[Membro 3]`
- **Prioridade:** Essencial
- **Checklist:** Motorista; Administrador/Gestor; fronteira; vínculos com RFs; XML; legibilidade no draw.io.
- **Critério de conclusão:** arquivo abre no diagrams.net, permanece editável e é aprovado por uma segunda pessoa.

### Card 08 — Criar Diagrama de Classes

- **Lista inicial sugerida:** REVIEW
- **Descrição:** modelar classes, atributos, operações, associações, herança, composições e cardinalidades do MVP.
- **Responsável:** `[Membro 3]`
- **Prioridade:** Essencial
- **Checklist:** classes justificadas; cardinalidades; RN10 preservada; XML; legibilidade no draw.io.
- **Critério de conclusão:** modelo abre e é coerente com requisitos e regras.

### Card 09 — Criar matriz de rastreabilidade

- **Lista inicial sugerida:** DONE
- **Descrição:** ligar objetivos, RFs, casos de uso, classes e regras de negócio.
- **Responsável:** `[Membro 1]`
- **Prioridade:** Essencial
- **Checklist:** objetivos; RFs; UCs; classes; regras; restrições.
- **Critério de conclusão:** nenhum caso de uso ou classe principal fica sem justificativa.

### Card 10 — Definir identidade visual

- **Lista inicial sugerida:** REVIEW
- **Descrição:** documentar conceito, paletas, tipografia, estados, acessibilidade e regras de aplicação.
- **Responsável:** `[Membro 4]`
- **Prioridade:** Importante
- **Checklist:** conceito; HEX; tipografia; estados; contraste; usos incorretos.
- **Critério de conclusão:** guia completo e revisado em relação ao público B2B.

### Card 11 — Criar logo vetorial

- **Lista inicial sugerida:** REVIEW
- **Descrição:** criar assinatura e símbolo originais em SVG editável.
- **Responsável:** `[Membro 4]`
- **Prioridade:** Importante
- **Checklist:** SVG válido; versão principal; versão reduzida; acessibilidade; teste visual.
- **Critério de conclusão:** XML válido, sem raster incorporado e aprovado visualmente pela equipe.

### Card 12 — Criar proposta de valor e pitch

- **Lista inicial sugerida:** DONE
- **Descrição:** posicionar o ParkFlow como plataforma operacional e preparar pitch de aproximadamente um minuto.
- **Responsável:** `[Membro 2]`
- **Prioridade:** Importante
- **Checklist:** problema; solução; diferencial; hipótese SaaS; pitch; ensaio.
- **Critério de conclusão:** materiais coerentes com o MVP e sem preço ou impacto inventado.

### Card 13 — Preparar material externo do vídeo

- **Lista inicial sugerida:** TO DO
- **Descrição:** receber o roteiro externo de dois minutos, atribuir falas e ensaiar. O conteúdo não deve ser salvo no repositório.
- **Responsável:** `[Membro 3]`
- **Prioridade:** Essencial
- **Checklist:** copiar material para canal privado da equipe; atribuir participantes; montar apoio visual; cronometrar; ensaiar.
- **Critério de conclusão:** equipe possui a versão externa aprovada e ensaiada, sem arquivo correspondente no GitHub.

### Card 14 — Criar backlog e roadmap

- **Lista inicial sugerida:** DONE
- **Descrição:** separar MVP, melhorias e futuro e organizar as três partes da disciplina sem inventar instruções.
- **Responsável:** `[Membro 1]`
- **Prioridade:** Importante
- **Checklist:** MVP; melhorias; futuro; Parte 1; Parte 2; Parte 3; ressalvas.
- **Critério de conclusão:** itens futuros estão marcados como hipóteses ou sugestões.

### Card 15 — Organizar README e GitHub

- **Lista inicial sugerida:** REVIEW
- **Descrição:** tornar a entrega navegável a partir da raiz e confirmar estrutura, licença e links.
- **Responsável:** `[Membro 4]`
- **Prioridade:** Essencial
- **Checklist:** README; estrutura; links; `.gitignore`; licença; status; equipe.
- **Critério de conclusão:** todos os links locais passam no validador e não há código funcional.

### Card 16 — Validar e auditar entrega

- **Lista inicial sugerida:** REVIEW
- **Descrição:** executar validações automatizadas, conferir os diagramas no draw.io e avaliar a rubrica.
- **Responsável:** `[Membro 2]`
- **Prioridade:** Essencial
- **Checklist:** contagens; XML; IDs; links; SVG; roteiro ausente; rubrica; ações humanas.
- **Critério de conclusão:** script aprovado, auditoria atualizada e limitações registradas.

### Card 17 — Revisar entrega final em equipe

- **Lista inicial sugerida:** TO DO
- **Descrição:** realizar revisão cruzada de conteúdo, apresentação e arquivos antes do envio acadêmico.
- **Responsável:** `[Membro 1]`
- **Prioridade:** Essencial
- **Checklist:** abrir `.drawio`; revisar logo; ensaiar pitch; confirmar equipe; revisar ortografia; conferir GitHub.
- **Critério de conclusão:** pelo menos duas pessoas aprovam a entrega e registram a decisão no Trello real.

## Ações humanas necessárias

- manter o quadro real do Trello alinhado a esta estrutura;
- substituir placeholders por integrantes reais;
- confirmar a distribuição considerando disponibilidade e afinidade;
- anexar links do GitHub aos cards;
- registrar comentários e movimentações durante o trabalho;
- manter o material externo do vídeo fora do repositório.
