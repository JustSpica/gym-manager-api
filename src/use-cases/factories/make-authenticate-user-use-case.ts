import { PrismaUsersRepository } from "@/repositores/prisma/prisma-users.repository";

import { AuthenticateUserUseCase } from "../authenticate-user";

export function makeAuthenticateUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);

  return authenticateUserUseCase;
}
