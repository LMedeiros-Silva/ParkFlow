# Requisitos funcionais

Os requisitos abaixo descrevem o comportamento esperado da futura versão funcional do MVP. `Essencial` indica capacidade necessária ao funcionamento básico; `Importante` indica valor relevante que pode ser entregue após o núcleo; `Desejável` indica melhoria compatível com o MVP, sujeita à priorização.

> **Checkpoint 5:** cada item recebeu a linha “Status no Checkpoint 5”, que descreve o que o protótipo funcional em `frontend/` realmente atende (implementado, parcial, simulado, não implementado ou não aplicável). Os identificadores não foram renumerados. O resumo consolidado está em [`docs/checkpoint-5/status-implementacao.md`](../checkpoint-5/status-implementacao.md).

### RF01 — Autenticar administrador

- **Descrição:** O sistema deverá autenticar o Administrador/Gestor por credenciais válidas antes de permitir acesso às funções administrativas.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial
- **Status no Checkpoint 5:** Simulado — login com credenciais de demonstração verificadas no navegador (`services/auth.ts`); sem servidor, hash de senha ou token. As rotas administrativas exigem a sessão salva em `parkflow:sessao`.

### RF02 — Encerrar sessão administrativa

- **Descrição:** O sistema deverá permitir que o Administrador/Gestor encerre sua sessão e invalide o acesso autenticado corrente.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial
- **Status no Checkpoint 5:** Simulado — a opção “Sair” do menu do usuário remove a sessão do navegador e redireciona ao login.

### RF03 — Gerenciar usuários administradores

- **Descrição:** O sistema deverá permitir que administradores com permissão adequada cadastrem, consultem, atualizem e desativem logicamente outros usuários administrativos.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Importante
- **Status no Checkpoint 5:** Não implementado — evolução futura. Existe apenas um administrador de demonstração.

### RF04 — Gerenciar estacionamentos

- **Descrição:** O sistema deverá permitir cadastrar, consultar, atualizar e desativar logicamente estacionamentos dentro do escopo autorizado ao Administrador/Gestor.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial
- **Status no Checkpoint 5:** Parcial — somente consulta do estacionamento de demonstração; cadastro, edição e desativação lógica não implementados.

### RF05 — Gerenciar setores

- **Descrição:** O sistema deverá permitir cadastrar, consultar, atualizar e desativar logicamente setores associados a um estacionamento.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial
- **Status no Checkpoint 5:** Parcial — somente consulta dos três setores de demonstração; cadastro, edição e desativação lógica não implementados.

### RF06 — Gerenciar tipos de vaga

- **Descrição:** O sistema deverá permitir cadastrar, consultar, atualizar e desativar logicamente tipos de vaga, incluindo a indicação de finalidade especial quando aplicável.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial
- **Status no Checkpoint 5:** Parcial — tipos fixos (Comum, PCD, Idoso, Elétrica, Moto) exibidos e usados em filtros; cadastro e edição não implementados.

### RF07 — Gerenciar vagas

- **Descrição:** O sistema deverá permitir cadastrar, consultar, atualizar e desativar logicamente vagas, vinculando cada uma a um setor e a um tipo de vaga.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial
- **Status no Checkpoint 5:** Parcial — consulta das 60 vagas em mapa, lista e detalhe; cadastro, edição e desativação lógica não implementados.

### RF08 — Atualizar estado de vaga

- **Descrição:** O sistema deverá permitir alterar o estado operacional de uma vaga entre os estados admitidos pelas regras de negócio, registrando a alteração no histórico.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial
- **Status no Checkpoint 5:** Implementado — alteração pelo modal da vaga, com registro no histórico, persistência no `localStorage` e rejeição de estado igual ou vaga desativada.

### RF09 — Consultar disponibilidade

- **Descrição:** O sistema deverá permitir que o Motorista consulte, sem autenticação, as quantidades de vagas disponíveis por estacionamento e setor, com indicação da última atualização.
- **Ator relacionado:** Motorista
- **Prioridade:** Essencial
- **Status no Checkpoint 5:** Implementado — rota pública `/consulta`, sem login, com quantidades livres por estacionamento e setor e indicação da última atualização.

### RF10 — Filtrar disponibilidade por tipo de vaga

- **Descrição:** O sistema deverá permitir que o Motorista filtre a consulta de disponibilidade por setor e por tipo de vaga.
- **Ator relacionado:** Motorista
- **Prioridade:** Importante
- **Status no Checkpoint 5:** Implementado — filtros por setor e por tipo de vaga na consulta pública.

### RF11 — Visualizar dashboard operacional

- **Descrição:** O sistema deverá apresentar ao Administrador/Gestor um dashboard com totais de vagas por estado e visão agregada por estacionamento e setor.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial
- **Status no Checkpoint 5:** Implementado — dashboard com totais por estado, gráfico por setor, cartões por setor e atividade recente.

### RF12 — Consultar indicadores de ocupação

- **Descrição:** O sistema deverá apresentar quantidade de vagas operacionais e taxa de ocupação por estacionamento, setor e período selecionado, conforme a fórmula definida nas regras de negócio.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial
- **Status no Checkpoint 5:** Parcial — quantidade de vagas operacionais e taxa por estacionamento e setor no estado corrente; não há taxa histórica por período (o período filtra apenas movimentações).

### RF13 — Consultar histórico de ocupação

- **Descrição:** O sistema deverá permitir consultar registros históricos de alteração de estado por período, estacionamento, setor, vaga, tipo e estado.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Importante
- **Status no Checkpoint 5:** Implementado — histórico somente leitura com filtros de busca (vaga ou responsável), setor, tipo, novo estado e período.

### RF14 — Acompanhar vagas especiais

- **Descrição:** O sistema deverá apresentar ao Administrador/Gestor as quantidades e a ocupação das vagas classificadas como especiais, separadas por tipo e setor.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Importante
- **Status no Checkpoint 5:** Implementado — tabela de vagas especiais (PCD e Idoso) por tipo e setor no dashboard e recorte de especiais no relatório.

### RF15 — Gerar relatório operacional

- **Descrição:** O sistema deverá gerar relatório de ocupação para um período informado, com filtros por estacionamento e setor e com os mesmos critérios de cálculo do dashboard.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Importante
- **Status no Checkpoint 5:** Implementado — relatório com filtros de período, estacionamento, setor e tipo; totais e taxa são uma fotografia do momento da geração.

### RF16 — Exportar relatório operacional

- **Descrição:** O sistema deverá permitir exportar o relatório operacional gerado em formato tabular interoperável, preservando filtros, período e momento de geração.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Desejável
- **Status no Checkpoint 5:** Implementado — exportação CSV (separador `;`, BOM UTF-8) com filtros, período e momento de geração.

### RF17 — Consultar trilha de alterações

- **Descrição:** O sistema deverá registrar e permitir a consulta das alterações administrativas relevantes, incluindo data e hora, usuário, ação e entidade afetada.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Importante
- **Status no Checkpoint 5:** Não implementado — evolução futura. O histórico de estados registra o responsável, mas não há trilha das demais ações administrativas.

### RF18 — Restringir acesso por escopo autorizado

- **Descrição:** O sistema deverá impedir que um usuário administrativo consulte ou altere estacionamentos e recursos fora de seu escopo de autorização.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial
- **Status no Checkpoint 5:** Não implementado — evolução futura. O administrador de demonstração acessa todo o conteúdo.

## Observação de escopo

Nenhum requisito funcional desta lista exige pagamento, reserva, sensores IoT, leitura de placas, reconhecimento facial, cancelas, aplicativo nativo, navegação interna ou previsão de ocupação.
