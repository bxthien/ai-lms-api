import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Submission } from '@prisma/client';

@Injectable()
export class SubmissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserAndQuiz(
    userId: string,
    quizId: string,
  ): Promise<Submission | null> {
    return this.prisma.submission.findUnique({
      where: { userId_quizId: { userId, quizId } },
    });
  }

  async create(data: {
    userId: string;
    quizId: string;
    answer: string;
    score: number | null;
  }): Promise<Submission> {
    return this.prisma.submission.create({ data });
  }

  async updateScore(
    id: string,
    score: number,
    aiFeedback?: string,
  ): Promise<Submission> {
    return this.prisma.submission.update({
      where: { id },
      data: { score, aiFeedback },
    });
  }

  async findByUser(userId: string): Promise<Submission[]> {
    return this.prisma.submission.findMany({
      where: { userId },
      orderBy: { submittedAt: 'desc' },
    });
  }
}
