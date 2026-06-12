# 💰 FinanceApp – API de Controle Financeiro Pessoal

## 🧩 Visão Geral
O **FinanceApp** é uma aplicação backend desenvolvida em **Node.js** com **Express** e **PostgreSQL**, voltada para o **gerenciamento de finanças pessoais**.  
A API permite o **cadastro de usuários**, **registro de transações financeiras** (ganhos, despesas e investimentos) e **armazenamento seguro** dos dados em um banco relacional.

Este projeto faz parte do portfólio de **Viviane Aguiar**, com foco em **boas práticas de arquitetura backend**, **integração com banco de dados via Docker** e **padronização de código com ESLint + Prettier + Husky**.

---

## ⚙️ Tecnologias Utilizadas
- **Node.js** – Ambiente de execução JavaScript no servidor  
- **Express** – Framework minimalista para construção da API  
- **PostgreSQL** – Banco de dados relacional robusto  
- **Docker** – Containerização e ambiente isolado do banco  
- **Dotenv** – Gerenciamento de variáveis de ambiente  
- **ESLint + Prettier + Husky + Lint-Staged** – Qualidade e padronização de código  
- **pg** – Biblioteca de conexão com PostgreSQL  

---

## 🗄️ Estrutura do Banco de Dados
A estrutura inicial é criada via migrações automatizadas (`exec.js`):

### Tabelas
- **users**
  - `id` (UUID, PK)  
  - `first_name`, `last_name`, `email`, `password`

- **transactions**
  - `id` (UUID, PK)  
  - `user_id` (FK → users)  
  - `name`, `date`, `amount`, `type` (`EARNING`, `EXPENSE`, `INVESTMENT`)

### Tipo ENUM
- `transaction_type`: Define o tipo de transação (EARNING | EXPENSE | INVESTMENT)

---

## 🚀 Como Executar o Projeto

### 1️⃣ Clonar o Repositório
```bash
git clone https://github.com/vivianeaguiarc/financeapp.git
cd financeapp
```

### 2️⃣ Instalar Dependências
```bash
npm install
```

### 3️⃣ Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com:

```env
POSTGRES_USER=root
POSTGRES_PASSWORD=password
POSTGRES_DB=financeapp
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
PORT=3000
```

### 4️⃣ Iniciar o Banco com Docker
```bash
docker run -d ^
  --name finance-app-postgres ^
  -e POSTGRES_USER=root ^
  -e POSTGRES_PASSWORD=password ^
  -e POSTGRES_DB=financeapp ^
  -v "C:\workspaces\financeapp\.postgres:/var/lib/postgresql/data/pgdata" ^
  -p 5432:5432 ^
  postgres:16
```

### 5️⃣ Rodar as Migrações
```bash
npm run migrations
```

### 6️⃣ Iniciar o Servidor
```bash
npm run start:dev
```

A aplicação estará disponível em:
```
http://localhost:3000
```
https://finance-app-i600.onrender.com/docs/
---

## 🧠 Funcionalidades Principais
- Cadastro de usuários  
- Registro e listagem de transações financeiras  
- Categorização de transações (ganho, despesa, investimento)  
- Persistência de dados com PostgreSQL  
- Execução automatizada de migrações  

---

## 🧰 Scripts Disponíveis
| Comando | Descrição |
|----------|------------|
| `npm run start` | Inicia o servidor em modo produção |
| `npm run start:dev` | Inicia o servidor com monitoramento automático (`--watch`) |
| `npm run lint` | Executa verificação de estilo com ESLint |
| `npm run migrations` | Executa as migrações do banco de dados |

---

## 🧱 Estrutura de Pastas
```
src/
 ├── controllers/        # Controladores da API
 ├── db/
 │    ├── postgres/
 │    │    ├── migrations/  # Scripts SQL e exec.js
 │    │    └── helper.js    # Conexão com o banco
 ├── use-cases/          # Casos de uso da aplicação
 ├── helpers/            # Funções utilitárias
 └── index.js            # Ponto de entrada do servidor
```

---

## 👩‍💻 Autora
**Viviane Aguiar**  
Fullstack Developer | Especialista em Arquitetura de Software  

📍 Juiz de Fora – MG, Brasil  
🔗 [LinkedIn](https://www.linkedin.com/in/vivianeaguiarc)  
📧 vivianeaguiarc@outlook.com  

---

## 🏁 Licença
Este projeto foi desenvolvido para fins educacionais e demonstração de portfólio.  
Sinta-se à vontade para clonar, estudar e adaptar conforme suas necessidades.

---
