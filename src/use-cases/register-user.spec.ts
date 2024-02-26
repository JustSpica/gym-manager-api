import { compare } from "bcryptjs";
import { describe, expect, it } from "vitest";

import { InMemoryUsersRepository } from "@/repositores/in-memory/in-memory-users.repository";

import { UserAlreadyExistError } from "./errors/user-already-exist.error";
import { RegisterUserUseCase } from "./register-user";

describe("Register a user Use Case", () => {
  it("should be able to register a user", async () => {
    const UsersRepository = new InMemoryUsersRepository();

    const registerUserUseCase = new RegisterUserUseCase(UsersRepository);

    const { user } = await registerUserUseCase.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const UsersRepository = new InMemoryUsersRepository();

    const registerUserUseCase = new RegisterUserUseCase(UsersRepository);

    const password = "123456";

    const { user } = await registerUserUseCase.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password,
    });

    const isPasswordHashed = await compare(password, user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it("should not be able to register a user with an existing email", async () => {
    const UsersRepository = new InMemoryUsersRepository();

    const registerUserUseCase = new RegisterUserUseCase(UsersRepository);

    await registerUserUseCase.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
    });

    await expect(() =>
      registerUserUseCase.execute({
        email: "johndoe@example.com",
        name: "John Doe",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
