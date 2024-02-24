import { FastifyReply, FastifyRequest } from "fastify";
import * as zod from "zod";

import { UserAlreadyExistError } from "@/use-cases/errors/user-already-exist.error";
import { RegisterUserUseCase } from "@/use-cases/register-user";

import { PrismaUsersRepository } from "@/repositores/prisma/prisma-users.repository";

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(6),
  });

  const { email, name, password } = registerBodySchema.parse(request.body);

  try {
    const pismaUsersRepository = new PrismaUsersRepository();
    const registerUserUseCase = new RegisterUserUseCase(pismaUsersRepository);

    await registerUserUseCase.execute({ email, name, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(201).send();
}
