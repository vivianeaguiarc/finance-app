Você é um profissional sênior especialista em documentação técnica, backend Node.js, APIs REST, Prisma, PostgreSQL, segurança de aplicações e posicionamento de projetos para portfólio.

Vamos melhorar o README do Finance App para que ele funcione como um case técnico profissional para recrutadores e Tech Leads.

Objetivo:
Transformar o README em uma apresentação clara do projeto, mostrando arquitetura, segurança, regras de negócio, endpoints, testes, deploy e diferenciais técnicos.

Inclua ou melhore as seguintes seções:

1. Visão geral do projeto
- Explique o que é o Finance App.
- Destaque que é uma API REST para gestão financeira pessoal.
- Explique o problema que o projeto resolve.

2. Funcionalidades
Inclua funcionalidades como:
- cadastro e autenticação de usuários;
- login com JWT;
- refresh token, se existir;
- gestão de transações financeiras;
- categorias;
- filtros;
- paginação;
- documentação Swagger;
- segurança com Helmet, CORS e Rate Limit;
- validação de dados;
- tratamento padronizado de erros.

3. Tecnologias utilizadas
Liste:
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- Swagger/OpenAPI
- Docker, se existir
- Vitest/Jest/Supertest, se existir
- Render
- demais libs relevantes

4. Arquitetura
- Explique a estrutura de pastas.
- Mostre fluxo:
  Request → Route → Middleware → Controller → Service/Repository → Prisma → Database
- Explique brevemente a separação de responsabilidades.

5. Segurança
Explique as práticas aplicadas:
- autenticação JWT;
- controle de acesso por usuário autenticado;
- proteção contra Broken Access Control;
- CORS restrito;
- Helmet;
- Rate Limit;
- proteção contra Mass Assignment;
- não exposição de password/hash;
- variáveis de ambiente seguras.

6. Documentação da API
- Adicione link para Swagger local:
  http://localhost:3000/docs
- Adicione link para Swagger em produção:
  https://finance-app-i600.onrender.com/docs
- Explique como usar o Bearer Token no Swagger.

7. Como rodar localmente
Inclua:
- clonar repositório;
- instalar dependências;
- configurar .env;
- rodar Prisma generate;
- rodar migrations;
- iniciar aplicação.

8. Variáveis de ambiente
Use placeholders seguros.
Não inclua nenhuma credencial real.

9. Testes
- Explique como rodar os testes.
- Mostre comando npm test.
- Explique o que está coberto pelos testes.

10. Deploy
- Explique que o deploy está no Render.
- Cite cuidados com DATABASE_URL, PORT e prisma generate.

11. Prints ou exemplos
- Adicione exemplos de request/response importantes.
- Se fizer sentido, adicione badges simples de status, Node.js, Prisma e PostgreSQL.

12. Diferenciais técnicos
Crie uma seção destacando conceitos que chamam atenção de recrutadores:
- API REST segura;
- autenticação e autorização;
- validação de entrada;
- paginação e filtros;
- tratamento de erros;
- documentação OpenAPI;
- deploy em produção;
- boas práticas OWASP.

13. Roadmap
Inclua próximos passos:
- CI/CD mais robusto;
- cobertura de testes;
- observabilidade/logs estruturados;
- refresh token rotation, se ainda não existir;
- Docker Compose, se ainda não existir;
- frontend integrado.

Ao final, explique:
- o que foi alterado no README;
- quais seções foram criadas;
- quais informações antigas foram removidas;
- como o README agora ajuda recrutadores;
- quais arquivos foram modificados.

Mensagem de commit sugerida:
docs: improve project readme for portfolio