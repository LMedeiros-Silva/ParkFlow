# Modelagem UML

## Arquivos

- [`diagrama-casos-de-uso.drawio`](diagrama-casos-de-uso.drawio): atores, objetivos de uso e fronteira do ParkFlow.
- [`diagrama-classes.drawio`](diagrama-classes.drawio): modelo de domínio orientado a objetos do MVP.
- [`diagrama-atividade-mvp.drawio`](diagrama-atividade-mvp.drawio): fluxo de atualização do estado de uma vaga no protótipo do Checkpoint 5.
- [`diagrama-sequencia-mvp.drawio`](diagrama-sequencia-mvp.drawio): troca de mensagens entre os módulos reais do frontend ao salvar uma alteração.
- [`matriz-rastreabilidade.md`](matriz-rastreabilidade.md): ligação entre objetivos, requisitos, casos de uso, classes e regras.

Os arquivos `.drawio` usam XML não compactado do diagrams.net. Formas, textos, atores, classes, associações, cardinalidades e conectores permanecem como células editáveis; nenhuma imagem raster contém o diagrama.

## Diagrama de Casos de Uso

### Atores

- **Motorista:** consulta disponibilidade e aplica filtros sem autenticação no MVP.
- **Administrador/Gestor:** realiza os casos administrativos após autenticação e dentro de seu escopo autorizado.

### Decisões

- Os casos `UC01` a `UC17` derivam diretamente de `RF01` a `RF17`.
- `RF18` é representado pela restrição `C01`, pois limitar acesso é uma condição transversal do sistema, não um objetivo independente iniciado pelo ator.
- `UC16 — Exportar relatório` inclui `UC15 — Gerar relatório`: uma exportação somente existe após a geração do conteúdo. Essa é a única relação `<<include>>` necessária.
- Autenticação é tratada como precondição dos casos administrativos, evitando repetir relações `include` que tornariam o diagrama ilegível.
- Não há relação `<<extend>>`, pois nenhum comportamento opcional identificado exige esse vínculo.

## Diagrama de Classes

### Classes do domínio

- `Usuario` abstrai identidade e sessão; `Administrador` é sua especialização.
- `Estacionamento` compõe `Setor`, e `Setor` compõe `Vaga`.
- `TipoVaga` classifica várias vagas; cada vaga possui exatamente um tipo.
- `HistoricoOcupacao` preserva transições de uma vaga por associação. Não foi usada composição porque o histórico deve sobreviver à desativação lógica da vaga.
- `RelatorioOperacional` representa a geração e exportação de uma visão de período e filtros, sem equivaler automaticamente a uma tabela do banco.

### Cardinalidades principais

- `Estacionamento 1 — 1..* Setor` para publicação operacional;
- `Setor 1 — 0..* Vaga` durante configuração;
- `TipoVaga 1 — 0..* Vaga`;
- `Vaga 1 — 0..* HistoricoOcupacao`;
- `Administrador 0..* — 0..* Estacionamento`, representando escopos de autorização.

`PrevisaoOcupacao` não foi criada como classe do MVP. A previsão é uma evolução possível que dependerá do histórico, da qualidade dos dados e de nova análise de requisitos.

## Diagramas do Checkpoint 5

Os dois diagramas abaixo foram criados para o protótipo funcional e descrevem somente o que existe no código de `frontend/src`. Os diagramas de casos de uso e de classes da Parte 1 foram preservados sem alteração.

### Diagrama de Atividade do MVP

- Duas raias: **Administrador/Gestor (navegador)** e **ParkFlow — frontend React (sem backend)**.
- Fluxo: acessar o dashboard → verificar sessão → login simulado → navegar até o setor → selecionar vaga → exibir detalhes da vaga → escolher novo estado → salvar → validar a alteração → atualizar a vaga e gerar registro de histórico → persistir os dados → atualizar o estado da aplicação e recalcular indicadores → mensagem de sucesso → conferir dashboard, histórico e consulta do motorista.
- Decisões modeladas, com os rótulos usados no diagrama:
  - **Sessão ativa?** — existência da sessão simulada salva no navegador;
  - **Credenciais válidas?** — conferência da credencial de demonstração;
  - **Novo estado igual ao atual?** — quando sim, “Salvar alteração” permanece desabilitado;
  - **Alteração de estado válida?** — vaga existente, ativa e com estado diferente do atual, regra implementada em `alterarEstadoVaga` (`domain/vagas.ts`);
  - **Persistência dos dados realizada com sucesso?** — gravação conjunta de vaga e histórico no `localStorage` por `salvarDados` (`services/storage.ts`).
- “Atualizar estado da aplicação e recalcular indicadores” corresponde à atualização do `ParkingProvider` (`contexts/ParkingContext.tsx`), que deriva os indicadores das vagas.
- Os caminhos de erro (“Exibir mensagem de erro; nenhum dado é alterado” e falha de persistência) terminam em nós de fim de fluxo sem alterar dados.
- A nota técnica do diagrama registra que autenticação e persistência são simuladas no navegador, via `localStorage`, sem backend.

### Diagrama de Sequência do MVP

- Participantes reais: `ModalVaga` (`components/ModalVaga.tsx`), `ParkingProvider` (`contexts/ParkingContext.tsx`), `alterarEstadoVaga` (`domain/vagas.ts`), `salvarDados` (`services/storage.ts`), `localStorage` do navegador e `ToastProvider` (`contexts/ToastContext.tsx`), além do ator Administrador/Gestor.
- As mensagens usam formas abreviadas das chamadas reais: `alterarEstadoVaga(dados, vagaId, novoEstado, contexto)`, em que o contexto reúne data e hora, origem, responsável e setores; `salvarDados(storage, dados)`; `setItem('parkflow:dados:v1', JSON)`, que grava `{ versao, vagas, historico }`.
- Fragmento `alt`: **[vaga inexistente, desativada ou estado igual]**, em que o domínio lança `ErroAlteracaoVaga` e a interface exibe o erro sem gravar nada, versus **[alteração válida]**, em que `salvarDados` devolve `true | false` e, com `true`, o `ParkingProvider` atualiza os dados (`setDados`) e recalcula os indicadores.
- Ao final, `ModalVaga` chama `notificar(mensagem de sucesso)`, fecha o diálogo e o aviso é exibido ao administrador.
- A gravação usa um único `setItem` na chave `parkflow:dados:v1`, simulando a atomicidade do `RNF09`; não há servidor, API ou banco de dados.

### Imagens PNG

Os diagramas do Checkpoint 5 não possuem exportação PNG no repositório, pois a exportação exige o diagrams.net. **Ação manual:** abrir cada `.drawio` no diagrams.net, conferir o layout, usar **Arquivo → Exportar como → PNG** e salvar em `assets/images/` com o mesmo nome do arquivo.

## Como abrir e editar

1. Acesse o diagrams.net/draw.io.
2. Escolha **Arquivo → Abrir de → Dispositivo**.
3. Selecione um dos arquivos `.drawio`.
4. Edite e salve preservando o formato XML.

## Validação realizada

O script [`scripts/validar-entrega.ps1`](../../scripts/validar-entrega.ps1) verifica, nos quatro diagramas, XML, raiz `mxfile`, `mxGraphModel`, IDs únicos, geometrias e presença de células editáveis. A inspeção de coordenadas foi usada para evitar sobreposição intencional. A conferência visual final no próprio diagrams.net continua recomendada antes da apresentação.
