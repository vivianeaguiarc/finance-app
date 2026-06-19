Você é um profissional sênior especialista em Node.js, Express, Prisma, PostgreSQL, Segurança da Informação, OWASP e APIs REST.

Vamos implementar a primeira etapa crítica da auditoria do Finance App.

Objetivo:
Corrigir problemas de segurança e deploy que impedem o projeto de parecer pronto para produção.

Faça as seguintes correções:

1. Broken Access Control
- Revise todas as rotas protegidas que recebem userId por params ou body.
- Garanta que o usuário autenticado pelo JWT só consiga acessar, editar ou deletar os próprios dados.
- Não confie em userId vindo do frontend quando o userId já existe no token.
- Para acesso indevido, retorne 403 Forbidden.
- Para recurso inexistente, retorne 404 Not Found.

2. Vazamento de senha/hash
- Garanta que password, passwordHash ou qualquer hash de senha nunca seja retornado em nenhuma response.
- Crie uma função utilitária sanitizeUser(user), se fizer sentido.
- Ajuste controllers/services para retornar usuário sem senha.
- Remova password/hash do schema público de User no Swagger.

3. Delete seguro
- Revise endpoints DELETE.
- Nenhum delete deve acontecer sem validar ownership.
- Use filtros com userId/ownerId quando necessário.

4. Deploy Render
- Ajuste o servidor para usar process.env.PORT || 3000.
- Verifique se package.json possui:
  "postinstall": "prisma generate"
- Garanta que npm start funcione após o deploy.

5. Validação
- Rode os testes existentes.
- Corrija testes quebrados.
- Adicione testes simples se necessário para:
  - impedir usuário acessar recurso de outro usuário;
  - garantir que password/hash não aparece nas respostas;
  - garantir delete protegido.

Ao final, explique:
- o que foi alterado;
- por que foi alterado;
- quais riscos foram corrigidos;
- quais testes foram executados;
- quais arquivos foram modificados.

Mensagem de commit sugerida:
fix: harden access control and deploy config