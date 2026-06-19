Você é um profissional sênior especialista em Node.js, Express, Prisma, PostgreSQL, Vitest/Jest, Supertest, testes de integração e qualidade de software.

Vamos implementar a sexta etapa da auditoria do Finance App.

Objetivo:
Aumentar a confiabilidade do backend criando testes de integração para os principais fluxos da API, simulando o comportamento real de um usuário autenticado.

Faça as seguintes melhorias:

1. Estrutura de testes
- Revise a configuração atual de testes.
- Garanta que os testes de integração usem um banco isolado de teste.
- Evite usar banco de produção ou desenvolvimento real.
- Configure setup/teardown para limpar dados entre testes.

2. Fluxo de autenticação
Crie testes para:
- cadastro de usuário;
- login com credenciais válidas;
- login com credenciais inválidas;
- refresh token, se existir;
- acesso a rota protegida sem token;
- acesso a rota protegida com token válido.

3. Fluxo financeiro principal
Crie testes para:
- criar transação/lançamento financeiro;
- listar apenas transações do usuário autenticado;
- buscar transação por id;
- atualizar transação própria;
- bloquear atualização de transação de outro usuário;
- deletar transação própria;
- bloquear delete de transação de outro usuário.

4. Validação e segurança
Crie testes para:
- body inválido retornando 400;
- campos sensíveis no body sendo ignorados ou rejeitados;
- userId enviado no body não sobrescrevendo o userId do token;
- response não retornar password/passwordHash;
- erro de token inválido retornando 401.

5. Paginação e filtros
Crie testes para:
- paginação padrão;
- limit máximo;
- filtro por type;
- filtro por categoryId;
- filtro por período;
- ordenação válida;
- bloqueio de ordenação inválida.

6. Boas práticas
- Use factories ou helpers para criar usuários e transações.
- Evite repetição excessiva nos testes.
- Nomeie os testes de forma clara.
- Garanta que os testes possam rodar com npm test.

7. Documentação
- Atualize README com instrução para rodar testes.
- Documente variáveis de ambiente necessárias para ambiente de teste.

Ao final, explique:
- quais testes foram criados;
- quais fluxos foram cobertos;
- como rodar os testes;
- quais arquivos foram modificados;
- se existe alguma limitação atual;
- qual cobertura ainda falta melhorar.

Mensagem de commit sugerida:
test: add integration tests for critical api flows