# Finance App — API REST de Gestão Financeira Pessoal

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![Jest](https://img.shields.io/badge/Tests-Jest%20%2B%20Supertest-C21325?logo=jest&logoColor=white)

API REST em produção para controle financeiro pessoal: cadastro, autenticação JWT, transações, saldo consolidado, paginação, filtros e documentação OpenAPI.

| Recurso | Link |
|---------|------|
| **Swagger (produção)** | [finance-app-i600.onrender.com/docs](https://finance-app-i600.onrender.com/docs/) |
| **Swagger (local)** | [localhost:3000/docs](http://localhost:3000/docs) |
| **Repositório** | [github.com/vivianeaguiarc/finance-app](https://github.com/vivianeaguiarc/finance-app) |

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

| Área | O que está disponível |
|------|------------------------|
| **Usuários** | Cadastro, login, refresh token, perfil (`/me`), atualização e exclusão de conta |
| **Autenticação** | JWT (access + refresh), rotas protegidas, Bearer no header |
| **Transações** | CRUD de lançamentos (`EARNING`, `EXPENSE`, `INVESTMENT`) |
| **Saldo** | Agregação por período (ganhos, despesas, investimentos, percentuais) |
| **Listagem** | Paginação (`page`, `limit`), filtros por tipo, período e valor, ordenação com allowlist |
| **Categorias** | Filtro por `type` (tipo de transação). *CRUD de categorias ainda não implementado — ver Roadmap* |
| **Documentação** | Swagger UI em `/docs` com exemplos e schemas padronizados |
| **Segurança** | Helmet, CORS restrito, rate limit, validação Zod, erros padronizados |
| **DevOps** | CI (GitHub Actions), deploy no Render, Docker Compose para PostgreSQL |

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

| Camada | Stack |
|--------|--------|
| Runtime | Node.js 20+ |
| Framework | Express 5 |
| Banco | PostgreSQL 16 |
| ORM | Prisma |
| Auth | JSON Web Token (access + refresh) |
| Validação | Zod |
| Segurança | Helmet, express-rate-limit, CORS |
| Hash | bcrypt |
| Testes | Jest, Supertest |
| Docs | Swagger UI / OpenAPI 2.0 |
| Infra local | Docker Compose |
| CI/CD | GitHub Actions |
| Deploy | Render |

Outras libs: `dayjs`, `validator`, `uuid`, `swagger-ui-express`, Husky, ESLint, Prettier.

---

## Arquitetura

O projeto segue **arquitetura em camadas** com separação clara de responsabilidades:

```mermaid
flowchart LR
    A[HTTP Request] --> B[Routes]
    B --> C[Middlewares]
    C --> D[Controllers]
    D --> E[Use Cases]
    E --> F[Repositories]
    F --> G[Prisma Client]
    G --> H[(PostgreSQL)]
```

| Camada | Responsabilidade |
|--------|------------------|
| **Routes** | Mapeamento HTTP, composição de middlewares |
| **Middlewares** | Auth JWT, rate limit, CORS, request ID, structured logging, error handler |
| **Controllers** | Validação de entrada, status HTTP, formato de resposta |
| **Use cases** | Regras de negócio e orquestração |
| **Repositories** | Acesso a dados (Prisma) |
| **Adapters** | Serviços externos (bcrypt, JWT, UUID) |
| **Schemas** | Contratos Zod compartilhados |
| **Factories** | Injeção de dependências (composition root) |

### Estrutura de pastas

```
src/
├── adapters/          # bcrypt, JWT, geração de ID
├── config/            # CORS, Helmet, logger (Pino)
├── controllers/       # Handlers HTTP
├── errors/            # Erros de domínio (AppError)
├── factories/         # Montagem de controllers/use cases
├── middlewares/       # auth, rate-limit, request-id, request-logger, error-handler
├── repositories/      # Implementações Prisma
├── routes/            # Rotas Express
├── schemas/           # Validação Zod
├── tests/
│   └── integration/   # Testes de integração E2E
├── use-cases/         # Regras de negócio
└── utils/             # Helpers (paginação, Prisma errors)
prisma/
├── schema.prisma
└── migrations/
docs/
└── swagger.json       # Contrato OpenAPI
```

---

## Segurança

| Prática | Implementação |
|---------|----------------|
| Autenticação JWT | Middleware `auth` em rotas protegidas |
| Autorização | Rotas `/me`; transações filtradas por `user_id` do token |
| BAC | Update/delete retornam 403 se recurso não pertence ao usuário |
| CORS | Origens permitidas via `FRONTEND_URL` (+ localhost em dev) |
| Helmet | Headers HTTP de segurança (CSP ajustada para Swagger) |
| Rate limit | Global + limite reforçado em login/registro/refresh |
| Mass assignment | `user_id` no body não sobrescreve o JWT |
| Dados sensíveis | Password/hash nunca retornados; tokens só em fluxos de auth |
| Variáveis de ambiente | Segredos JWT e `DATABASE_URL` fora do código |
| Anti-enumeração | Login com mensagem genérica de credenciais inválidas |

---

## Documentação da API

| Ambiente | URL |
|----------|-----|
| **Produção** | [https://finance-app-i600.onrender.com/docs/](https://finance-app-i600.onrender.com/docs/) |
| **Local** | [http://localhost:3000/docs](http://localhost:3000/docs) |

### Autenticar no Swagger

1. Execute `POST /api/users` (cadastro) ou `POST /api/users/login` (login).
2. Copie `data.tokens.accessToken` da resposta.
3. Clique em **Authorize** (ícone de cadeado).
4. Informe: `Bearer <seu_accessToken>` (com a palavra `Bearer` e um espaço).
5. Teste rotas em **Users** e **Transactions**.

Renovação: `POST /api/users/refresh-token` com o `refreshToken` do login.

Contrato completo: [`docs/swagger.json`](docs/swagger.json).

---

## Endpoints principais

### Auth (público)

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/users` | Cadastro + tokens |
| `POST` | `/api/users/login` | Login |
| `POST` | `/api/users/refresh-token` | Renovar tokens |

### Users (autenticado)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/users/me` | Perfil do usuário |
| `PATCH` | `/api/users/me` | Atualizar perfil |
| `DELETE` | `/api/users/me` | Excluir conta |
| `GET` | `/api/users/me/balance?from=&to=` | Saldo no período |

### Transactions (autenticado)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/transactions/me` | Listar (paginado + filtros) |
| `POST` | `/api/transactions/me` | Criar transação |
| `PATCH` | `/api/transactions/me/:transactionId` | Atualizar |
| `DELETE` | `/api/transactions/me/:transactionId` | Excluir |
| `GET` | `/api/transactions` | Alias da listagem |
| `POST` | `/api/transactions` | Alias da criação |

### Health

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/` | Status leve + links para `/docs` e `/health` |
| `GET` | `/health` | Health check completo (API, uptime, banco) |

---

## Observabilidade

A API usa **logs estruturados em JSON** via [Pino](https://getpino.io/), compatíveis com **stdout/stderr** no Render (sem escrita em arquivo local).

### Logs estruturados

| Campo | Descrição |
|-------|-----------|
| `level` | Nível do log (`info`, `warn`, `error`, …) |
| `time` | Timestamp ISO 8601 |
| `environment` | `NODE_ENV` atual |
| `service` | `finance-app` |
| `requestId` | ID de correlação da requisição |
| `method`, `url`, `statusCode` | Request HTTP (via `pino-http`) |
| `responseTime` | Tempo de resposta em ms |

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

| Status | Uso |
|--------|-----|
| 200 | Sucesso (leitura/atualização) |
| 201 | Criação |
| 204 | Delete sem body |
| 400 | Validação (`VALIDATION_ERROR`) |
| 401 | Não autenticado / credenciais inválidas |
| 403 | Sem permissão (`FORBIDDEN`) |
| 404 | Recurso inexistente |
| 409 | Conflito (ex.: e-mail duplicado) |
| 429 | Rate limit |

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

### 3. Subir o banco (Docker)

```bash
docker compose up -d postgres
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

| Variável | Descrição |
|----------|-----------|
| `NODE_ENV` | `development`, `test` ou `production` |
| `PORT` | Porta HTTP (Render define automaticamente) |
| `DATABASE_URL` | Connection string PostgreSQL |
| `JWT_ACCESS_SECRET` | Segredo do access token (≥ 32 caracteres) |
| `JWT_REFRESH_SECRET` | Segredo do refresh token (≥ 32 caracteres) |
| `FRONTEND_URL` | Origem permitida no CORS (produção) |

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
docker compose up -d postgres-test
cp env.test.example .env.test
dotenv -e .env.test -- npx prisma migrate deploy

# Rodar todos os testes
npm test

# CI local (com coverage)
npm run test:ci
```

Os testes de integração limpam `users` e `transactions` entre casos e **recusam** rodar contra banco de produção.

---

## Deploy (Render)

1. Web Service apontando para o repositório GitHub.
2. **Build:** `npm install && npx prisma migrate deploy`
3. **Start:** `npm start`
4. Variáveis: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`, `NODE_ENV=production`
5. `PORT` é injetado pelo Render — não fixe no código.
6. `postinstall` garante `prisma generate` após o install.

CI no GitHub Actions valida lint, Prettier, migrations e testes antes do deploy.

---

## Scripts npm

| Comando | Descrição |
|---------|-----------|
| `npm start` | Produção |
| `npm run dev` | Desenvolvimento (`--watch`) |
| `npm test` | Testes unitários + integração |
| `npm run test:ci` | Testes com coverage (CI) |
| `npm run migrations` | `prisma migrate deploy` |
| `npm run eslint:check` | ESLint |
| `npm run prettier:check` | Prettier |

---

## Roadmap

- [ ] CRUD de categorias de transação
- [ ] Refresh token rotation e revogação
- [ ] Frontend integrado (React/Vue) consumindo a API
- [ ] Cobertura de testes ampliada (repositórios, edge cases)
- [ ] CI/CD com ambientes de preview
- [ ] Docker Compose unificado (API + Postgres) para onboarding em um comando
- [ ] Endpoint `GET /transactions/:id`

---

## Autora

**Viviane Aguiar**  
Juiz de Fora – MG, Brasil  
[LinkedIn](https://www.linkedin.com/in/vivianeaguiarc)

---

## Licença

Projeto educacional e de portfólio. Sinta-se à vontade para clonar e estudar.
