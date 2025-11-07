import { createServer, IncomingMessage, ServerResponse } from "http";
import { UsersController } from "./controllers/usersController";

const usersController = new UsersController();

export const app = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }
  await usersController.handleRequest(req, res);
})