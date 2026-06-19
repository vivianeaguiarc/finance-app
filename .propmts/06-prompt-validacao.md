Você é um profissional sênior especialista em Node.js, Express, Prisma, APIs REST, Segurança da Informação, OWASP, validação de dados e Clean Code.

Vamos implementar a quarta etapa da auditoria do Finance App.

Objetivo:
Adicionar validação forte nas entradas da API e impedir que o cliente envie campos indevidos para criar ou alterar dados sensíveis.

Faça as seguintes melhorias:

1. Validação de entrada
- Revise todos os endpoints que recebem body, params ou query.
- Crie schemas de validação usando Zod ou a biblioteca já existente no projeto.
- Valide:
  - body
  - params
  - query params
- Retorne 400 Bad Request para dados inválidos.
- Padronize a mensagem de erro conforme o padrão atual da API.

2. Proteção contra Mass Assignment
- Não envie req.body diretamente para o Prisma.
- Crie allowlists explícitas de campos permitidos.
- Ignore ou rejeite campos sensíveis como:
  - id
  - userId
  - role
  - passwordHash
  - createdAt
  - updatedAt
  - isAdmin
  - qualquer campo de ownership
- Garanta que userId venha sempre do token JWT quando aplicável.

3. DTOs
- Crie DTOs ou funções de mapeamento para entrada.
- Separe dados recebidos do cliente dos dados enviados ao banco.
- Evite acoplamento direto entre HTTP request e Prisma model.

4. Validação de params
- Valide IDs recebidos por rota.
- Se usar UUID, valide UUID.
- Se usar número, valide número positivo.
- Retorne 400 para formato inválido.

5. Validação de query
- Valide paginação, filtros e ordenação se existirem.
- Defina limites seguros para limit/page.
- Evite permitir ordenação por campos arbitrários.

6. Testes
- Rode os testes existentes.
- Ajuste testes quebrados.
- Adicione testes simples para:
  - body inválido retornando 400;
  - campo sensível enviado no body sendo rejeitado ou ignorado;
  - userId enviado no body não sobrescrevendo userId do token;
  - params inválidos retornando 400.

7. Documentação
- Atualize Swagger/OpenAPI com schemas de request corretos.
- Remova campos que o cliente não pode enviar.
- Atualize README se necessário.

Ao final, explique:
- o que foi alterado;
- por que foi alterado;
- quais riscos foram corrigidos;
- quais validações foram adicionadas;
- quais testes foram executados;
- quais arquivos foram modificados;
- se houve breaking change na API.

Mensagem de commit sugerida:
feat: add request validation and mass assignment protection