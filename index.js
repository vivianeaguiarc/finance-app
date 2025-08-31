// index.js (raiz do app)
import 'dotenv/config';
import express from 'express';

import {
  CreateUserController,
  GetUserByIdController,
  UpdateUserController,
  DeleteUserController,
} from './src/controllers/index.js';

import { GetUserByIdUseCase } from './src/use-cases/index.js';
import { PostgresGetUserByIdRepository } from './src/repositories/postgres/index.js';

const app = express();
app.use(express.json());

// GET /api/users/:userId (com DI)
app.get('/api/users/:userId', async (request, response) => {
  const repo = new PostgresGetUserByIdRepository();
  const useCase = new GetUserByIdUseCase(repo);
  const controller = new GetUserByIdController(useCase);

  const { statusCode, body } = await controller.execute(request);
  response.status(statusCode).send(body);
});

// POST /api/users
app.post('/api/users', async (request, response) => {
  const controller = new CreateUserController();
  const { statusCode, body } = await controller.execute(request);
  response.status(statusCode).send(body);
});

// PATCH /api/users/:userId
app.patch('/api/users/:userId', async (request, response) => {
  const controller = new UpdateUserController();
  const { statusCode, body } = await controller.execute(request);
  response.status(statusCode).send(body);
});

// DELETE /api/users/:userId
app.delete('/api/users/:userId', async (request, response) => {
  const controller = new DeleteUserController();
  const { statusCode, body } = await controller.execute(request);
  response.status(statusCode).send(body);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
