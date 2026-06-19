Você é um Arquiteto de Software Sênior, especialista em Node.js, Segurança da Informação, OWASP, Prisma, PostgreSQL, APIs REST, Clean Code e Engenharia de Software.

Realize uma auditoria técnica completa do projeto Finance App.

Objetivo:
Transformar este projeto em um case de portfólio profissional, com qualidade próxima a aplicações utilizadas em produção.

Analise detalhadamente:

# Segurança

- Verifique possíveis vulnerabilidades OWASP Top 10.
- Procure vazamento de segredos, senhas, tokens ou credenciais.
- Analise JWT, Refresh Token e autenticação.
- Verifique exposição de dados sensíveis.
- Avalie middleware de autenticação.
- Avalie autorização e controle de acesso.
- Verifique proteção contra:
  - SQL Injection
  - Mass Assignment
  - Broken Access Control
  - Rate Limiting ausente
  - CORS inadequado
  - Headers de segurança ausentes
  - Enumeração de usuários
  - Vazamento de stack traces

# Arquitetura

- Avalie estrutura de pastas.
- Verifique separação de responsabilidades.
- Identifique violações de SOLID.
- Identifique acoplamentos desnecessários.
- Avalie escalabilidade da arquitetura.
- Sugira melhorias inspiradas em Clean Architecture e Arquitetura Hexagonal.

# Banco de Dados

- Analise schema Prisma.
- Procure relacionamentos incorretos.
- Verifique índices ausentes.
- Verifique constraints.
- Procure campos que deveriam ser únicos.
- Avalie integridade referencial.
- Avalie consistência de migrations.

# API REST

- Verifique se os endpoints seguem boas práticas REST.
- Analise códigos HTTP retornados.
- Procure inconsistências de nomenclatura.
- Avalie padronização das respostas.
- Avalie tratamento de erros.

# Qualidade de Código

- Procure código duplicado.
- Identifique funções muito grandes.
- Procure arquivos com responsabilidades excessivas.
- Verifique uso adequado de async/await.
- Procure possíveis memory leaks.
- Procure pontos de refatoração.

# Performance

- Identifique consultas ineficientes.
- Procure N+1 Queries.
- Avalie uso do Prisma.
- Procure oportunidades de cache.
- Verifique paginação.

# DevOps

- Analise package.json.
- Analise scripts.
- Verifique processo de deploy.
- Verifique compatibilidade com Render.
- Verifique se prisma generate está corretamente configurado.
- Verifique uso correto da variável PORT.

# Testes

- Identifique áreas sem cobertura.
- Sugira testes unitários.
- Sugira testes de integração.
- Sugira testes E2E.

# Documentação

- Avalie README.
- Avalie Swagger/OpenAPI.
- Verifique exemplos de uso.
- Verifique documentação de autenticação.

# Portfólio

Avalie o projeto como se fosse um Tech Lead analisando o GitHub de uma candidata para vaga de Desenvolvedora Backend/Fullstack Júnior.

Informe:

1. Pontos fortes.
2. Pontos fracos.
3. O que impressionaria recrutadores.
4. O que ainda denuncia falta de experiência.
5. Nota de 0 a 10 para:
   - Arquitetura
   - Segurança
   - Código
   - Banco de Dados
   - Testes
   - Documentação
   - Deploy
6. Nível estimado do projeto:
   - Estágio
   - Júnior
   - Júnior Forte
   - Pleno
   - Pleno Forte

Ao final gere:

# Correções Críticas
(itens que devem ser corrigidos imediatamente)

# Melhorias de Curto Prazo
(itens que aumentam a qualidade do projeto)

# Melhorias de Portfólio
(itens que chamam atenção de recrutadores)

# Roadmap de Evolução
(lista priorizada do que implementar nas próximas versões)

Para cada problema encontrado:
- explique o motivo;
- mostre o risco;
- mostre a solução recomendada;
- mostre exemplos de código quando necessário.