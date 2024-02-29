import { FastifyInstance } from "fastify";

import { registerUser } from "./controllers/register-user.controller";
import { authenticateUser } from "./controllers/authenticate-user.controller";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", registerUser);
  app.post("/sessions", authenticateUser);
}
