import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositores/in-memory/in-memory-gyms.repository";

import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      description: null,
      latitude: -29.948736,
      longitude: -50.9875099,
      phone: null,
      title: "Nearby Gym",
    });

    await gymsRepository.create({
      description: null,
      latitude: -29.8467753,
      longitude: -51.1842468,
      phone: null,
      title: "Distant Gym",
    });

    const { gyms } = await sut.execute({
      userLatitude: -29.948736,
      userLongitude: -50.9875099,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Nearby Gym" })]);
  });
});
