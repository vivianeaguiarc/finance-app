Vamos implementar as Correções Críticas P0 da auditoria do Finance App.

Contexto:
O projeto é uma API Node.js com Prisma/PostgreSQL, JWT, Swagger e deploy no Render. O objetivo é corrigir riscos reais de segurança e deixar o projeto mais profissional para portfólio.

Implemente em sequência, com pequenas alterações seguras:

1. Broken Access Control
- Revise rotas que recebem userId via params.
- Garanta que um usuário autenticado só possa acessar, alterar ou deletar os próprios dados.
- Sempre compare o userId do token JWT com o dono do recurso.
- Se houver tentativa de acesso indevido, retornar 403 Forbidden.
- Evite confiar em userId vindo do body ou params quando o usuário autenticado já está no token.

2. Vazamento de senha/hash
- Garanta que password/hash nunca seja retornado em responses.
- Ajuste services, controllers e DTOs/responses.
- Remova password/hash do Swagger schema público de User.
- Se necessário, crie uma função sanitizeUser(user).

3. Delete seguro
- Revise endpoints de delete.
- Garanta que o usuário só consiga deletar recursos próprios.
- Retorne 404 quando o recurso não existir.
- Retorne 403 quando o recurso existir, mas não pertencer ao usuário autenticado.
- Evite deletes sem filtro por ownerId/userId.

4. Render PORT
- Ajuste index.js/server.js para usar process.env.PORT || 3000.
- Garanta que o app funcione localmente e no Render.

5. CORS seguro
- Configure CORS usando variável FRONTEND_URL.
- Em development, permitir localhost.
- Em production, permitir apenas origem definida em FRONTEND_URL.
- Evitar app.use(cors()) aberto em produção.

6. Hardening básico
- Adicionar helmet.
- Adicionar rate limit nas rotas de auth.
- Adicionar rate limit global moderado se fizer sentido.
- Garantir mensagens de erro sem stack trace em produção.

7. Prisma/Deploy
- Verifique se package.json possui postinstall com prisma generate.
- Garanta que o deploy não falhe por Prisma Client não gerado.

8. Testes
- Criar ou ajustar testes para:
  - usuário não acessar recurso de outro usuário;
  - responses não retornarem password/hash;
  - delete protegido por owner;
  - CORS/config não quebrar ambiente local;
  - auth rate limit se possível.

9. Documentação
- Atualize Swagger conforme mudanças.
- Atualize README com:
  - variáveis de ambiente corretas;
  - segurança aplicada;
  - como rodar localmente;
  - deploy no Render.

Regras:
- Não faça refatoração grande ainda.
- Não mude regra de negócio sem necessidade.
- Preserve a arquitetura atual.
- Faça alterações pequenas, claras e seguras.
- Ao final, rode testes e informe quais arquivos foram alterados.
- Sugira uma mensagem de commit semântico.