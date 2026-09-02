# Backlog do produto

Prioridades: `Essencial`, `Importante` e `Desejável`. A inclusão de um item no backlog não garante sua implementação.

## MVP

| ID | User story ou resultado | Prioridade | Referência |
|---|---|---|---|
| PB01 | Como gestor, quero autenticar-me, para acessar funções protegidas. | Essencial | RF01, RF02, RF18 |
| PB02 | Como gestor autorizado, quero manter usuários administrativos, para controlar quem opera o sistema. | Importante | RF03 |
| PB03 | Como gestor, quero cadastrar estacionamentos e setores, para representar a operação. | Essencial | RF04, RF05 |
| PB04 | Como gestor, quero cadastrar tipos e vagas, para classificar a capacidade do estacionamento. | Essencial | RF06, RF07 |
| PB05 | Como gestor, quero atualizar o estado de uma vaga, para manter a disponibilidade coerente. | Essencial | RF08, RF17 |
| PB06 | Como motorista, quero consultar vagas por estacionamento e setor, para decidir onde procurar. | Essencial | RF09 |
| PB07 | Como motorista, quero filtrar tipos de vaga, para localizar disponibilidade compatível com minha necessidade. | Importante | RF10 |
| PB08 | Como gestor, quero ver o dashboard e a taxa de ocupação, para acompanhar a operação atual. | Essencial | RF11, RF12 |
| PB09 | Como gestor, quero acompanhar vagas especiais, para compreender seu uso por setor e tipo. | Importante | RF14 |
| PB10 | Como gestor, quero consultar histórico, para analisar mudanças de ocupação. | Importante | RF13 |
| PB11 | Como gestor, quero gerar e exportar relatório, para compartilhar um recorte operacional. | Importante | RF15, RF16 |
| PB12 | Como gestor, quero consultar alterações administrativas, para rastrear ações relevantes. | Importante | RF17 |

## Melhorias após o núcleo do MVP

| ID | Item | Prioridade | Condição |
|---|---|---|---|
| PB13 | Personalizar períodos e comparações do dashboard. | Desejável | validar filtros com gestores |
| PB14 | Criar alertas configuráveis de ocupação. | Desejável | definir limiares e canais |
| PB15 | Ampliar formatos de exportação e modelos de relatório. | Desejável | validar uso dos relatórios básicos |
| PB16 | Oferecer perfis administrativos mais granulares. | Importante | mapear papéis reais da operação |
| PB17 | Disponibilizar API documentada para integrações autorizadas. | Desejável | estabilizar domínio e segurança |

## Funcionalidades futuras

| ID | Possibilidade | Prioridade atual | Dependências |
|---|---|---|---|
| PF01 | Integração com sensores IoT. | Não priorizada | hardware, conectividade, origem e reconciliação de dados |
| PF02 | Integração com cancelas e leitura de placas. | Não priorizada | fornecedores, segurança e privacidade |
| PF03 | Reserva e pagamento. | Não priorizada | regras comerciais, disponibilidade transacional e meios de pagamento |
| PF04 | Aplicativo mobile nativo. | Não priorizada | evidência de necessidade além da web responsiva |
| PF05 | Navegação interna até uma vaga. | Não priorizada | mapa preciso, localização e infraestrutura local |
| PF06 | Previsão de ocupação. | Não priorizada | histórico suficiente, qualidade de dados, avaliação de modelo e monitoramento |

## Critério de priorização futura

Antes de mover uma possibilidade futura para desenvolvimento, a equipe deverá avaliar valor para usuário, coerência com o problema, complexidade, dependências, riscos de privacidade e instruções acadêmicas vigentes.
