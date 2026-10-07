# Frontend do ParkFlow

Protótipo funcional do Checkpoint 5, construído com React 19, TypeScript, Vite e React Router. Não há backend: os dados de demonstração ficam no `localStorage` do navegador.

## Execução

Requer Node.js 22.12 ou superior. Os comandos podem ser executados na raiz do repositório (via *npm workspaces*) ou dentro desta pasta:

```bash
npm install
npm run dev
```

| Script | Descrição |
|---|---|
| `dev` | servidor de desenvolvimento do Vite |
| `build` | `tsc -b` e build de produção em `dist/` |
| `preview` | serve o build |
| `test` | Vitest em ambiente Node (sem navegador simulado) |
| `lint` | ESLint |

Credencial de demonstração: `admin@parkflow.com` / `123456`. A autenticação é simulada e não protege dados reais.

## Rotas

| Rota | Acesso | Conteúdo |
|---|---|---|
| `/` | — | redireciona para `/dashboard` ou `/login` |
| `/login` | pública | login simulado; após entrar, volta à rota pedida |
| `/consulta` | pública | vagas livres por estacionamento, setor e tipo (RF09, RF10); com sessão, aparece dentro do painel |
| `/dashboard` | protegida | indicadores, gráfico por setor, setores, vagas especiais e atividade recente |
| `/estacionamentos` | protegida | lista de estacionamentos |
| `/estacionamentos/:estacionamentoId` | protegida | setores do estacionamento |
| `/estacionamentos/:estacionamentoId/setores/:setorId` | protegida | mapa ou lista de vagas, filtros e diálogo de detalhe e alteração |
| `/historico` | protegida | histórico somente leitura com filtros |
| `/relatorios` | protegida | relatório operacional e exportação CSV |
| `*` | pública | página 404 |

## Organização

```text
src/
├── domain/       # regras puras, sem React nem navegador
│   ├── tipos.ts         # tipos, estados (RN03) e rótulos
│   ├── indicadores.ts   # disponibilidade, operacionais e taxa (RN06, RN07)
│   ├── vagas.ts         # alterarEstadoVaga (RF08, RN04, RN08)
│   ├── filtros.ts       # filtros de vagas, histórico e período
│   ├── relatorio.ts     # relatório operacional (RF15)
│   ├── csv.ts           # exportação CSV (RF16)
│   └── datas.ts         # formatação e limites de data sem bibliotecas
├── data/seed.ts  # 60 vagas determinísticas e histórico inicial
├── services/
│   ├── storage.ts  # único acesso ao localStorage (recebe Storage por parâmetro)
│   ├── ambiente.ts # instância de Storage do navegador (ou memória)
│   └── auth.ts     # autenticação simulada
├── contexts/     # AuthContext, ParkingContext, ToastContext e seus hooks
├── layouts/      # AdminLayout, PublicLayout, LayoutConsulta, MenuUsuario
├── components/   # Estado, GraficoOcupacao, Dialogo, ModalVaga, CartaoSetor...
├── pages/        # uma página por rota
└── styles/       # tokens.css, base.css, layout.css, componentes.css
tests/            # testes Vitest do domínio, do seed e do armazenamento
```

## Decisões

- **Fonte única de cálculo:** dashboard, consulta, setores e relatório chamam `calcularIndicadores`. Os indicadores são derivados com `useMemo` e nunca persistidos (RN09).
- **Armazenamento:** `parkflow:sessao` guarda a sessão e `parkflow:dados:v1` guarda `{ versao, vagas, historico }` em um único `setItem`, simulando a atomicidade do RNF09. JSON corrompido ou versão diferente recarrega o seed e mostra um aviso. Se o `localStorage` estiver bloqueado, os dados ficam em memória enquanto a página estiver aberta.
- **Sincronização entre abas:** os contextos ouvem o evento `storage` e recarregam sessão e dados.
- **Alteração de estado:** o botão fica desabilitado quando o estado escolhido é igual ao atual; o domínio também rejeita estado igual e vaga desativada. Cada alteração gera um registro com estado anterior, novo, data e hora, origem (`PAINEL_ADMINISTRATIVO`) e responsável.
- **Acessibilidade:** link para pular ao conteúdo, foco visível, rótulos em todos os campos, `aria-current` no menu, diálogo nativo `<dialog>`, avisos com `role="status"`/`role="alert"`, gráfico acompanhado de tabela e estados sempre com cor, ícone e texto.
- **Marca:** cores, tipografia Inter, base de 8 px, raios de 8 e 12 px e logo importado de `assets/logo/`. O favicon em `public/favicon.svg` é uma cópia do símbolo da marca.
- **Dependências mínimas:** sem biblioteca de gráficos, datas, componentes visuais ou CSS utilitário.

## Limitações

Sem backend, banco de dados, cadastro de estrutura, gestão de usuários, trilha administrativa, restrição por escopo, taxa histórica por período ou PDF. Veja [`docs/checkpoint-5/status-implementacao.md`](../docs/checkpoint-5/status-implementacao.md).
