import { Gym, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID } from "node:crypto";

import {
  FindManyNearbyParams,
  GymsRepository,
} from "../@types/gyms-repository";
import { getDistanceBetweenCoordenates } from "@/utils/get-distance-between-coordenates";

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      title: data.title,
      description: data.description ?? null,
      id: data.id ?? randomUUID(),
      phone: data.phone ?? null,
    };

    this.items.push(gym);

    return gym;
  }

  async findById(gymId: string) {
    const gym = this.items.find((item) => item.id === gymId);

    if (!gym) {
      return null;
    }

    return gym;
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordenates(
        { latitude, longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      );

      return distance < 10;
    });
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }
}
