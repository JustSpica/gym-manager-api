import { FastifyReply, FastifyRequest } from "fastify";
import * as zod from "zod";

import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials.error";
import { makeAuthenticateUserUseCase } from "@/use-cases/factories/make-authenticate-user-use-case";

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
    const authenticateUserUseCase = makeAuthenticateUserUseCase();

    await authenticateUserUseCase.execute({ email, password });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(200).send();
}
