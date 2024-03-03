import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositores/in-memory/in-memory.check-ins.repository";
import { InMemoryGymsRepository } from "@/repositores/in-memory/in-memory-gyms.repository";

import { CheckInUseCase } from "./check-in";
import { MaxNumberOfCheckInsError } from "./errors/max-number-off-check-ins.error";
import { MaxDistanceError } from "./errors/max-ditance.error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check In Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-id-01",
      description: null,
      latitude: -29.948736,
      longitude: -50.9875099,
      phone: null,
      title: "Fitness gym",
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-id-01",
      userId: "user-01",
      userLatitude: -29.948736,
      userLongitude: -50.9875099,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2024, 2, 1, 11, 0, 0));

    await sut.execute({
      gymId: "gym-id-01",
      userId: "user-01",
      userLatitude: -29.948736,
      userLongitude: -50.9875099,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-id-01",
        userId: "user-01",
        userLatitude: -29.948736,
        userLongitude: -50.9875099,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2024, 2, 1, 11, 0, 0));

    await sut.execute({
      gymId: "gym-id-01",
      userId: "user-01",
      userLatitude: -29.948736,
      userLongitude: -50.9875099,
    });

    vi.setSystemTime(new Date(2024, 2, 2, 11, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-id-01",
      userId: "user-01",
      userLatitude: -29.948736,
      userLongitude: -50.9875099,
    });

    expect(checkIn.user_id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    await expect(() =>
      sut.execute({
        gymId: "gym-id-01",
        userId: "user-01",
        userLatitude: -39.948736,
        userLongitude: -80.9875099,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
