# Modelagem UML

## Arquivos

- [`diagrama-casos-de-uso.drawio`](diagrama-casos-de-uso.drawio): atores, objetivos de uso e fronteira do ParkFlow.
- [`diagrama-classes.drawio`](diagrama-classes.drawio): modelo de domínio orientado a objetos do MVP.
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

## Como abrir e editar

1. Acesse o diagrams.net/draw.io.
2. Escolha **Arquivo → Abrir de → Dispositivo**.
3. Selecione um dos arquivos `.drawio`.
4. Edite e salve preservando o formato XML.

## Validação realizada

O script [`scripts/validar-entrega.ps1`](../../scripts/validar-entrega.ps1) verifica XML, raiz `mxfile`, `mxGraphModel`, IDs únicos, geometrias e presença de células editáveis. A inspeção de coordenadas foi usada para evitar sobreposição intencional. A conferência visual final no próprio diagrams.net continua recomendada antes da apresentação.
