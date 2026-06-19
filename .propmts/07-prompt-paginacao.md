Você é um profissional sênior especialista em Node.js, Express, Prisma, PostgreSQL, performance de APIs REST, modelagem de dados e boas práticas de backend.

Vamos implementar a quinta etapa da auditoria do Finance App.

Objetivo:
Melhorar performance, escalabilidade e experiência de consumo da API adicionando paginação, filtros seguros e consultas Prisma mais eficientes.

Faça as seguintes melhorias:

1. Paginação
- Revise endpoints de listagem.
- Adicione paginação onde ainda não existir.
- Use parâmetros:
  - page
  - limit
- Defina valores padrão seguros:
  - page = 1
  - limit = 10
- Defina limite máximo, por exemplo:
  - max limit = 100
- Retorne metadados:
  {
    "data": [],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }

2. Filtros seguros
- Adicione filtros úteis conforme o domínio financeiro, como:
  - type
  - categoryId
  - startDate
  - endDate
  - minAmount
  - maxAmount
- Valide todos os filtros.
- Não permita filtros arbitrários vindos diretamente do cliente.
- Não permita orderBy dinâmico sem allowlist.

3. Ordenação segura
- Permita ordenação apenas por campos autorizados.
- Exemplo:
  - createdAt
  - date
  - amount
- Permita direction apenas:
  - asc
  - desc

4. Performance Prisma
- Evite buscar campos desnecessários.
- Use select quando possível.
- Evite include excessivo.
- Verifique possíveis consultas N+1.
- Use transaction quando precisar buscar dados e total na mesma operação:
  - findMany
  - count

5. Segurança de ownership
- Todos os filtros e listagens devem respeitar o userId do usuário autenticado.
- Nenhuma listagem deve retornar dados de outro usuário.

6. Testes
- Rode os testes existentes.
- Ajuste testes quebrados.
- Adicione testes simples para:
  - paginação padrão;
  - limite máximo de limit;
  - filtro por período;
  - filtro por tipo;
  - ordenação válida;
  - bloqueio de ordenação inválida;
  - listagem não retornar dados de outro usuário.

7. Documentação
- Atualize Swagger/OpenAPI com query params.
- Atualize README com exemplos de listagem paginada e filtros.

Ao final, explique:
- o que foi alterado;
- por que foi alterado;
- quais endpoints receberam paginação;
- quais filtros foram adicionados;
- quais consultas Prisma foram otimizadas;
- quais testes foram executados;
- quais arquivos foram modificados;
- se houve breaking change na API.

Mensagem de commit sugerida:
feat: add pagination filters and query optimization