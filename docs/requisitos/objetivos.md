# Objetivos

## Objetivo geral

Projetar uma plataforma de gestão de estacionamentos que centralize informações de disponibilidade e ocupação, apoie a consulta dos motoristas e amplie a capacidade de acompanhamento operacional dos gestores, mantendo uma base coerente para evolução futura.

## Objetivos específicos

### OE01 — Estruturar o ambiente operacional

Permitir que gestores autorizados representem estacionamentos, setores, tipos de vaga e vagas por meio de cadastros relacionados e validados.

**Evidência futura:** criação, consulta, atualização e desativação lógica dos elementos previstos nos requisitos `RF04` a `RF07`.

### OE02 — Padronizar o estado das vagas

Assegurar que cada vaga possua um único estado operacional válido e que toda alteração produza histórico rastreável.

**Evidência futura:** transições conforme `RN03`, `RN04` e `RN08`, atendidas por `RF08` e `RF17`.

### OE03 — Informar disponibilidade ao motorista

Disponibilizar consulta por estacionamento e setor, com filtro por tipo de vaga e indicação do momento de atualização.

**Evidência futura:** conclusão dos fluxos `RF09` e `RF10` e atendimento aos critérios de desempenho e acessibilidade.

### OE04 — Acompanhar a ocupação atual

Apresentar ao gestor quantidades e taxas calculadas por critérios únicos para estacionamento, setor e tipo de vaga.

**Evidência futura:** dashboard e indicadores de `RF11`, `RF12` e `RF14`, calculados conforme `RN06` e `RN07`.

### OE05 — Preservar e consultar histórico

Registrar alterações de estado com data, origem e responsável, permitindo consultas por período e recorte operacional.

**Evidência futura:** histórico de `RF13` e trilha de `RF17`, conforme `RN08` e `RN10`.

### OE06 — Apoiar análise e comunicação gerencial

Gerar relatórios operacionais filtráveis e exportáveis com as mesmas definições usadas no dashboard.

**Evidência futura:** geração e exportação descritas em `RF15` e `RF16`, sem divergência em relação a `RN07` e `RN09`.

### OE07 — Proteger o acesso e a evolução do produto

Restringir funções administrativas por autorização e documentar requisitos verificáveis de segurança, qualidade, privacidade e manutenção.

**Evidência futura:** `RF01`, `RF02`, `RF03` e `RF18`, somados aos 12 requisitos não funcionais.

## Relação com a Parte 1

Nesta etapa, os objetivos orientam a documentação e a modelagem. As evidências descritas são critérios para a futura versão funcional e não representam funcionalidades já implementadas.
