# ParkFlow — Especificação de Design da Parte 1

## 1. Finalidade

Esta especificação define a criação da base documental, visual e organizacional da Parte 1 do **ParkFlow — Sistema Inteligente de Gestão de Estacionamentos**, com o slogan **“Encontre. Estacione. Siga.”**. A entrega deve apresentar o produto como um projeto acadêmico de Engenharia de Software coerente e preparado para evolução, sem implementar frontend, backend, banco de dados ou APIs funcionais.

## 2. Decisões aprovadas

- A pasta atual é a raiz do repositório ParkFlow; não haverá uma subpasta adicional `parkflow/`.
- Será usada uma abordagem documental integrada e rastreável.
- A especificação de requisitos conterá 18 requisitos funcionais, 12 requisitos não funcionais e 10 regras de negócio.
- O escopo distinguirá explicitamente MVP, itens fora do escopo e possíveis evoluções.
- Dois diagramas UML serão entregues como XML `.drawio` válido e com elementos individualmente editáveis.
- A identidade incluirá um logo SVG original, briefing, paleta, tipografia e regras de uso.
- A proposta comercial será apresentada como hipótese SaaS B2B, sem preços definitivos.
- O Trello será planejado na documentação, com responsáveis genéricos, sem criar um quadro real.
- A licença será MIT.
- Não serão realizados commits, push ou alterações remotas.

## 3. Arquitetura documental

A documentação será organizada por responsabilidade:

- `docs/requisitos/`: problema, objetivos, público-alvo, personas, requisitos, regras e limites do produto;
- `docs/uml/`: diagramas editáveis, instruções de abertura e matriz de rastreabilidade;
- `docs/marca/`: fundamentos da identidade, briefing do logo e orientações de uso;
- `docs/pitch/`: proposta de valor, hipótese comercial e pitch de um minuto;
- `docs/planejamento/`: quadro Trello proposto, backlog e roadmap das três partes;
- `assets/logo/`: versões vetoriais da marca;
- `assets/images/`: área documentada para imagens futuras, sem conteúdo artificial;
- `frontend/`, `backend/` e `database/`: READMEs que delimitam áreas futuras sem sugerir implementação existente;
- raiz: README principal, `.gitignore` e licença.

Cada documento deverá ter uma finalidade clara, links relativos quando úteis e linguagem em português brasileiro.

## 4. Modelo do produto e limites

O ParkFlow será descrito como uma plataforma de gestão e inteligência operacional para estacionamentos de grande circulação. O comprador principal é uma organização operadora ou proprietária de estacionamentos; os usuários principais são motoristas e gestores.

O MVP documental pressupõe uma futura aplicação web responsiva capaz de:

- autenticar gestores e controlar seus acessos;
- cadastrar e manter estacionamentos, setores, vagas e tipos de vaga;
- registrar e consultar o estado operacional das vagas;
- apresentar ao motorista a disponibilidade agregada por estacionamento e setor;
- oferecer ao gestor dashboard, histórico, indicadores e relatórios operacionais básicos;
- registrar trilha de alterações relevantes.

Pagamento, leitura automática de placas, reconhecimento facial, integração física com cancelas, aplicativo nativo, sensores IoT, navegação interna, reservas pagas e previsão inteligente de ocupação não serão requisitos obrigatórios do MVP. A previsão será descrita apenas como evolução baseada em dados históricos suficientes e validados.

## 5. Requisitos e rastreabilidade

Serão definidos:

- 18 RFs identificados de `RF01` a `RF18`, com nome, descrição formal, ator e prioridade;
- 12 RNFs identificados de `RNF01` a `RNF12`, com categoria e critério de aceitação verificável;
- 10 regras identificadas de `RN01` a `RN10`, focadas em hierarquia, estados, vagas especiais, cálculo de ocupação, consistência e histórico.

A matriz de rastreabilidade relacionará objetivos específicos, RFs, casos de uso, classes de domínio e regras de negócio. Ela deverá evidenciar que:

1. todo caso de uso relevante deriva de pelo menos um RF;
2. toda classe principal sustenta comportamento ou informação exigida;
3. nenhuma funcionalidade do roadmap aparece como obrigação do MVP;
4. os indicadores usam as mesmas definições presentes nas regras de negócio.

## 6. Modelagem UML

### 6.1 Casos de uso

O diagrama terá os atores `Motorista` e `Administrador/Gestor`, uma fronteira chamada `ParkFlow` e casos de uso derivados dos RFs. Associações serão usadas para indicar participação dos atores. Relações `<<include>>` só serão usadas quando um comportamento obrigatório e reutilizável justificar a relação; `<<extend>>` será evitado se não houver extensão opcional semanticamente correta.

### 6.2 Classes

