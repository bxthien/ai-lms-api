import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Quiz } from '@prisma/client';

@Injectable()
export class QuizzesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByLesson(lessonId: string) {
    return this.prisma.quiz.findMany({
      where: { lessonId },
      orderBy: { createdAt: 'asc' },
      select: { id: true, title: true, lessonId: true, createdAt: true },
    });
  }

  async findByIdWithQuestions(id: string) {
    return this.prisma.quiz.findUnique({
      where: { id },
      include: { questions: true },
    });
  }

  async findByIdWithTeacher(id: string, teacherId: string) {
    return this.prisma.quiz.findFirst({
      where: {
        id,
        lesson: { course: { teacherId } },
      },
    });
  }

  async create(data: { title: string; lessonId: string }): Promise<Quiz> {
    return this.prisma.quiz.create({ data });
  }
}
