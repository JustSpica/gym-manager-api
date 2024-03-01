import { PrismaUsersRepository } from "@/repositores/prisma/prisma-users.repository";

import { RegisterUserUseCase } from "../register-user";

export function makeRegisterUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const registerUserUseCase = new RegisterUserUseCase(usersRepository);

  return registerUserUseCase;
}
