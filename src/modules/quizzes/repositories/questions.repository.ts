import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Question, QuestionType } from '@prisma/client';

@Injectable()
export class QuestionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    quizId: string;
    type: QuestionType;
    content: string;
    correctAnswer?: string;
    score: number;
  }): Promise<Question> {
    return this.prisma.question.create({ data });
  }

  async findByQuiz(quizId: string): Promise<Question[]> {
    return this.prisma.question.findMany({ where: { quizId } });
  }
}
