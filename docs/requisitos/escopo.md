# Escopo

## Escopo do MVP

O MVP corresponde à primeira versão funcional futura descrita nesta Parte 1. Ele deverá incluir:

- aplicação web responsiva;
- autenticação, encerramento de sessão e autorização para gestores;
- gestão de usuários administrativos autorizados;
- cadastro e desativação lógica de estacionamentos, setores, tipos de vaga e vagas;
- atualização manual do estado das vagas;
- consulta pública de disponibilidade por estacionamento, setor e tipo;
- indicação do momento da última atualização;
- dashboard com estados e ocupação atual;
- acompanhamento específico de vagas especiais;
- histórico de alterações de estado;
- indicadores e relatórios operacionais básicos;
- exportação tabular de relatório, sujeita à priorização;
- trilha de alterações administrativas relevantes.

Na Parte 1, esses itens eram apenas requisitos e modelos. O recorte implementado no Checkpoint 5 está descrito na seção seguinte.

## Checkpoint 5 — protótipo funcional

O Checkpoint 5 entrega um protótipo web executável em `frontend/` (React, TypeScript e Vite), sem backend, API ou banco de dados. Os dados são de demonstração e ficam no `localStorage` do navegador.

### Incluído

- login e logout **simulados** com uma credencial de demonstração e rotas administrativas protegidas;
- consulta pública de disponibilidade por estacionamento, setor e tipo, com última atualização;
- navegação por estacionamento, setores e vagas, com mapa, lista, filtros e detalhe da vaga;
- atualização manual do estado da vaga, com registro imutável no histórico;
- dashboard com indicadores, gráfico por setor, cartões por setor, vagas especiais e atividade recente;
- histórico com filtros por busca, setor, tipo, estado e período;
- relatório operacional com filtros e exportação CSV;
- restauração dos dados de demonstração.

### Simulado

- autenticação (sem servidor, hash de senha ou token);
- atomicidade da gravação (um único `setItem` com vagas e histórico);
- estados das vagas (dados fictícios atualizados manualmente; não há sensores).

### Não incluído nesta versão

- cadastro, edição e desativação de estacionamentos, setores, tipos e vagas;
- gestão de usuários administrativos (`RF03`), trilha de alterações administrativas (`RF17`) e restrição por escopo (`RF18`);
- taxa de ocupação histórica por período;
- exportação em PDF, backend, banco de dados, implantação e testes de carga, navegadores ou usabilidade.

`RESERVADA` continua sendo apenas um estado operacional definido manualmente pelo gestor; não existe fluxo de reserva, o que mantém a exclusão de “reservas pagas ou garantia de vaga”. O status de cada requisito está em [`docs/checkpoint-5/status-implementacao.md`](../checkpoint-5/status-implementacao.md).

## Fora do escopo do MVP

- pagamento pelo aplicativo ou integração com meios de pagamento;
- leitura automática de placas;
- reconhecimento facial ou biométrico;
- integração física com cancelas;
- aplicativo mobile nativo;
- sensores IoT físicos;
- navegação GPS interna ou orientação vaga a vaga;
- reservas pagas ou garantia de vaga;
- validação automática de credenciais para uso de vagas especiais;
- precificação dinâmica;
- previsão automática de ocupação;
- recomendação automatizada de setor por inteligência artificial.

Essas exclusões reduzem dependências físicas, financeiras e regulatórias e mantêm o MVP compatível com o problema central.

## Evoluções futuras

As possibilidades abaixo compõem um roadmap de produto, não uma promessa de implementação:

1. **Integrações operacionais:** sensores, cancelas e leitura de placas, após avaliação técnica e de privacidade.
2. **Serviços ao motorista:** reserva, pagamento e navegação interna, após validar demanda e regras comerciais.
3. **Aplicativos nativos:** caso testes demonstrem necessidade além da experiência web responsiva.
4. **Análise preditiva:** estimativa de períodos de maior ocupação somente após acumular dados históricos suficientes, confiáveis e representativos.
5. **Integrações corporativas:** identidade, ferramentas analíticas e sistemas administrativos conforme necessidade de clientes.

## Critérios para mudança de escopo

Uma evolução somente deverá migrar para o MVP de uma etapa posterior quando:

- houver necessidade validada de usuário ou requisito acadêmico explícito;
- impactos de segurança, privacidade, custo e operação forem avaliados;
- requisitos, regras, UML, backlog e critérios de teste forem atualizados em conjunto;
- a mudança não comprometer a entrega do núcleo já priorizado.
