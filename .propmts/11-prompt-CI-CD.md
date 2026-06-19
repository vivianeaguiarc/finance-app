Você é um profissional sênior especialista em DevOps, GitHub Actions, CI/CD, Node.js, Prisma, testes automatizados e qualidade de software.

Vamos implementar a décima etapa da evolução do Finance App.

Objetivo:
Transformar o projeto em um case profissional com pipeline automatizada de qualidade, validação e deploy.

Faça as seguintes melhorias:

1. Revisão da pipeline atual
- Analise os workflows existentes.
- Identifique validações ausentes.
- Garanta que a pipeline falhe quando houver problemas de qualidade.

2. Qualidade de código
Adicionar etapas para:

- npm ci
- lint
- typecheck
- testes unitários
- testes de integração
- build da aplicação

Nenhuma PR deve ser aprovada se alguma etapa falhar.

3. Cobertura de testes
- Adicione geração de coverage.
- Configure relatório de cobertura.
- Exiba percentual final nos logs.

4. Segurança
- Adicione npm audit na pipeline.
- Identifique dependências vulneráveis.
- Configure falha apenas para vulnerabilidades High e Critical.

5. Prisma
- Validar schema Prisma na pipeline.
- Executar:
  prisma validate
  prisma generate

6. Pull Requests
- Workflow deve executar em:
  - pull_request
  - push para main
  - push para develop

7. Branch Protection (documentação)
Documente no README:

- main protegida
- PR obrigatório
- checks obrigatórios

8. Badges
Adicionar badges no README:

- Build
- Testes
- Coverage
- Node.js
- Prisma

9. Estrutura profissional
Verifique:

- ESLint
- Prettier
- Husky
- lint-staged

Caso algo esteja faltando, configure.

10. Documentação
Atualize README explicando:

- pipeline CI/CD
- estratégia de branches
- qualidade de código
- testes automatizados

11. Validação final
Rode a pipeline localmente.
Garanta que todos os checks passem.

Ao final, explique:

- o que foi configurado;
- quais workflows foram criados;
- quais validações existem agora;
- qual cobertura de testes foi encontrada;
- quais arquivos foram modificados;
- quais próximos passos de DevOps seriam recomendados.

Mensagem de commit sugerida:
ci: improve pipeline quality and automation