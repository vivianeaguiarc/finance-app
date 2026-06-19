# 💰 FinanceApp – API de Controle Financeiro Pessoal

## 🧩 Visão Geral

O **FinanceApp** é uma API backend em **Node.js**, **Express**, **Prisma** e **PostgreSQL** para gestão de finanças pessoais: cadastro de usuários, autenticação JWT, transações (ganhos, despesas, investimentos) e cálculo de saldo.

Projeto de portfólio com arquitetura em camadas (controllers, use-cases, repositories, adapters), testes automatizados, CI/CD e documentação Swagger.

**Documentação interativa:** [https://finance-app-i600.onrender.com/docs/](https://finance-app-i600.onrender.com/docs/)

---

## ⚙️ Tecnologias

- Node.js + Express 5
- PostgreSQL + Prisma ORM
- JWT (access + refresh token)
- Zod (validação)
- Jest + Supertest
- Swagger UI
- Helmet + express-rate-limit + CORS restrito
- Docker Compose
- GitHub Actions + Render

---

## 🔐 Segurança

- Autenticação JWT com rotas protegidas via middleware `auth`
- Usuário autenticado acessa apenas recursos próprios (`/me`)
- Hash de senha com bcrypt — **password nunca retornado nas responses**
- Login com mensagem genérica (anti-enumeração de usuários)
- CORS restrito por `FRONTEND_URL` em produção
- Helmet para headers HTTP de segurança
- Rate limit global + rate limit reforçado em rotas de auth
- Delete de transações filtrado por `user_id` (403 se não for dono, 404 se não existir)
- Respostas padronizadas `{ success, message, data }` e erros `{ success, message, code }`

---

## 📦 Contrato da API

### Sucesso (200/201)

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Erro (4xx/5xx)

```json
{
  "success": false,
  "message": "Resource not found.",
  "code": "NOT_FOUND"
}
```

### Status HTTP comuns

| Status | Uso |
|--------|-----|
| 200 | Leitura/atualização com sucesso |
| 201 | Criação |
| 204 | Delete sem body |
| 400 | Validação |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Recurso inexistente |
| 409 | Conflito (ex.: e-mail duplicado) |
| 429 | Rate limit |

> **Breaking change:** versões anteriores retornavam o recurso diretamente no body. Agora os dados ficam em `data`.

---

## 🚀 Como Executar Localmente

### 1. Clonar e instalar

```bash
git clone https://github.com/vivianeaguiarc/finance-app.git
cd finance-app
npm install
```

### 2. Variáveis de ambiente

Crie um arquivo `.env` na raiz (use `env.example` como referência):

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/finance_app
JWT_ACCESS_SECRET=change_me_to_a_long_random_secret_at_least_32_chars
JWT_REFRESH_SECRET=change_me_to_another_long_random_secret_at_least_32_chars
FRONTEND_URL=http://localhost:5173
```

### 3. Banco de dados (Docker)

```bash
docker compose up -d postgres
```

### 4. Migrations Prisma

```bash
npx prisma migrate deploy
# ou em dev:
npx prisma migrate dev
```

### 5. Iniciar servidor

```bash
npm run dev
```

API disponível em `http://localhost:3000`  
Swagger em `http://localhost:3000/docs`

---

## 🧪 Testes

```bash
npm test
npm run test:ci
```

Requer PostgreSQL de teste (porta `5434` via `docker compose up -d postgres-test`) e `.env.test` com `DATABASE_URL` apontando para o banco de teste.

---

## ☁️ Deploy no Render

1. Criar Web Service apontando para este repositório
2. **Build Command:** `npm install && npx prisma migrate deploy`
3. **Start Command:** `npm start`
4. Configurar variáveis de ambiente:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL |
| `JWT_ACCESS_SECRET` | Segredo do access token (≥ 32 chars) |
| `JWT_REFRESH_SECRET` | Segredo do refresh token (≥ 32 chars) |
| `FRONTEND_URL` | URL do frontend (CORS em produção) |
| `NODE_ENV` | `production` |
| `PORT` | Definido automaticamente pelo Render |

O script `postinstall` executa `prisma generate` para garantir o Prisma Client no deploy.

---

## 📡 Autenticação

1. `POST /api/users` — registrar
2. `POST /api/users/login` — obter tokens
3. Enviar header: `Authorization: Bearer <accessToken>`
4. `POST /api/users/refresh-token` — renovar tokens

---

## 🧰 Scripts

| Comando | Descrição |
|---------|-----------|
| `npm start` | Produção |
| `npm run dev` | Desenvolvimento com `--watch` |
| `npm test` | Testes |
| `npm run test:ci` | Testes + coverage (CI) |
| `npm run migrations` | `prisma migrate deploy` |
| `npm run eslint:check` | ESLint |
| `npm run prettier:check` | Prettier |

---

## 🧱 Estrutura

```
src/
├── adapters/       # bcrypt, JWT, UUID
├── config/         # CORS
├── controllers/    # HTTP handlers
├── factories/      # Composition root
├── middlewares/    # auth, rate-limit, ensure-self
├── repositories/   # Prisma
├── routes/
├── schemas/        # Zod
└── use-cases/
prisma/
├── schema.prisma
└── migrations/
docs/swagger.json
```

---

## 👩‍💻 Autora

**Viviane Aguiar**  
📍 Juiz de Fora – MG, Brasil  
🔗 [LinkedIn](https://www.linkedin.com/in/vivianeaguiarc)

---

## 🏁 Licença

Projeto educacional e de portfólio. Sinta-se à vontade para clonar e estudar.
