import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AIRequest, AIRequestType } from '@prisma/client';

@Injectable()
export class AiRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    type: AIRequestType;
    prompt: string;
    response?: string;
    tokens?: number;
    cost?: number;
  }): Promise<AIRequest> {
    return this.prisma.aIRequest.create({ data });
  }

  async findByUser(userId: string): Promise<AIRequest[]> {
    return this.prisma.aIRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateResponse(
    id: string,
    response: string,
    tokens?: number,
    cost?: number,
  ): Promise<AIRequest> {
    return this.prisma.aIRequest.update({
      where: { id },
      data: { response, tokens, cost },
    });
  }
}
