import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositores/in-memory/in-memory-gyms.repository";

import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      description: null,
      latitude: -29.948736,
      longitude: -50.9875099,
      phone: null,
      title: "Fitness gym",
    });

    await gymsRepository.create({
      description: null,
      latitude: -29.948736,
      longitude: -50.9875099,
      phone: null,
      title: "No fitness gym",
    });

    const { gyms } = await sut.execute({ page: 1, query: "No fitness" });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "No fitness gym" }),
    ]);
  });

  it("should be able to fetch paginated gyms searched by 20 items per page", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        description: null,
        latitude: -29.948736,
        longitude: -50.9875099,
        phone: null,
        title: `Fitness gym ${i}`,
      });
    }

    const { gyms } = await sut.execute({ page: 2, query: "Fitness" });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Fitness gym 21" }),
      expect.objectContaining({ title: "Fitness gym 22" }),
    ]);
  });
});
