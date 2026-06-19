Você é um profissional sênior especialista em Node.js, Express, Segurança da Informação, OWASP, APIs REST e hardening de aplicações backend.

Vamos implementar a segunda etapa crítica da auditoria do Finance App.

Objetivo:
Aplicar hardening básico de segurança na API, protegendo melhor o backend contra abuso, exposição desnecessária e configurações inseguras em produção.

Faça as seguintes correções:

1. CORS seguro
- Remova qualquer app.use(cors()) aberto em produção.
- Configure CORS usando a variável de ambiente FRONTEND_URL.
- Em production, permita apenas a origem definida em FRONTEND_URL.
- Em development, permita localhost nas portas comuns do frontend, como 3000, 3001, 5173 e 5174.
- Garanta suporte a credentials se o projeto usar cookies ou refresh token em cookie.
- Retorne erro claro para origem não permitida.

2. Helmet
- Instale e configure helmet.
- Aplique headers básicos de segurança globalmente.
- Garanta que a rota /docs continue funcionando corretamente.
- Se necessário, ajuste contentSecurityPolicy para não quebrar o Swagger UI.

3. Rate Limit
- Instale e configure express-rate-limit.
- Crie um rate limit global moderado para a API.
- Crie um rate limit mais restritivo para rotas de autenticação, como login, register e refresh token.
- Retorne status 429 com mensagem padronizada.
- Não aplique rate limit excessivo que atrapalhe testes locais.

4. Tratamento de erros em produção
- Verifique se stack traces não são expostos em production.
- Padronize mensagens de erro quando possível.
- Preserve logs internos no console apenas quando necessário.

5. Variáveis de ambiente
- Atualize .env.example com FRONTEND_URL, NODE_ENV e demais variáveis necessárias.
- Use placeholders seguros, sem credenciais reais.

6. Testes
- Rode os testes existentes.
- Corrija testes quebrados.
- Adicione testes simples, se necessário, para:
  - CORS permitido em ambiente de desenvolvimento;
  - CORS bloqueado para origem não autorizada;
  - rate limit retornando 429 em rotas sensíveis;
  - Swagger não quebrando com helmet.

Ao final, explique:
- o que foi alterado;
- por que foi alterado;
- quais riscos foram reduzidos;
- quais testes foram executados;
- quais arquivos foram modificados;
- se existe algum cuidado para configurar no Render.

Mensagem de commit sugerida:
chore: add security hardening middlewares