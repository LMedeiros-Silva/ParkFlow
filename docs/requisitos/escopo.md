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

Na Parte 1, esses itens são requisitos e modelos. Nenhuma funcionalidade está implementada.

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
