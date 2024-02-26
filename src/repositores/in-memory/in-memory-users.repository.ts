import { Prisma, User } from "@prisma/client";

import { UsersRepository } from "../@types/users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      created_at: new Date(),
      email: data.email,
      id: "user-id-1",
      name: data.name,
      password_hash: data.password_hash,
    };

    this.items.push(user);

    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email);

    if (!user) return null;

    return user;
  }
}
