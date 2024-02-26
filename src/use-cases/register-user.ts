/* eslint-disable no-useless-constructor */
import type { User } from "@prisma/client";
import { hash } from "bcryptjs";

import { UsersRepository } from "@/repositores/@types/users-repository";
import { UserAlreadyExistError } from "./errors/user-already-exist.error";

interface RegisterUserUseCaseParams {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserUseCaseResponse {
  user: User;
}

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUserUseCaseParams): Promise<RegisterUserUseCaseResponse> {
    const password_hash = await hash(password, 6);

    const usersWithSameEmail = await this.usersRepository.findByEmail(email);

    if (usersWithSameEmail) {
      throw new UserAlreadyExistError();
    }

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash,
    });

    return { user };
  }
}
