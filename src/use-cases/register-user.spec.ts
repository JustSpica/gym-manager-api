import { compare } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryUsersRepository } from "@/repositores/in-memory/in-memory-users.repository";

import { UserAlreadyExistError } from "./errors/user-already-exist.error";
import { RegisterUserUseCase } from "./register-user";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUserUseCase;

describe("Register a user Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUserUseCase(usersRepository);
  });

  it("should be able to register a user", async () => {
    const { user } = await sut.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const password = "123456";

    const { user } = await sut.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password,
    });

    const isPasswordHashed = await compare(password, user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it("should not be able to register a user with an existing email", async () => {
    await sut.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        name: "John Doe",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
