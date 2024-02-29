import { FastifyReply, FastifyRequest } from "fastify";
import * as zod from "zod";

import { PrismaUsersRepository } from "@/repositores/prisma/prisma-users.repository";

import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials.error";
import { AuthenticateUserUseCase } from "@/use-cases/authenticate-user";

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepository,
    );

    await authenticateUserUseCase.execute({ email, password });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(200).send();
}