O modelo de domínio contemplará entidades como `Usuario`, `Administrador`, `Estacionamento`, `Setor`, `Vaga`, `TipoVaga`, `HistoricoOcupacao` e `RelatorioOperacional`. `Administrador` poderá especializar `Usuario`; estacionamento–setor e setor–vaga usarão composição; histórico se associará à vaga sem ser tratado como simples espelho de tabela. `PrevisaoOcupacao` não será classe obrigatória do MVP e poderá aparecer apenas como nota de evolução, para não introduzir um domínio ainda não implementado.

Os arquivos usarão o formato `mxfile`/`mxGraphModel` do diagrams.net. Formas, textos, conectores e cardinalidades serão células separadas e editáveis.

## 7. Identidade visual

O conceito visual combinará o `P` de ParkFlow com referência abstrata a estacionamento, localização e fluxo. A solução deverá parecer tecnológica, confiável e adequada ao mercado B2B, evitando estética infantil.

A paleta priorizará azul profundo como base, ciano como destaque operacional e neutros para superfícies e texto. Verde, âmbar, vermelho e cinza serão usados apenas como cores semânticas de estado. Ícones e rótulos textuais acompanharão as cores para não depender exclusivamente da percepção cromática.

O logo será criado como SVG original, com formas vetoriais simples, texto convertido em elementos editáveis e versões principal e reduzida quando necessário. A documentação indicará área de proteção, contraste, redução e usos incorretos.

## 8. Pitch e hipótese comercial

O posicionamento central será: **plataforma inteligente de gestão e inteligência operacional para estacionamentos**. O discurso conectará redução de procura desnecessária, visibilidade operacional, gestão centralizada e capacidade de evolução baseada em histórico.

A hipótese SaaS B2B terá três faixas conceituais — Starter, Business e Enterprise — diferenciadas por quantidade de vagas, quantidade de estacionamentos e recursos contratados. Não serão definidos preços, promessas financeiras ou métricas de impacto sem evidência.

O roteiro completo do vídeo acadêmico de dois minutos será preparado como material externo e entregue somente na resposta final da implementação. Seu conteúdo não poderá ser salvo, versionado, citado por link ou reproduzido em qualquer arquivo do repositório, inclusive README, planejamento e documentação de pitch. A auditoria poderá registrar apenas que o roteiro é uma entrega externa dependente de repasse à equipe, sem incorporar o conteúdo.

## 9. Planejamento acadêmico

O quadro Trello proposto terá as listas `BACKLOG`, `TO DO`, `DOING`, `REVIEW` e `DONE`. Os cards da Parte 1 conterão descrição, prioridade, responsável no formato `[Membro N]`, checklist e critério de conclusão. A documentação deixará claro que a distribuição real depende da composição da equipe.

O backlog separará MVP, melhorias e funcionalidades futuras. O roadmap usará três partes: concepção e documentação; preparação e desenvolvimento inicial; evolução, integração, validação e apresentação. Itens das Partes 2 e 3 serão explicitamente marcados como sugestões sujeitas às orientações futuras da disciplina.

## 10. Validação e critérios de qualidade

A validação automatizada deverá verificar, no mínimo:

- existência dos arquivos obrigatórios;
- XML bem formado nos dois `.drawio`;
- raiz `mxfile`, conteúdo `mxGraphModel`, IDs únicos e geometrias válidas;
- presença de células separadas para formas e conectores;
- contagem de 18 RFs, 12 RNFs e 10 regras;
- links locais do README e documentos principais;
- presença do logo SVG e sua estrutura vetorial;
- ausência de marcadores de pendência não intencionais nos artefatos finais.
- ausência do arquivo `roteiro-video-2-minutos.md` e de qualquer roteiro audiovisual salvo no repositório.

A inspeção visual dos diagramas será feita por análise das coordenadas e, se houver ferramenta compatível disponível, por renderização. Caso a abertura gráfica no diagrams.net não seja possível no ambiente, essa limitação será registrada sem afirmar validação visual completa.

`docs/AUDITORIA-ENTREGA.md` refletirá somente itens efetivamente existentes e validados. O documento registrará o roteiro de vídeo como material externo à espera de cópia e uso pela equipe, sem reproduzi-lo. Dependências humanas — nomes da equipe, responsáveis reais, criação do quadro Trello, refinamento final da marca e orientações das próximas partes — permanecerão explicitamente abertas.

## 11. Critérios de aceite

A Parte 1 será considerada pronta quando:

1. todos os documentos e artefatos aprovados existirem na raiz e estrutura definidas;
2. requisitos, escopo, UML e rastreabilidade forem internamente coerentes;
3. os diagramas passarem nas validações estruturais e de XML;
4. o README permitir compreensão rápida e navegação para os detalhes;
5. identidade, pitch, planejamento do vídeo, Trello e GitHub atenderem à rubrica, considerando que o roteiro será entregue externamente;
6. a auditoria final registrar evidências, limitações e ações humanas restantes;
7. nenhum software funcional, commit, push ou integração externa tiver sido criado;
8. nenhum conteúdo do roteiro de dois minutos tiver sido salvo no repositório.
