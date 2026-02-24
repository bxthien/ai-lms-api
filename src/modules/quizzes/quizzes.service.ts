import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { QuestionType } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async listByLesson(lessonId: string) {
    return this.prisma.quiz.findMany({
      where: { lessonId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        title: true,
        lessonId: true,
        createdAt: true,
      },
    });
  }

  async getQuizWithQuestions(quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz;
  }

  async createQuizForLesson(teacherId: string, dto: CreateQuizDto) {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id: dto.lessonId,
        course: {
          teacherId,
        },
      },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found or not owned by teacher');
    }

    return this.prisma.quiz.create({
      data: {
        title: dto.title,
        lessonId: dto.lessonId,
      },
    });
  }

  async addQuestionToQuiz(
    teacherId: string,
    quizId: string,
    dto: CreateQuestionDto,
  ) {
    const quiz = await this.prisma.quiz.findFirst({
      where: {
        id: quizId,
        lesson: {
          course: {
            teacherId,
          },
        },
      },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found or not owned by teacher');
    }

    return this.prisma.question.create({
      data: {
        quizId,
        type: dto.type,
        content: dto.content,
        correctAnswer: dto.correctAnswer,
        score: dto.score,
      },
    });
  }

  async submitQuiz(userId: string, dto: SubmitQuizDto) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: dto.quizId },
      include: { questions: true },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const existing = await this.prisma.submission.findUnique({
      where: {
        userId_quizId: {
          userId,
          quizId: dto.quizId,
        },
      },
    });
    if (existing) {
      // Tùy chiến lược, có thể cho phép làm lại; hiện tại tạm thời không
      throw new NotFoundException('Submission already exists');
    }

    // Auto grading MCQ
    let totalScore = 0;
    let maxScore = 0;

    for (const question of quiz.questions) {
      maxScore += question.score;
      const answer = dto.answers.find(
        (a) => a.questionId === question.id,
      )?.answer;

      if (
        question.type === QuestionType.MCQ &&
        answer !== undefined &&
        question.correctAnswer &&
        answer.trim() === question.correctAnswer.trim()
      ) {
        totalScore += question.score;
      }
    }

    const normalizedScore =
      maxScore > 0 ? parseFloat((totalScore / maxScore).toFixed(2)) : null;

    const submission = await this.prisma.submission.create({
      data: {
        userId,
        quizId: dto.quizId,
        answer: JSON.stringify(dto.answers),
        score: normalizedScore,
      },
    });

    return submission;
  }
}
