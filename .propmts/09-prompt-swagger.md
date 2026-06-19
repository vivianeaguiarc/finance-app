Você é um profissional sênior especialista em Node.js, Express, Swagger/OpenAPI, documentação de APIs REST, DX e boas práticas de backend.

Vamos implementar a sétima etapa da auditoria do Finance App.

Objetivo:
Transformar a documentação Swagger/OpenAPI em uma documentação profissional, clara e útil para recrutadores, devs e consumidores da API.

Faça as seguintes melhorias:

1. Revisar Swagger atual
- Corrija schemas desatualizados.
- Remova qualquer campo sensível como password, passwordHash, refreshTokenHash ou tokens internos.
- Garanta que User público nunca exponha dados sensíveis.

2. Padronizar schemas
- Criar schemas reutilizáveis para:
  - SuccessResponse
  - ErrorResponse
  - AuthResponse
  - UserResponse
  - TransactionResponse
  - PaginatedResponse
  - PaginationMeta

3. Exemplos reais
- Adicione exemplos de request e response para:
  - cadastro
  - login
  - refresh token, se existir
  - criação de transação
  - listagem paginada
  - filtros
  - atualização
  - delete
  - erros 400, 401, 403, 404, 409 e 429

4. Segurança
- Configure bearerAuth no Swagger.
- Garanta que rotas protegidas estejam marcadas com security.
- Documente claramente que o token deve ser enviado como:
  Authorization: Bearer <token>

5. Query params
- Documente paginação:
  - page
  - limit
- Documente filtros:
  - type
  - categoryId
  - startDate
  - endDate
  - minAmount
  - maxAmount
- Documente ordenação:
  - sortBy
  - order

6. Organização
- Agrupe endpoints por tags:
  - Auth
  - Users
  - Transactions
  - Categories
  - Health
- Melhore descrições dos endpoints.
- Use summaries curtos e descriptions claras.

7. DX e portfólio
- A documentação deve demonstrar domínio técnico.
- Evite documentação genérica.
- Mostre que a API possui autenticação, segurança, paginação, validação e tratamento de erros.
- Garanta que /docs continue funcionando localmente e no Render.

8. README
- Atualize README com link da documentação Swagger.
- Adicione seção "API Documentation".
- Explique brevemente como autenticar e testar endpoints protegidos via Swagger.

9. Validação
- Rode a aplicação localmente.
- Verifique se /docs abre sem erro.
- Se houver testes relacionados ao Swagger, rode-os.

Ao final, explique:
- o que foi alterado;
- quais schemas foram criados ou ajustados;
- quais exemplos foram adicionados;
- quais campos sensíveis foram removidos;
- como testar a documentação;
- quais arquivos foram modificados.

Mensagem de commit sugerida:
docs: improve swagger api documentation