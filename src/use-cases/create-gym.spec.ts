import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositores/in-memory/in-memory-gyms.repository";

import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should be able to create a gym", async () => {
    const { gym } = await sut.execute({
      description: null,
      latitude: -29.948736,
      longitude: -50.9875099,
      phone: null,
      title: "Fitness gym",
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
