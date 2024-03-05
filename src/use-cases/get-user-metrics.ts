/* eslint-disable no-useless-constructor */
import { CheckInsRepository } from "@/repositores/@types/check-ins-repository";

interface GetUserMetricsUseCaseRequest {
  userId: string;
  page: number;
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number;
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId);

    return { checkInsCount };
  }
}
