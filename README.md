# Finance App — API REST de Gestão Financeira Pessoal

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![Jest](https://img.shields.io/badge/Tests-Jest%20%2B%20Supertest-C21325?logo=jest&logoColor=white)

API REST em produção para controle financeiro pessoal: cadastro, autenticação JWT, transações, saldo consolidado, paginação, filtros e documentação OpenAPI.

| Recurso                | Link                                                                                   |
| ---------------------- | -------------------------------------------------------------------------------------- |
| **Swagger (produção)** | [finance-app-i600.onrender.com/docs](https://finance-app-i600.onrender.com/docs/)      |
| **Swagger (local)**    | [localhost:3000/docs](http://localhost:3000/docs)                                      |
| **Repositório**        | [github.com/vivianeaguiarc/finance-app](https://github.com/vivianeaguiarc/finance-app) |

---

## Visão geral do projeto

O **Finance App** é uma API backend para **gestão financeira pessoal**. Ela permite que cada usuário registre ganhos, despesas e investimentos, consulte saldo por período e gerencie o próprio perfil de forma segura.

### Problema que resolve

Aplicativos e planilhas financeiras precisam de um backend confiável que:

- isole os dados de cada usuário;
- valide entradas e padronize erros;
- exponha listagens eficientes (paginação e filtros);
- documente o contrato para integração com frontend ou mobile.

Este projeto implementa essa base com foco em **segurança**, **clareza de contrato** e **boas práticas de engenharia** — adequado como case técnico de portfólio.

---

## Funcionalidades

| Área                       | O que está disponível                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| **Usuários**               | Cadastro, login, refresh token, perfil (`/me`), atualização e exclusão de conta                |
| **Autenticação**           | JWT (access + refresh), rotas protegidas, Bearer no header                                     |
| **Transações**             | CRUD de lançamentos (`EARNING`, `EXPENSE`, `INVESTMENT`)                                       |
| **Dashboard**              | Métricas agregadas em `GET /api/dashboard` (receitas, despesas, saldo, médias, agrupamentos)   |
| **Saldo**                  | Agregação por período (ganhos, despesas, investimentos, percentuais)                           |
| **Listagem**               | Paginação (`page`, `limit`), filtros por tipo, período e valor, ordenação com allowlist        |
| **Categorias**             | CRUD básico (`POST/GET /api/categories`) + vínculo em transações e orçamentos                  |
| **Recorrências**           | Transações recorrentes (`POST/GET /api/transactions/me/recurring`) — semanal, mensal, anual    |
| **Parcelamentos**          | Despesas parceladas (`POST /api/transactions/me/installments`) — geração atômica de N parcelas |
| **Orçamento mensal**       | Orçamento por categoria/mês/ano (`POST/GET /api/budgets`)                                      |
| **Alertas financeiros**    | Status `safe`, `warning`, `exceeded` em `GET /api/budgets/status`                              |
| **Relatórios exportáveis** | `GET /api/reports/financial` em JSON, CSV ou PDF                                               |
| **Documentação**           | Swagger UI em `/docs` com exemplos e schemas padronizados                                      |
| **Segurança**              | Helmet, CORS restrito, rate limit, validação Zod, erros padronizados                           |
| **DevOps**                 | CI (GitHub Actions), deploy no Render, Docker Compose (API + Postgres + Redis)                 |

---

## Diferenciais técnicos

Pontos que demonstram maturidade de backend e alinhamento com boas práticas (incl. OWASP):

- **API REST segura** com envelope consistente `{ success, message, data }` e erros `{ success, message, code }`
- **Autenticação e autorização** via JWT; recursos acessados apenas pelo dono (`/me`, ownership em transações)
- **Proteção contra Broken Access Control (BAC)** — sem listagem cross-user; delete/update com checagem de `user_id`
- **Validação de entrada** com Zod (body, query params e allowlist de ordenação)
- **Paginação e filtros** com limite máximo e rejeição de parâmetros arbitrários
- **Mass assignment mitigado** — `user_id` do body ignorado; apenas o usuário do token é usado
- **Senhas nunca expostas** — bcrypt no armazenamento; `sanitizeUser` nas responses
- **Documentação OpenAPI** profissional com `bearerAuth` e exemplos de 4xx/5xx
- **Deploy em produção** no Render com migrations e `prisma generate` no pipeline
- **Testes** unitários + integração (fluxos reais com Supertest e banco isolado)

---

## Tecnologias utilizadas

| Camada      | Stack                             |
| ----------- | --------------------------------- |
| Runtime     | Node.js 20+                       |
| Framework   | Express 5                         |
| Banco       | PostgreSQL 16                     |
| ORM         | Prisma                            |
| Auth        | JSON Web Token (access + refresh) |
| Validação   | Zod                               |
| Segurança   | Helmet, express-rate-limit, CORS  |
| Hash        | bcrypt                            |
| Testes      | Jest, Supertest                   |
| Docs        | Swagger UI / OpenAPI 2.0          |
| Infra local | Docker Compose                    |
| CI/CD       | GitHub Actions                    |
| Deploy      | Render                            |

Outras libs: `dayjs`, `validator`, `uuid`, `swagger-ui-express`, Husky, ESLint, Prettier.

---

## Arquitetura

O projeto evoluiu para uma **arquitetura modular em camadas**, inspirada em Clean Architecture e Hexagonal Architecture, com separação clara de responsabilidades por domínio.

### Fluxo de uma requisição

```mermaid
flowchart LR
    A[HTTP Request] --> B[Routes]
    B --> C[Middlewares]
    C --> D[Controller]
    D --> E[Service]
    E --> F[Repository]
    F --> G[Prisma Client]
    G --> H[(PostgreSQL)]
```

| Camada           | Responsabilidade                                                       |
| ---------------- | ---------------------------------------------------------------------- |
| **Routes**       | Mapeamento HTTP e composição de middlewares por módulo                 |
| **Middlewares**  | Auth JWT, rate limit, CORS, request ID, logging, error handler         |
| **Controllers**  | Adaptação HTTP: validação de entrada, status code, formato de resposta |
| **Services**     | Regras de negócio e orquestração (antes: use cases)                    |
| **Repositories** | Acesso a dados via Prisma — única camada que conhece o ORM             |
| **Adapters**     | Serviços externos (bcrypt, JWT, UUID, cache Redis)                     |
| **Schemas**      | Contratos Zod por módulo                                               |
| **Composition**  | Injeção de dependências (composition root por módulo)                  |

### Por que essa separação?

- **Controllers** não conhecem Prisma — facilitam testes de contrato HTTP.
- **Services** recebem e retornam dados simples, sem `req`/`res` — regras de negócio testáveis com mocks de repository.
- **Repositories** concentram queries — mudanças de persistência ficam isoladas.
- **Módulos por domínio** (`auth`, `users`, `transactions`) reduzem acoplamento e tornam a evolução incremental segura.

### Estrutura de pastas

```
src/
├── modules/
│   ├── auth/              # Cadastro, login, refresh, logout
│   │   ├── auth.routes.js
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.repository.js
│   │   ├── auth.schemas.js
│   │   └── auth.composition.js
│   ├── users/             # Perfil e saldo (/me)
│   ├── transactions/      # CRUD de lançamentos
│   ├── dashboard/         # Métricas agregadas
│   ├── categories/        # Placeholder (CRUD futuro)
│   └── health/            # Health check com repository
├── shared/
│   ├── errors/            # Erros de domínio (AppError)
│   ├── middlewares/       # auth, rate-limit, request-id, error-handler
│   ├── http/              # sendHttpResponse, map-error, sanitize
│   ├── utils/             # paginação, cache keys, Prisma errors
│   ├── database/          # Prisma client (ponto único de acesso)
│   ├── logger/            # Pino
│   └── validators/        # Helpers de validação compartilhados
├── config/                # CORS, Helmet, logger, env
├── adapters/              # bcrypt, JWT, UUID, cache Redis
├── controllers/           # Implementações HTTP (re-exportadas pelos módulos)
├── repositories/          # Implementações Prisma (re-exportadas pelos módulos)
├── use-cases/             # Regras de negócio (re-exportadas como services)
├── routes/                # Montagem de routers (compatibilidade)
├── schemas/               # Schemas Zod legados
├── factories/             # Re-export das compositions (compatibilidade com testes)
└── tests/
    └── integration/       # Testes E2E com Supertest
prisma/
├── schema.prisma
└── migrations/
docs/
└── swagger.json           # Contrato OpenAPI
```

> **Migração incremental:** pastas legadas (`controllers/`, `use-cases/`, `repositories/`, `factories/`) permanecem como implementação física; os módulos agrupam responsabilidades e expõem o padrão Route → Middleware → Controller → Service → Repository → Prisma. A remoção das pastas antigas pode ocorrer em etapas futuras, módulo a módulo.

---

## Dashboard Financeiro

Endpoint protegido: **`GET /api/dashboard`**

Retorna métricas agregadas **somente do usuário autenticado** (JWT). Não existe parâmetro de rota para consultar outro usuário — o `userId` vem exclusivamente do token.

### Métricas (`data.summary`)

| Campo              | Descrição                                   |
| ------------------ | ------------------------------------------- |
| `totalEarnings`    | Soma de receitas (`EARNING`)                |
| `totalExpenses`    | Soma de despesas (`EXPENSE`)                |
| `totalInvestments` | Soma de investimentos (`INVESTMENT`)        |
| `balance`          | Saldo = receitas − despesas − investimentos |
| `transactionCount` | Quantidade de transações no período/filtro  |
| `highestEarning`   | Maior receita individual                    |
| `highestExpense`   | Maior despesa individual                    |
| `averageEarning`   | Média de receitas                           |
| `averageExpense`   | Média de despesas                           |

### Agrupamentos

| Campo        | Descrição                                                        |
| ------------ | ---------------------------------------------------------------- |
| `byCategory` | Totais por nome da transação (legado) ou por categoria vinculada |
| `byMonth`    | Totais mensais (`YYYY-MM`)                                       |
| `byType`     | Totais por tipo (`EARNING`, `EXPENSE`, `INVESTMENT`)             |

### Filtros (query params)

| Param                   | Descrição                                                       |
| ----------------------- | --------------------------------------------------------------- |
| `startDate` / `endDate` | Período ISO 8601                                                |
| `month` / `year`        | Atalho por mês/ano (não combinar com `startDate`/`endDate`)     |
| `type`                  | `EARNING`, `EXPENSE` ou `INVESTMENT`                            |
| `categoryId`            | Filtra pelo **nome** da transação (legado) ou UUID da categoria |

---

## Recorrências, parcelamentos e orçamento

Funcionalidades avançadas de controle financeiro pessoal, com validação Zod, ownership por usuário e invalidação de cache após escritas.

### Transações recorrentes

Cria uma série de lançamentos (aluguel, salário, assinatura etc.) com base em uma transação “mãe”.

| Campo                 | Descrição                           |
| --------------------- | ----------------------------------- |
| `isRecurring`         | Indica série recorrente             |
| `recurrenceType`      | `WEEKLY`, `MONTHLY` ou `YEARLY`     |
| `recurrenceEndDate`   | Data limite opcional da série       |
| `parentTransactionId` | Filhos apontam para a transação mãe |

```http
POST /api/transactions/me/recurring
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "Rent",
  "date": "2025-06-01T00:00:00.000Z",
  "type": "EXPENSE",
  "amount": 800,
  "isRecurring": true,
  "recurrenceType": "MONTHLY",
  "recurrenceEndDate": "2025-12-01T00:00:00.000Z"
}
```

Listar templates recorrentes: `GET /api/transactions/me/recurring`.

### Despesas parceladas

Divide um valor total em N parcelas mensais de forma **atômica** (tudo ou nada). Ex.: R$ 1.200 em 12x → 12 transações de R$ 100,00.

| Campo                | Descrição                       |
| -------------------- | ------------------------------- |
| `isInstallment`      | Marca cada parcela              |
| `installmentNumber`  | Número da parcela (1…N)         |
| `totalInstallments`  | Total de parcelas               |
| `installmentGroupId` | Agrupa parcelas da mesma compra |

```http
POST /api/transactions/me/installments
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "Notebook",
  "date": "2025-06-01T00:00:00.000Z",
  "type": "EXPENSE",
  "totalAmount": 1200,
  "totalInstallments": 12
}
```

### Orçamento mensal por categoria

Define limite de gasto por categoria, mês e ano. Cada usuário acessa apenas os próprios orçamentos.

```http
POST /api/budgets
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "categoryId": "<uuid-da-categoria>",
  "month": 6,
  "year": 2025,
  "limitAmount": 500
}
```

### Alertas financeiros por categoria

`GET /api/budgets/status?month=6&year=2025` retorna, para cada orçamento:

| Campo            | Descrição                                                      |
| ---------------- | -------------------------------------------------------------- |
| `budgetedAmount` | Valor orçado                                                   |
| `spentAmount`    | Soma de despesas da categoria no mês                           |
| `usagePercent`   | Percentual utilizado                                           |
| `status`         | `safe` (&lt; 80%), `warning` (80–100%), `exceeded` (&gt; 100%) |

Não há envio de notificação push/e-mail nesta etapa — os alertas são expostos na API (dashboard/orçamentos).

### Categorias

Categorias são entidades próprias (`POST/GET /api/categories`) e podem ser vinculadas a transações, parcelamentos, recorrências e orçamentos. `categoryId` deve pertencer ao usuário autenticado.

---

## Relatórios financeiros exportáveis

Endpoint protegido: **`GET /api/reports/financial`**

Gera relatório **somente do usuário autenticado** (JWT). Não aceita `userId` em query, body ou params.

### Filtros

| Param                   | Descrição                                                   |
| ----------------------- | ----------------------------------------------------------- |
| `startDate` / `endDate` | Período ISO 8601                                            |
| `month` / `year`        | Atalho por mês/ano (não combinar com `startDate`/`endDate`) |
| `type`                  | `EARNING`, `EXPENSE` ou `INVESTMENT`                        |
| `categoryId`            | UUID de categoria do usuário                                |
| `format`                | `json` (padrão), `csv` ou `pdf`                             |

### Conteúdo

- Período filtrado
- Totais de receitas, despesas, investimentos e saldo
- Quantidade de transações
- Lista de transações (sem `user_id` ou dados sensíveis)
- Resumo por categoria e por tipo
- Limite máximo de **5.000 transações** por exportação

### Exemplos

**JSON (padrão):**

```http
GET /api/reports/financial?month=6&year=2025
Authorization: Bearer <accessToken>
```

**CSV:**

```http
GET /api/reports/financial?format=csv&startDate=2025-06-01T00:00:00.000Z&endDate=2025-06-30T23:59:59.999Z
Authorization: Bearer <accessToken>
```

Resposta: `Content-Type: text/csv; charset=utf-8` com BOM UTF-8 para Excel.

**PDF:**

```http
GET /api/reports/financial?format=pdf&month=6&year=2025
Authorization: Bearer <accessToken>
```

Resposta: `Content-Type: application/pdf` com título, período, resumo e tabela de transações.

---

### Cache (dashboard)

Respostas do dashboard são cacheadas por usuário e filtros (TTL 60s, Redis ou fallback in-memory). O cache é **invalidado automaticamente** quando transações são criadas, atualizadas ou excluídas (`invalidateUserCache`).

Exemplo:

```http
GET /api/dashboard?month=6&year=2025
Authorization: Bearer <accessToken>
```

---

## Segurança

| Prática               | Implementação                                                 |
| --------------------- | ------------------------------------------------------------- |
| Autenticação JWT      | Middleware `auth` em rotas protegidas                         |
| Autorização           | Rotas `/me`; transações filtradas por `user_id` do token      |
| BAC                   | Update/delete retornam 403 se recurso não pertence ao usuário |
| CORS                  | Origens permitidas via `FRONTEND_URL` (+ localhost em dev)    |
| Helmet                | Headers HTTP de segurança (CSP ajustada para Swagger)         |
| Rate limit            | Global + limite reforçado em login/registro/refresh           |
| Mass assignment       | `user_id` no body não sobrescreve o JWT                       |
| Dados sensíveis       | Password/hash nunca retornados; tokens só em fluxos de auth   |
| Variáveis de ambiente | Segredos JWT e `DATABASE_URL` fora do código                  |
| Anti-enumeração       | Login com mensagem genérica de credenciais inválidas          |

---

## Documentação da API

| Ambiente     | URL                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------ |
| **Produção** | [https://finance-app-i600.onrender.com/docs/](https://finance-app-i600.onrender.com/docs/) |
| **Local**    | [http://localhost:3000/docs](http://localhost:3000/docs)                                   |

### Autenticar no Swagger

1. Execute `POST /api/users` (cadastro) ou `POST /api/users/login` (login).
2. Copie `data.tokens.accessToken` da resposta.
3. Clique em **Authorize** (ícone de cadeado).
4. Informe: `Bearer <seu_accessToken>` (com a palavra `Bearer` e um espaço).
5. Teste rotas em **Users** e **Transactions**.

Renovação: `POST /api/users/refresh-token` com o `refreshToken` — cada refresh invalida o token anterior e emite um novo par.

Logout: `POST /api/users/logout` com o `refreshToken` no body, ou `POST /api/users/logout-all` com Bearer token.

Contrato completo: [`docs/swagger.json`](docs/swagger.json).

---

## Autenticação e sessões

A API usa **access token JWT** de curta duração e **refresh token opaco** rotacionado, armazenado no banco apenas como **hash bcrypt**.

| Aspecto         | Estratégia                                                                             |
| --------------- | -------------------------------------------------------------------------------------- |
| Access token    | JWT assinado; expiração curta (`JWT_ACCESS_EXPIRES_IN`, padrão `15m`)                  |
| Refresh token   | Opaque `{sessionId}.{secret}`; expiração maior (`JWT_REFRESH_EXPIRES_IN`, padrão `7d`) |
| Armazenamento   | Apenas `token_hash` (bcrypt do secret) em `refresh_token_sessions`                     |
| Rotação         | Cada refresh invalida o token anterior e emite novo par                                |
| Reuso detectado | Refresh token já usado/revogado → revoga **todas** as sessões do usuário → `401`       |
| Logout          | Revoga sessão atual (`POST /api/users/logout`)                                         |
| Logout global   | Revoga todas as sessões (`POST /api/users/logout-all`)                                 |

**Segurança:** tokens nunca são logados; `token_hash` nunca aparece nas responses.

---

## Endpoints principais

### Auth (público)

| Método | Rota                       | Descrição                          |
| ------ | -------------------------- | ---------------------------------- |
| `POST` | `/api/users`               | Cadastro + tokens                  |
| `POST` | `/api/users/login`         | Login                              |
| `POST` | `/api/users/refresh-token` | Renovar tokens (rotação)           |
| `POST` | `/api/users/logout`        | Encerrar sessão atual              |
| `POST` | `/api/users/logout-all`    | Encerrar todas as sessões (Bearer) |

### Users (autenticado)

| Método   | Rota                              | Descrição         |
| -------- | --------------------------------- | ----------------- |
| `GET`    | `/api/users/me`                   | Perfil do usuário |
| `PATCH`  | `/api/users/me`                   | Atualizar perfil  |
| `DELETE` | `/api/users/me`                   | Excluir conta     |
| `GET`    | `/api/users/me/balance?from=&to=` | Saldo no período  |

### Transactions (autenticado)

| Método   | Rota                                  | Descrição                                      |
| -------- | ------------------------------------- | ---------------------------------------------- |
| `GET`    | `/api/transactions/me`                | Listar (paginado + filtros)                    |
| `POST`   | `/api/transactions/me`                | Criar transação                                |
| `PATCH`  | `/api/transactions/me/:transactionId` | Atualizar                                      |
| `DELETE` | `/api/transactions/me/:transactionId` | Excluir                                        |
| `GET`    | `/api/transactions`                   | Alias da listagem                              |
| `POST`   | `/api/transactions`                   | Alias da criação                               |
| `POST`   | `/api/transactions/me/installments`   | Criar compra parcelada (N transações atômicas) |
| `POST`   | `/api/transactions/me/recurring`      | Criar série recorrente                         |
| `GET`    | `/api/transactions/me/recurring`      | Listar transações recorrentes (templates)      |

### Categories (autenticado)

| Método | Rota              | Descrição                    |
| ------ | ----------------- | ---------------------------- |
| `POST` | `/api/categories` | Criar categoria              |
| `GET`  | `/api/categories` | Listar categorias do usuário |

### Budgets (autenticado)

| Método | Rota                  | Descrição                             |
| ------ | --------------------- | ------------------------------------- |
| `POST` | `/api/budgets`        | Criar orçamento mensal por categoria  |
| `GET`  | `/api/budgets`        | Listar orçamentos                     |
| `GET`  | `/api/budgets/status` | Alertas safe/warning/exceeded por mês |

### Dashboard (autenticado)

| Método | Rota             | Descrição                         |
| ------ | ---------------- | --------------------------------- |
| `GET`  | `/api/dashboard` | Métricas agregadas e agrupamentos |

### Reports (autenticado)

| Método | Rota                     | Descrição                               |
| ------ | ------------------------ | --------------------------------------- |
| `GET`  | `/api/reports/financial` | Relatório financeiro (JSON, CSV ou PDF) |

### Health

| Método | Rota      | Descrição                                    |
| ------ | --------- | -------------------------------------------- |
| `GET`  | `/`       | Status leve + links para `/docs` e `/health` |
| `GET`  | `/health` | Health check completo (API, uptime, banco)   |

---

## Observabilidade

A API usa **logs estruturados em JSON** via [Pino](https://getpino.io/), compatíveis com **stdout/stderr** no Render (sem escrita em arquivo local).

### Logs estruturados

| Campo                         | Descrição                                 |
| ----------------------------- | ----------------------------------------- |
| `level`                       | Nível do log (`info`, `warn`, `error`, …) |
| `time`                        | Timestamp ISO 8601                        |
| `environment`                 | `NODE_ENV` atual                          |
| `service`                     | `finance-app`                             |
| `requestId`                   | ID de correlação da requisição            |
| `method`, `url`, `statusCode` | Request HTTP (via `pino-http`)            |
| `responseTime`                | Tempo de resposta em ms                   |

Configure o nível com `LOG_LEVEL` (padrão: `info` em produção, `debug` em desenvolvimento, `silent` em testes).

### Request ID

Cada requisição recebe um `X-Request-Id` (UUID). O cliente pode enviar o próprio ID no header; caso contrário, a API gera um. O mesmo valor aparece:

- no header `X-Request-Id` da resposta;
- no corpo de erros (`requestId`);
- nos logs de erro.

### Health check

```bash
curl -s http://localhost:3000/health | jq
```

Exemplo com banco saudável:

```json
{
    "success": true,
    "message": "Service is healthy",
    "data": {
        "status": "ok",
        "environment": "development",
        "uptime": 42,
        "timestamp": "2025-06-19T12:00:00.000Z",
        "database": { "status": "connected" },
        "docs": "/docs"
    },
    "requestId": "..."
}
```

Se o PostgreSQL estiver indisponível, retorna **HTTP 503** com `"status": "degraded"` e `"database": { "status": "disconnected" }`.

### Dados sensíveis nos logs

Os logs **não** incluem:

- `Authorization` / cookies
- `password`, `refreshToken`, `accessToken`
- corpo completo de transações (`amount`, `name`)

Erros em produção são logados com stack no servidor, mas **não** expõem stack trace na resposta HTTP.

### Render

No Render, os logs JSON do Pino aparecem automaticamente em **Logs** do serviço web. Use `requestId` para correlacionar uma falha reportada pelo cliente com a linha exata no painel.

---

## Cache (Redis)

Consultas frequentes de leitura usam **Redis** via [ioredis](https://github.com/redis/ioredis), com **fallback in-memory** automático se `REDIS_URL` não estiver definida ou se o Redis estiver indisponível. A API continua funcionando normalmente sem Redis.

### Por que Redis?

- Reduz carga no PostgreSQL em listagens e resumos financeiros repetidos.
- Melhora latência de endpoints autenticados de leitura.
- Demonstra estratégia de cache em produção (Render + Redis gerenciado).

### Endpoints com cache

| Endpoint                    | Chave (padrão)                                     | TTL  |
| --------------------------- | -------------------------------------------------- | ---- |
| `GET /api/users/me/balance` | `finance-app:user:{userId}:balance:{from}:{to}`    | 120s |
| `GET /api/transactions/me`  | `finance-app:user:{userId}:transactions:{filtros}` | 60s  |
| `GET /api/transactions`     | (alias da listagem acima)                          | 60s  |

**Não** há cache em: auth, perfil, health, writes ou categorias (CRUD ainda não disponível).

### Invalidação

Qualquer **criação, atualização ou exclusão de transação** invalida todas as chaves do usuário:

`finance-app:user:{userId}:*`

Isso garante que saldo e listagens cacheadas sejam recalculados após mudanças.

### Segurança

- Cache **sempre separado por `userId`** — um usuário nunca recebe dados de outro.
- Filtros de query entram na chave para evitar respostas incorretas.
- **Não** cacheamos tokens, senhas, hashes ou headers `Authorization`.
- Respostas da API **não** expõem detalhes internos do Redis.

### Configuração local

```bash
docker compose up -d redis
# .env
REDIS_URL=redis://localhost:6379
```

Com a stack Docker completa (`npm run docker:up`), use `REDIS_URL=redis://redis:6379` via `.env.docker`.

Sem `REDIS_URL`, o fallback in-memory é usado (útil em testes e dev simples).

---

## Contrato e exemplos

### Sucesso

```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": {}
}
```

### Erro

```json
{
    "success": false,
    "message": "Resource not found.",
    "code": "NOT_FOUND"
}
```

### Cadastro

```http
POST /api/users
Content-Type: application/json

{
  "first_name": "Ana",
  "last_name": "Silva",
  "email": "ana@example.com",
  "password": "Str0ngP@ssw0rd"
}
```

```json
{
    "success": true,
    "message": "User created successfully",
    "data": {
        "id": "uuid",
        "first_name": "Ana",
        "last_name": "Silva",
        "email": "ana@example.com",
        "tokens": {
            "accessToken": "eyJhbGciOiJIUzI1NiIs...",
            "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
        }
    }
}
```

### Listagem paginada com filtros

```http
GET /api/transactions/me?page=1&limit=10&type=EXPENSE&startDate=2024-01-01T00:00:00.000Z&endDate=2024-12-31T23:59:59.999Z&sortBy=date&sortOrder=desc
Authorization: Bearer <accessToken>
```

```json
{
    "success": true,
    "message": "Transactions retrieved successfully",
    "data": [
        {
            "id": "uuid",
            "user_id": "uuid",
            "name": "Groceries",
            "type": "EXPENSE",
            "amount": "150.00",
            "date": "2024-06-01T00:00:00.000Z",
            "created_at": "2024-06-01T12:00:00.000Z"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 10,
        "total": 42,
        "totalPages": 5
    }
}
```

### Códigos HTTP comuns

| Status | Uso                                     |
| ------ | --------------------------------------- |
| 200    | Sucesso (leitura/atualização)           |
| 201    | Criação                                 |
| 204    | Delete sem body                         |
| 400    | Validação (`VALIDATION_ERROR`)          |
| 401    | Não autenticado / credenciais inválidas |
| 403    | Sem permissão (`FORBIDDEN`)             |
| 404    | Recurso inexistente                     |
| 409    | Conflito (ex.: e-mail duplicado)        |
| 429    | Rate limit                              |

---

## Como rodar localmente

### 1. Clonar e instalar

```bash
git clone https://github.com/vivianeaguiarc/finance-app.git
cd finance-app
npm install
```

O `postinstall` executa `prisma generate` automaticamente.

### 2. Configurar ambiente

Copie `env.example` para `.env` e ajuste os valores (veja seção abaixo).

### 3. Subir infraestrutura (Docker — opcional)

**Opção A — stack completa (API + Postgres + Redis):** veja [Rodando com Docker](#rodando-com-docker).

**Opção B — apenas banco/cache para dev local com `npm run dev`:**

```bash
docker compose up -d postgres redis
# testes de integração:
npm run docker:test:up
```

### 4. Migrations

```bash
npx prisma migrate deploy
# ou em desenvolvimento:
npx prisma migrate dev
```

### 5. Iniciar a API

```bash
npm run dev
```

- API: [http://localhost:3000](http://localhost:3000)
- Swagger: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## Rodando com Docker

Ambiente local completo em um comando: **API**, **PostgreSQL** e **Redis** na rede interna do Compose. Ideal para demo, onboarding e validação sem instalar Node/Postgres na máquina.

### Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine + Compose v2)
- Porta **3000** livre no host

### Comandos

```bash
# 1. Clonar o repositório
git clone https://github.com/vivianeaguiarc/finance-app.git
cd finance-app

# 2. (Opcional) Personalizar variáveis Docker
cp .env.docker.example .env.docker

# 3. Subir tudo — build, migrations e API
npm run docker:up

# Acompanhar logs
npm run docker:logs

# Rodar migrations manualmente (se necessário)
npm run docker:migrate

# Parar containers
npm run docker:down
```

### Serviços no Compose

| Serviço         | Container                  | Host                                    | Descrição                         |
| --------------- | -------------------------- | --------------------------------------- | --------------------------------- |
| `app`           | `financeapp-api`           | [localhost:3000](http://localhost:3000) | API Node.js/Express               |
| `postgres`      | `financeapp-postgres`      | rede interna                            | PostgreSQL 16 (dados persistidos) |
| `redis`         | `financeapp-redis`         | rede interna                            | Cache Redis 7                     |
| `postgres-test` | `financeapp-postgres-test` | `localhost:5434`                        | Perfil `test` — banco para Jest   |

Postgres e Redis **não** expõem portas no host por padrão (apenas a API na 3000). O perfil de teste expõe `5434` para integração local.

### Migrations (Prisma)

No startup, o container `app` executa automaticamente:

```bash
npx prisma migrate deploy
```

Comandos úteis:

| Comando                                       | Quando usar                                           |
| --------------------------------------------- | ----------------------------------------------------- |
| `npm run docker:migrate`                      | Reaplicar migrations no container                     |
| `docker compose exec app npx prisma generate` | Regenerar client Prisma                               |
| `npx prisma migrate dev`                      | Desenvolvimento **fora** do Docker (com `.env` local) |

### Swagger e health check

| URL                                                          | Descrição                  |
| ------------------------------------------------------------ | -------------------------- |
| [http://localhost:3000/docs](http://localhost:3000/docs)     | Swagger UI                 |
| [http://localhost:3000/health](http://localhost:3000/health) | Health check (API + banco) |
| [http://localhost:3000/](http://localhost:3000/)             | Status leve + links        |

### Variáveis Docker

Copie `.env.docker.example` → `.env.docker`. Placeholders seguros — **nunca** commite `.env.docker` com segredos reais de produção.

```env
DATABASE_URL=postgresql://postgres:password@postgres:5432/finance_app
REDIS_URL=redis://redis:6379
```

### Troubleshooting

| Problema              | Solução                                                       |
| --------------------- | ------------------------------------------------------------- |
| Porta 3000 em uso     | Pare outro processo ou altere `ports` no `docker-compose.yml` |
| `app` reiniciando     | `npm run docker:logs` — verifique migrations/Postgres         |
| Migrations pendentes  | `npm run docker:migrate`                                      |
| Limpar volumes        | `docker compose down -v` (apaga dados do Postgres)            |
| Rebuild após mudanças | `docker compose up -d --build`                                |

### Testes de integração (host)

```bash
npm run docker:test:up
cp env.test.example .env.test
npm test
```

---

## Variáveis de ambiente

Use **placeholders** — nunca commite segredos reais.

```env
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://postgres:password@localhost:5432/finance_app

JWT_ACCESS_SECRET=change_me_to_a_long_random_secret_at_least_32_chars
JWT_REFRESH_SECRET=change_me_to_another_long_random_secret_at_least_32_chars

FRONTEND_URL=http://localhost:5173
```

| Variável                 | Descrição                                    |
| ------------------------ | -------------------------------------------- |
| `NODE_ENV`               | `development`, `test` ou `production`        |
| `PORT`                   | Porta HTTP (Render define automaticamente)   |
| `DATABASE_URL`           | Connection string PostgreSQL                 |
| `JWT_ACCESS_SECRET`      | Segredo do access token (≥ 32 caracteres)    |
| `JWT_REFRESH_SECRET`     | Reservado/legado (refresh opaco não usa JWT) |
| `JWT_ACCESS_EXPIRES_IN`  | Expiração do access token (ex.: `15m`)       |
| `JWT_REFRESH_EXPIRES_IN` | Expiração do refresh token (ex.: `7d`)       |
| `FRONTEND_URL`           | Origem permitida no CORS (produção)          |

Para testes, use `env.test.example` → `.env.test` com banco `finance_app_test` (porta `5434`).

---

## Testes

Stack: **Jest + Supertest**. Cobertura em camadas (controllers, use cases, schemas) e **integração** com fluxos reais da API.

### O que é testado

- Autenticação (cadastro, login, refresh, 401)
- CRUD de transações e ownership (403/404)
- Paginação, filtros e validação de query params
- Segurança (sem password na response, BAC)
- Contrato Swagger (`swagger.validation.test.js`)

### Executar

```bash
# Banco de teste
npm run docker:test:up
cp env.test.example .env.test
npm run migrations:test

# Rodar todos os testes
npm test

# CI local (com coverage)
npm run test:ci
```

Os testes de integração limpam `users` e `transactions` entre casos e **recusam** rodar contra banco de produção.

---

## Deploy (Render)

1. Web Service apontando para o repositório GitHub.
2. **Build:** `npm install && npm run migrations && npm start` (ou apenas `npm run migrations` antes do start)
3. **Start:** `npm start`
4. Variáveis: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`, `NODE_ENV=production`
5. `PORT` é injetado pelo Render — não fixe no código.
6. `postinstall` garante `prisma generate` após o install.

CI no GitHub Actions valida lint, Prettier, migrations e testes antes do deploy.

### CI — job `migrate` (produção)

O job `migrate` (apenas em `main`) aplica migrations no banco de produção **antes** do deploy hook do Render.

| Secret (environment `production`) | Obrigatório  | Descrição                                                                         |
| --------------------------------- | ------------ | --------------------------------------------------------------------------------- |
| `DATABASE_URL`                    | Sim          | Connection string completa do Neon/Render (`postgresql://USER:PASSWORD@HOST/DB`)  |
| `DIRECT_DATABASE_URL`             | Não          | URL **direct** (sem `-pooler`) do Neon; se omitida, o CI converte automaticamente |
| `RENDER_DEPLOY_HOOK_URL`          | Sim (deploy) | Hook de deploy do Render                                                          |

**Erro `P1000: Authentication failed`**

1. Confirme que `DATABASE_URL` no GitHub → **Settings → Environments → production** contém a string **completa** copiada do Neon (não use placeholders como `${USER}`).
2. O script `npm run migrations` (`scripts/prisma-migrate-deploy.js`) converte automaticamente hosts `-pooler` para conexão **direct** — inclusive quando `DIRECT_DATABASE_URL` aponta por engano para o pooler.
3. Se a senha foi rotacionada no Neon, atualize o secret no GitHub **e** no Render.
4. No **Render**, o build **não** deve usar `npx prisma migrate deploy` direto — use `npm run migrations`.
5. Nos logs do CI, confira a linha `Prisma migrate deploy target host:` — o host **não** deve conter `-pooler`.

**Erro `P3018` / `relation "transactions" does not exist`**

Migrations são aplicadas na ordem do **timestamp** no nome da pasta. Se uma migration de `ALTER TABLE transactions` rodar antes do `init`, o deploy falha. Após corrigir a ordem, em bancos com tentativa falha registrada:

```bash
npx prisma migrate resolve --rolled-back 20250620120000_add_categories_recurring_installments_budgets
npm run migrations
```

Em banco Neon **novo/vazio**, basta rodar `npm run migrations` após o push com a ordem corrigida.

---

## Scripts npm

| Comando                  | Descrição                                         |
| ------------------------ | ------------------------------------------------- |
| `npm start`              | Produção                                          |
| `npm run dev`            | Desenvolvimento (`--watch`)                       |
| `npm test`               | Testes unitários + integração                     |
| `npm run test:ci`        | Testes com coverage (CI)                          |
| `npm run migrations`     | `prisma migrate deploy` (com suporte Neon direct) |
| `npm run eslint:check`   | ESLint                                            |
| `npm run prettier:check` | Prettier (check)                                  |
| `npm run format`         | Prettier (write)                                  |
| `npm run docker:up`      | Stack Docker completa (build + up)                |
| `npm run docker:down`    | Parar containers                                  |
| `npm run docker:logs`    | Logs da API                                       |
| `npm run docker:migrate` | Migrations no container                           |
| `npm run docker:test:up` | Postgres de teste (perfil `test`)                 |

---

## Roadmap

- [ ] CRUD de categorias de transação
- [ ] Frontend integrado (React/Vue) consumindo a API
- [ ] Cobertura de testes ampliada (repositórios, edge cases)
- [ ] CI/CD com ambientes de preview
- [ ] Endpoint `GET /transactions/:id`

---

## Autora

**Viviane Aguiar**  
Juiz de Fora – MG, Brasil  
[LinkedIn](https://www.linkedin.com/in/vivianeaguiarc)

---

## Licença

Projeto educacional e de portfólio. Sinta-se à vontade para clonar e estudar.
