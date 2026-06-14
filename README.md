# Coringa SFA — Sistema de Força de Vendas

Aplicação desktop e mobile para representantes comerciais, com dashboard de KPIs, carteira de clientes, histórico e inclusão de pedidos.

---

## Tech Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + Vite 8 |
| Linguagem | TypeScript 6 (strict) |
| Estilos | Tailwind CSS v4 + Shadcn UI (Radix) |
| Ícones | Lucide React |
| Roteamento | React Router v7 |
| Dados remotos | TanStack Query v5 (React Query) |
| HTTP | Axios |
| Formulários | React Hook Form + Zod v4 |
| Gráficos | Recharts v3 |
| Toasts | Sonner |
| Tema | next-themes |
| Fonte | Geist Variable (@fontsource-variable/geist) |

---

## Pré-requisitos

- Node.js >= 20
- npm >= 10

---

## Instalação

```bash
npm install
```

---

## Comandos

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com HMR |
| `npm run build` | Compila TypeScript e gera bundle de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Executa ESLint em todos os arquivos |

---

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz para sobrescrever a URL da API:

```env
# .env.local
VITE_API_BASE_URL=http://localhost:3000
```

Por padrão a `baseURL` aponta para `http://coringaapi.itstecnologia.com.br` (definida em `src/config/constants.ts`).

---

## Estrutura de Pastas

```
src/
├── components/
│   ├── ui/              # Componentes Shadcn — NÃO editar manualmente
│   ├── layout/          # AppShell, Sidebar, Header, BottomNav
│   └── shared/          # EmptyState, ErrorBoundary, LoadingSpinner
├── config/
│   ├── constants.ts     # API_BASE_URL
│   └── roles.ts         # USER_ROLES (A = Admin, V = Vendedor)
├── context/
│   └── AuthContext.tsx  # AuthProvider + useAuth
├── features/
│   ├── auth/
│   │   ├── components/  # LoginForm
│   │   ├── hooks/       # useLogin, useLogout, useCurrentUser
│   │   ├── pages/       # LoginPage
│   │   └── services/    # authService (login, changePassword)
│   ├── dashboard/
│   │   ├── components/  # MetaCard, KpiChart, GoalProgressBar
│   │   ├── hooks/       # useDashboardData
│   │   ├── pages/       # DashboardPage
│   │   └── services/    # dashboardService (reports/*)
│   ├── clientes/
│   │   ├── components/  # ClienteCard, ClienteSearch
│   │   ├── hooks/       # useClientes, useClienteDetalhe
│   │   ├── pages/       # ClientesPage, ClienteDetalhePage
│   │   └── services/    # clientesService (GET /customers)
│   └── pedidos/
│       ├── components/  # PedidoCard, Carrinho, ProdutosList, ResumoFinanceiro
│       ├── hooks/       # usePedidos, useCart, useOrderCalculations
│       ├── pages/       # PedidosPage, PedidoDetalhePage, NovoPedidoPage
│       └── services/    # pedidosService (orders/*, products/search)
├── hooks/
│   ├── useDebounce.ts
│   └── useMediaQuery.ts
├── lib/
│   ├── api.ts           # Instância Axios + interceptors de auth e 401
│   ├── queryClient.ts   # QueryClient (staleTime 5min, retry 1)
│   └── utils.ts         # cn() helper
├── routes/
│   ├── index.tsx        # createBrowserRouter — definição de todas as rotas
│   ├── ProtectedRoute.tsx
│   └── RoleGuard.tsx
├── types/
│   └── index.ts         # Todos os DTOs e enums (OrderStatus, etc.)
└── utils/
    └── format.ts        # formatCurrency, formatCNPJ, formatDate, formatDateTime
```

---

## Rotas

| Path | Acesso | Página |
|---|---|---|
| `/login` | Público | Tela de login |
| `/dashboard` | Autenticado | Dashboard com KPIs e gráficos |
| `/clientes` | Autenticado | Lista de clientes com busca |
| `/clientes/:id` | Autenticado | Detalhe do cliente |
| `/pedidos` | Autenticado | Lista de pedidos |
| `/pedidos/novo` | Autenticado | Inclusão de novo pedido |
| `/pedidos/:id` | Autenticado | Detalhe do pedido |

Rotas não autenticadas redirecionam para `/login`. Rota não encontrada redireciona para `/`.

---

## Autenticação

O token JWT é armazenado no `localStorage` (`token`) junto com o objeto do usuário (`user`). O interceptor do Axios injeta o `Authorization: Bearer <token>` em todas as requisições e redireciona para `/login` em caso de resposta `401`.

---

## Controle de Acesso (RBAC)

| Role | Valor |
|---|---|
| Admin | `A` |
| Vendedor | `V` |

- `ProtectedRoute` — bloqueia rotas para usuários não autenticados
- `RoleGuard` — restringe rotas por perfil, redireciona para `/dashboard` se sem permissão
- Em componentes, use `useCurrentUser()` para condicionar elementos de UI

---

## Adicionando componentes Shadcn

```bash
npx shadcn@latest add <component>
```

Os arquivos gerados vão para `src/components/ui/` — nunca edite-os manualmente. Para customizar, crie um wrapper em `src/components/shared/` ou dentro da feature.

---

## Endpoints da API

Base URL: `http://coringaapi.itstecnologia.com.br`

| Método | Path | Descrição |
|---|---|---|
| `POST` | `/auth/login` | Autenticação |
| `PATCH` | `/auth/change-password` | Troca de senha |
| `GET` | `/customers` | Lista de clientes |
| `GET` | `/orders` | Lista de pedidos |
| `GET` | `/orders/:id` | Detalhe do pedido |
| `GET` | `/orders/customer/:id` | Pedidos de um cliente |
| `POST` | `/orders` | Criar pedido |
| `GET` | `/products/search?text=` | Busca de produtos |
| `GET` | `/reports/sales-by-month` | Vendas por mês |
| `GET` | `/reports/sales-by-customer` | Top clientes |
| `GET` | `/reports/sales-by-product` | Top produtos |
| `GET` | `/reports/orders-by-status` | Pedidos por status |
| `GET` | `/reports/sales-by-seller` | Vendas por vendedor |

---

## Status de Pedido

| Valor | Label |
|---|---|
| `1` | Não Finalizado |
| `2` | Finalizado |
| `3` | Enviado |
| `4` | Recebido |
| `5` | Faturado |
| `6` | Cancelado |

---

## Responsividade

- **Mobile** (`< md`): BottomNav fixa + Header com menu do usuário
- **Desktop** (`≥ md`): Sidebar fixa lateral + Header
- Tabelas viram cards empilhados em mobile
- Breakpoint principal: `768px` (`md:`)

---

## Convenções de Código

- Componentes: `PascalCase` — `ClienteCard.tsx`
- Hooks: `camelCase` prefixado com `use` — `useCart.ts`
- Services: sufixo `Service` — `pedidosService.ts`
- Pages: sufixo `Page` — `NovoPedidoPage.tsx`
- Constantes: `UPPER_SNAKE_CASE`
- Imports absolutos via alias `@/` configurado em `tsconfig.json`
- Sem `console.log` em código commitado
- Sem comentários explicando *o que* o código faz — apenas o *porquê* quando não óbvio
