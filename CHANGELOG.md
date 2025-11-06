# 🧾 Changelog — FinanceApp

> Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)  
> Este projeto segue o versionamento semântico [SemVer](https://semver.org/lang/pt-BR/).

---

## [v1.3.0] — 2025-11-06
### 🔧 Refatoração Arquitetural (Adapters + SOLID)
#### 🧩 Adicionado
- **PasswordHasherAdapter (bcrypt)** em `src/adapters/bcrypt/bcrypt-adapter.js`  
  → Implementa o padrão **Adapter** para abstrair o hash de senhas.
- **Adapters Index** em `src/adapters/index.js` para exportação centralizada (`PasswordHasherAdapter`).
- **Documentação técnica:** `docs/architecture/create-user-flow.md` com diagrama de sequência e explicação dos padrões usados.
- **Novos testes unitários:**  
  - `CreateUserUseCase.test.js`: cobre cenários de sucesso, erro e e-mail duplicado.  
  - `CreateUserController.test.js`: valida respostas 201, 400 e 500.

#### 🔁 Alterado
- `CreateUserUseCase` agora usa **Injeção de Dependência (DIP)** para receber repositórios e o adapter de hash.  
- `makeCreateUserController` atualizado para instanciar e injetar o `PasswordHasherAdapter`.  
- **Cobertura Jest:** adicionados `coveragePathIgnorePatterns` para ignorar helpers obsoletos.

#### 🧹 Removido
- **Helpers legados** não utilizados:
  - `src/controllers/helpers/user.js`
  - `src/controllers/helpers/transaction.js`
- Funções duplicadas de formatação e validação substituídas por lógica nos use cases e adapters.

---

## [v1.2.0] — 2025-10-30
### 🧱 CRUD de Transactions
- Implementados endpoints completos (`create`, `update`, `get`, `delete`) para `transactions`.
- Criado tipo ENUM `transaction_type` (`EARNING`, `EXPENSE`, `INVESTMENT`) no banco Postgres.
- Integrado `PostgresHelper` para conexão e persistência segura.

---

## [v1.1.0] — 2025-10-23
### 👤 CRUD de Usuários
- Criados controllers, use cases e repositórios para usuários (`create`, `update`, `delete`, `get`).
- Implementada verificação de e-mail duplicado (`EmailAlreadyInUseError`).
- Adicionados testes unitários e integração com Postgres.

---

## [v1.0.0] — 2025-10-15
### 🚀 Primeira versão funcional
- Estrutura inicial do projeto **FinanceApp**.
- Configuração do ambiente Node.js + PostgreSQL + Docker.
- Setup de ESLint, Prettier, Husky, CommitLint e Jest.
- Implementação inicial de arquitetura em camadas:
  - `controllers`
  - `use-cases`
  - `repositories`
  - `errors`
  - `helpers`

---

### ✍️ Autor
**Viviane Aguiar Silva Simões**  
Engenharia de Software — UNIASSELVI  
GitHub: [vivianeaguiarc](https://github.com/vivianeaguiarc)  
LinkedIn: [Viviane Aguiar](https://www.linkedin.com/in/vivianeaguiar/)  
Data de atualização: **Novembro/2025**
