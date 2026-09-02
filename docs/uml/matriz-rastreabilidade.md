# Matriz de rastreabilidade

Esta matriz liga a motivação do produto aos comportamentos e ao modelo de domínio. Os nomes de casos de uso (`UC`) correspondem aos elementos do diagrama; as classes correspondem ao diagrama de classes.

| Objetivo | Requisitos funcionais | Casos de uso | Classes principais | Regras relacionadas |
|---|---|---|---|---|
| OE01 — Estruturar o ambiente | RF04, RF05, RF06, RF07 | UC04 Gerenciar estacionamentos; UC05 Gerenciar setores; UC06 Gerenciar tipos de vaga; UC07 Gerenciar vagas | Estacionamento, Setor, TipoVaga, Vaga | RN01, RN02, RN03, RN10 |
| OE02 — Padronizar estados | RF08, RF17 | UC08 Atualizar estado de vaga; UC17 Consultar trilha de alterações | Vaga, HistoricoOcupacao, Usuario | RN03, RN04, RN08, RN09 |
| OE03 — Informar disponibilidade | RF09, RF10 | UC09 Consultar disponibilidade; UC10 Filtrar por setor e tipo | Estacionamento, Setor, Vaga, TipoVaga | RN05, RN06, RN09 |
| OE04 — Acompanhar ocupação | RF11, RF12, RF14 | UC11 Visualizar dashboard; UC12 Consultar indicadores; UC14 Acompanhar vagas especiais | Estacionamento, Setor, Vaga, TipoVaga | RN05, RN06, RN07, RN09 |
| OE05 — Preservar histórico | RF13, RF17 | UC13 Consultar histórico; UC17 Consultar trilha de alterações | HistoricoOcupacao, Vaga, Usuario | RN08, RN10 |
| OE06 — Apoiar análise | RF15, RF16 | UC15 Gerar relatório; UC16 Exportar relatório | RelatorioOperacional, Estacionamento, Setor | RN07, RN09 |
| OE07 — Proteger acesso | RF01, RF02, RF03, RF18 | UC01 Autenticar-se; UC02 Encerrar sessão; UC03 Gerenciar administradores; restrição C01 de escopo autorizado | Usuario, Administrador, Estacionamento | RN10 |

## Cobertura dos requisitos não funcionais

| Qualidade | Requisitos | Evidência futura esperada |
|---|---|---|
| Proteção | RNF01, RNF10 | configuração segura, inventário de dados e testes de credenciais |
| Operação | RNF02, RNF03, RNF07, RNF12 | carga, monitoramento, restauração e logs |
| Experiência | RNF04, RNF05, RNF06, RNF11 | testes com usuários, tamanhos de tela, navegadores e teclado |
| Evolução | RNF08, RNF09 | cobertura automatizada, análise estática e testes de atomicidade |

## Verificações de consistência

- `RF01` e `RF18` protegem os casos administrativos; a consulta pública de `RF09` não depende de autenticação.
- `RF08` gera histórico por `RN08`; `RF13` apenas consulta esse histórico.
- `RF11`, `RF12`, `RF14` e `RF15` compartilham `RN06`, `RN07` e `RN09`, evitando cálculos diferentes.
- `RF16` exporta um relatório já gerado; não cria um cálculo paralelo.
- Nenhum caso de uso exige previsão, sensores, pagamento, reservas ou cancelas.
- `PrevisaoOcupacao` não é uma classe do MVP.
