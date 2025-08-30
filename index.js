// index.js (raiz do app)
import 'dotenv/config';
import express from 'express';
import {
  CreateUserController,
  GetUserByIdController,
  UpdateUserController,
  DeleteUserController
} from './src/controllers/index.js'; // <- note o /index.js

const app = express();
app.use(express.json());

app.get('/api/users/:userId', async (req, res) => {
  const controller = new GetUserByIdController();
  const { statusCode, body } = await controller.execute(req);
  res.status(statusCode).send(body);
});

app.post('/api/users', async (req, res) => {
  const controller = new CreateUserController();
  const { statusCode, body } = await controller.execute(req);
  res.status(statusCode).send(body);
});

app.patch('/api/users/:userId', async (req, res) => {
  const controller = new UpdateUserController();
  const { statusCode, body } = await controller.execute(req);
  res.status(statusCode).send(body);
});

app.delete('/api/users/:userId', async (req, res) => {
  const controller = new DeleteUserController();
  const { statusCode, body } = await controller.execute(req);
  res.status(statusCode).send(body);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
