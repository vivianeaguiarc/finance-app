Você é um profissional sênior especialista em Node.js, Express, Prisma, APIs REST, Clean Code e boas práticas de backend.

Vamos implementar a terceira etapa da auditoria do Finance App.

Objetivo:
Padronizar as respostas da API e o tratamento de erros para deixar o backend mais previsível, profissional e fácil de consumir pelo frontend.

Faça as seguintes melhorias:

1. Padronização de responses
- Revise os controllers.
- Padronize respostas de sucesso em formato consistente.
- Evite cada endpoint retornar estruturas diferentes sem necessidade.
- Sugestão de formato:
  {
    "success": true,
    "message": "Operação realizada com sucesso",
    "data": {}
  }

2. Padronização de erros
- Crie ou revise uma classe AppError.
- Garanta que erros tenham:
  - statusCode
  - message
  - code opcional
- Centralize o tratamento em um errorHandler global.

3. Prisma errors
- Trate erros comuns do Prisma:
  - P2002: registro duplicado
  - P2025: registro não encontrado
  - erros de validação
- Não exponha detalhes internos do Prisma ao usuário final.

4. Status HTTP
- Revise status codes:
  - 200 para sucesso comum
  - 201 para criação
  - 204 para delete sem body, se fizer sentido
  - 400 para dados inválidos
  - 401 para não autenticado
  - 403 para não autorizado
  - 404 para recurso inexistente
  - 409 para conflito, como e-mail duplicado
  - 429 para rate limit

5. Mensagens
- Padronize mensagens em português ou inglês, mas não misture sem necessidade.
- Use mensagens claras e profissionais.
- Evite mensagens técnicas demais para o cliente da API.

6. Testes
- Rode os testes existentes.
- Ajuste testes quebrados por causa do novo formato de response.
- Adicione testes simples para:
  - erro de registro duplicado;
  - recurso não encontrado;
  - acesso não autorizado;
  - erro inesperado retornando 500 sem stack trace.

7. Documentação
- Atualize Swagger/OpenAPI com o novo padrão de response.
- Atualize README se houver mudança relevante no contrato da API.

Ao final, explique:
- o que foi alterado;
- por que foi alterado;
- quais problemas foram corrigidos;
- quais testes foram executados;
- quais arquivos foram modificados;
- se houve breaking change no contrato da API.

Mensagem de commit sugerida:
refactor: standardize api responses and error handling