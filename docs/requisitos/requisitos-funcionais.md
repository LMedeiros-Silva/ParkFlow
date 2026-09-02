# Requisitos funcionais

Os requisitos abaixo descrevem o comportamento esperado da futura versão funcional do MVP. `Essencial` indica capacidade necessária ao funcionamento básico; `Importante` indica valor relevante que pode ser entregue após o núcleo; `Desejável` indica melhoria compatível com o MVP, sujeita à priorização.

### RF01 — Autenticar administrador

- **Descrição:** O sistema deverá autenticar o Administrador/Gestor por credenciais válidas antes de permitir acesso às funções administrativas.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial

### RF02 — Encerrar sessão administrativa

- **Descrição:** O sistema deverá permitir que o Administrador/Gestor encerre sua sessão e invalide o acesso autenticado corrente.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial

### RF03 — Gerenciar usuários administradores

- **Descrição:** O sistema deverá permitir que administradores com permissão adequada cadastrem, consultem, atualizem e desativem logicamente outros usuários administrativos.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Importante

### RF04 — Gerenciar estacionamentos

- **Descrição:** O sistema deverá permitir cadastrar, consultar, atualizar e desativar logicamente estacionamentos dentro do escopo autorizado ao Administrador/Gestor.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial

### RF05 — Gerenciar setores

- **Descrição:** O sistema deverá permitir cadastrar, consultar, atualizar e desativar logicamente setores associados a um estacionamento.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial

### RF06 — Gerenciar tipos de vaga

- **Descrição:** O sistema deverá permitir cadastrar, consultar, atualizar e desativar logicamente tipos de vaga, incluindo a indicação de finalidade especial quando aplicável.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial

### RF07 — Gerenciar vagas

- **Descrição:** O sistema deverá permitir cadastrar, consultar, atualizar e desativar logicamente vagas, vinculando cada uma a um setor e a um tipo de vaga.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial

### RF08 — Atualizar estado de vaga

- **Descrição:** O sistema deverá permitir alterar o estado operacional de uma vaga entre os estados admitidos pelas regras de negócio, registrando a alteração no histórico.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial

### RF09 — Consultar disponibilidade

- **Descrição:** O sistema deverá permitir que o Motorista consulte, sem autenticação, as quantidades de vagas disponíveis por estacionamento e setor, com indicação da última atualização.
- **Ator relacionado:** Motorista
- **Prioridade:** Essencial

### RF10 — Filtrar disponibilidade por tipo de vaga

- **Descrição:** O sistema deverá permitir que o Motorista filtre a consulta de disponibilidade por setor e por tipo de vaga.
- **Ator relacionado:** Motorista
- **Prioridade:** Importante

### RF11 — Visualizar dashboard operacional

- **Descrição:** O sistema deverá apresentar ao Administrador/Gestor um dashboard com totais de vagas por estado e visão agregada por estacionamento e setor.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial

### RF12 — Consultar indicadores de ocupação

- **Descrição:** O sistema deverá apresentar quantidade de vagas operacionais e taxa de ocupação por estacionamento, setor e período selecionado, conforme a fórmula definida nas regras de negócio.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial

### RF13 — Consultar histórico de ocupação

- **Descrição:** O sistema deverá permitir consultar registros históricos de alteração de estado por período, estacionamento, setor, vaga, tipo e estado.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Importante

### RF14 — Acompanhar vagas especiais

- **Descrição:** O sistema deverá apresentar ao Administrador/Gestor as quantidades e a ocupação das vagas classificadas como especiais, separadas por tipo e setor.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Importante

### RF15 — Gerar relatório operacional

- **Descrição:** O sistema deverá gerar relatório de ocupação para um período informado, com filtros por estacionamento e setor e com os mesmos critérios de cálculo do dashboard.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Importante

### RF16 — Exportar relatório operacional

- **Descrição:** O sistema deverá permitir exportar o relatório operacional gerado em formato tabular interoperável, preservando filtros, período e momento de geração.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Desejável

### RF17 — Consultar trilha de alterações

- **Descrição:** O sistema deverá registrar e permitir a consulta das alterações administrativas relevantes, incluindo data e hora, usuário, ação e entidade afetada.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Importante

### RF18 — Restringir acesso por escopo autorizado

- **Descrição:** O sistema deverá impedir que um usuário administrativo consulte ou altere estacionamentos e recursos fora de seu escopo de autorização.
- **Ator relacionado:** Administrador/Gestor
- **Prioridade:** Essencial

## Observação de escopo

Nenhum requisito funcional desta lista exige pagamento, reserva, sensores IoT, leitura de placas, reconhecimento facial, cancelas, aplicativo nativo, navegação interna ou previsão de ocupação.
