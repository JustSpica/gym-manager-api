/* eslint-disable no-useless-constructor */
import { hash } from "bcryptjs";

import { UsersRepository } from "@/repositores/@types/users-repository";
import { UserAlreadyExistError } from "./errors/user-already-exist.error";

interface ExecuteRegisterUseCaseParams {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: ExecuteRegisterUseCaseParams) {
    const password_hash = await hash(password, 6);

    const usersWithSameEmail = await this.usersRepository.findByEmail(email);

    if (usersWithSameEmail) {
      throw new UserAlreadyExistError();
    }

    await this.usersRepository.create({ email, name, password_hash });
  }
}
