# Problema e oportunidade

## Contexto

Estacionamentos de shopping centers, universidades, hospitais, empresas, condomínios e outros estabelecimentos de grande circulação precisam administrar um recurso limitado — as vagas — em um ambiente sujeito a mudanças frequentes de ocupação. A operação envolve diferentes setores, tipos de vaga e condições temporárias de disponibilidade.

Motoristas e gestores observam o mesmo ambiente por perspectivas distintas. O motorista precisa tomar uma decisão imediata sobre onde procurar uma vaga. O gestor precisa acompanhar o conjunto da operação, identificar padrões e manter informações confiáveis para planejar ações.

## Problema atual

Quando a disponibilidade não é apresentada de forma clara, o motorista depende da observação local e circula pelo estacionamento até encontrar uma vaga adequada. Essa procura pode tornar a experiência menos previsível e gerar circulação interna desnecessária.

Ao mesmo tempo, informações fragmentadas ou atualizadas sem padronização dificultam ao gestor responder perguntas operacionais importantes:

- quantas vagas estão livres, ocupadas, reservadas ou indisponíveis;
- quais setores concentram maior ocupação;
- como as vagas especiais estão sendo utilizadas;
- em quais períodos ocorrem os maiores níveis de ocupação;
- como a ocupação evoluiu ao longo do tempo;
- se os dados exibidos ao público correspondem ao estado operacional registrado.

## Impacto para motoristas

A ausência de uma consulta objetiva pode aumentar a incerteza antes e durante a busca por vaga. Motoristas também podem ser direcionados a setores sem disponibilidade compatível com sua necessidade, especialmente quando procuram um tipo específico de vaga.

O ParkFlow não pressupõe, no MVP, sensores físicos ou navegação interna. Assim, a qualidade da experiência dependerá da atualização operacional dos dados e da comunicação transparente sobre o momento da última atualização.

## Impacto para gestores

Sem uma visão consolidada, o gestor pode ter dificuldade para:

- acompanhar a ocupação em tempo adequado à operação;
- comparar estacionamento e setores com o mesmo critério;
- localizar inconsistências de cadastro ou atualização;
- preservar histórico para análise e prestação de contas;
- gerar relatórios operacionais sem consolidar informações manualmente;
- fundamentar decisões de distribuição, sinalização e manutenção.

## Oportunidade

Há oportunidade de centralizar a estrutura do estacionamento e seus estados operacionais em uma plataforma única. A adoção de definições consistentes para vaga disponível, taxa de ocupação, vagas especiais e histórico torna os dados comparáveis e prepara o produto para evoluções futuras.

Com um histórico confiável, versões posteriores poderão avaliar técnicas de análise de dados para estimar períodos de maior ocupação. Essa possibilidade depende de volume, qualidade e representatividade dos dados; não é uma promessa nem uma obrigação do MVP.

## Solução proposta

O ParkFlow propõe uma aplicação web responsiva com duas experiências principais:

1. **Consulta do motorista:** visualização da disponibilidade agregada por estacionamento, setor e tipo de vaga, sem exigir aplicativo nativo.
2. **Gestão operacional:** cadastro da estrutura, atualização de estados, dashboard, histórico, indicadores, relatórios e trilha de alterações para usuários autorizados.

A solução é deliberadamente independente de sensores no MVP. O estado das vagas será administrado pela operação, mantendo interfaces conceitualmente preparadas para futuras fontes de atualização.

## Benefícios esperados

- oferecer ao motorista uma referência clara de disponibilidade antes de circular entre setores;
- consolidar a visão operacional do gestor;
- padronizar estados, cálculos e tratamento de vagas especiais;
- preservar histórico e autoria das alterações relevantes;
- reduzir o esforço manual de consolidação de indicadores e relatórios;
- criar uma base documental e de dados apta a receber integrações futuras sem reconstruir o domínio.

Os benefícios descrevem resultados pretendidos. Sua intensidade deverá ser medida em etapas futuras por testes e indicadores definidos antes da implantação.
