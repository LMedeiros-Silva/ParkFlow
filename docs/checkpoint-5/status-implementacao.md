# Status de implementação — Checkpoint 5

**Data da verificação:** 7 de outubro de 2026<br>
**Escopo:** MVP funcional em `frontend/` (React, TypeScript, Vite), sem backend.

Legenda: **Implementado** (funciona no MVP), **Simulado** (funciona apenas como demonstração, sem a garantia real), **Parcial** (parte do requisito atendida), **Não implementado / evolução futura**, **Não aplicável** (depende de infraestrutura de produção inexistente nesta etapa).

## Requisitos funcionais

| ID | Requisito | Status | Evidência |
|---|---|---|---|
| RF01 | Autenticar administrador | Simulado | `LoginPage`, `services/auth.ts`, `RotaProtegida` |
| RF02 | Encerrar sessão | Simulado | opção “Sair” em `MenuUsuario` |
| RF03 | Gerenciar administradores | Não implementado / evolução futura | — |
| RF04 | Gerenciar estacionamentos | Parcial (somente consulta) | `EstacionamentosPage` |
| RF05 | Gerenciar setores | Parcial (somente consulta) | `SetoresPage`, `CartaoSetor` |
| RF06 | Gerenciar tipos de vaga | Parcial (tipos fixos usados em filtros) | `data/seed.ts` |
| RF07 | Gerenciar vagas | Parcial (consulta em mapa, lista e detalhe) | `VagasSetorPage`, `ModalVaga` |
| RF08 | Atualizar estado de vaga | Implementado | `ModalVaga`, `domain/vagas.ts` |
| RF09 | Consultar disponibilidade | Implementado | `ConsultaPage` (`/consulta`, sem login) |
| RF10 | Filtrar por setor e tipo | Implementado | `ConsultaPage` |
| RF11 | Dashboard operacional | Implementado | `DashboardPage`, `GraficoOcupacao` |
| RF12 | Indicadores de ocupação | Parcial (estado corrente; sem taxa histórica por período) | `domain/indicadores.ts` |
| RF13 | Histórico de ocupação | Implementado | `HistoricoPage`, `domain/filtros.ts` |
| RF14 | Vagas especiais | Implementado | tabela no `DashboardPage`; recorte no relatório |
| RF15 | Gerar relatório | Implementado | `RelatoriosPage`, `domain/relatorio.ts` |
| RF16 | Exportar relatório | Implementado (CSV; sem PDF) | `domain/csv.ts` |
| RF17 | Trilha de alterações administrativas | Não implementado / evolução futura | — |
| RF18 | Restringir acesso por escopo | Não implementado / evolução futura | — |

## Requisitos não funcionais

| ID | Requisito | Status | Observação |
|---|---|---|---|
| RNF01 | Segurança de comunicação e credenciais | Não aplicável / não atendido | sem servidor; credencial de demonstração pública |
| RNF02 | Desempenho | Não aplicável | sem servidor; sem teste de carga |
| RNF03 | Disponibilidade | Não aplicável | sem implantação |
| RNF04 | Usabilidade | Não avaliado | sem teste com usuários |
| RNF05 | Responsividade | Atendido no MVP | verificação abaixo |
| RNF06 | Compatibilidade | Não verificado | conferido apenas em navegador baseado em Chromium |
| RNF07 | Escalabilidade | Não aplicável | 60 vagas fixas |
| RNF08 | Manutenibilidade | Parcial | 48 testes e ESLint sem erros; cobertura não medida |
| RNF09 | Confiabilidade e consistência | Simulado | vaga e histórico gravados em um único `setItem` |
| RNF10 | Privacidade | Atendido no escopo do MVP | consulta pública não identifica o motorista |
| RNF11 | Acessibilidade | Atendido nos fluxos principais (verificação manual) | sem ferramenta automatizada |
| RNF12 | Recuperação e observabilidade | Não aplicável | sem ambiente produtivo |

## Regras de negócio

| ID | Regra | Status |
|---|---|---|
| RN01 | Hierarquia estacionamento/setor | Atendido |
| RN02 | Identificação da vaga | Atendido (códigos únicos A01–C20) |
| RN03 | Classificação e estados | Atendido (`RESERVADA` apenas manual) |
| RN04 | Transição de estado | Atendido |
| RN05 | Vagas especiais | Atendido |
| RN06 | Disponibilidade | Atendido |
| RN07 | Taxa de ocupação | Atendido |
| RN08 | Histórico imutável | Atendido na interface (restauração da demonstração recria os dados) |
| RN09 | Consistência dos agregados | Atendido |
| RN10 | Desativação e preservação | Parcial (campo `ativa` respeitado; sem fluxo de desativação) |

## Verificações executadas

### Automáticas

| Verificação | Comando | Resultado |
|---|---|---|
| Instalação | `npm install` | concluída; `found 0 vulnerabilities` |
| Análise estática | `npm run lint` | 0 problemas |
| Testes | `npm test` | 6 arquivos, 48 testes aprovados |
| Build | `npm run build` | `tsc -b` sem erros e build Vite concluído |
| Estrutura | `scripts/validar-entrega.ps1` | resultado registrado na [auditoria](auditoria-checkpoint-5.md) |

### Manuais no navegador

Executadas no navegador integrado (Chromium) com `npm run dev` e, para o build, `npm run preview`:

- rota protegida redireciona ao login e, após entrar, retorna à rota pedida;
- login inválido exibe “E-mail ou senha inválidos.”;
- A01 alterada de Livre para Ocupada: aviso de sucesso; setor A passou de 55,6% para 61,1%; dashboard passou de 24 para 23 disponíveis, de 25 para 26 ocupadas e de 54,7% para 56,6%; a consulta pública mostrou 7 livres no setor A; o histórico exibiu o novo registro no topo; o relatório e o CSV refletiram a alteração;
- alterações e sessão permaneceram após recarregar a página;
- botão “Salvar alteração” desabilitado com o estado atual selecionado;
- restaurar dados com confirmação voltou aos números iniciais;
- JSON corrompido no `localStorage` recarregou a demonstração com aviso;
- “Sair” removeu a sessão, e as rotas administrativas voltaram a exigir login;
- diálogo da vaga fecha com Esc e devolve o foco à vaga;
- nenhuma página apresentou rolagem horizontal em 360, 768 e 1440 px (todas as rotas, inclusive a 404); a largura de 1024 px foi usada no fluxo principal; em telas menores que 1024 px o menu lateral recolhe e abre pelo botão de menu;
- logo, favicon e fontes carregaram sem erro.

Limitações da verificação: não foi testado em Firefox, Safari ou Edge, nem com leitor de tela real ou ferramenta automatizada de acessibilidade.
