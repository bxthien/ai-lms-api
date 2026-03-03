import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizzesRepository } from './repositories/quizzes.repository';
import { QuestionsRepository } from './repositories/questions.repository';
import { SubmissionsRepository } from './repositories/submissions.repository';
import { LessonsRepository } from '../courses/repositories/lessons.repository';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { QuestionType } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(
    private readonly quizzesRepository: QuizzesRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly submissionsRepository: SubmissionsRepository,
    private readonly lessonsRepository: LessonsRepository,
  ) {}

  async listByLesson(lessonId: string) {
    return this.quizzesRepository.findByLesson(lessonId);
  }

  async getQuizWithQuestions(quizId: string) {
    const quiz = await this.quizzesRepository.findByIdWithQuestions(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }

  async createQuizForLesson(teacherId: string, dto: CreateQuizDto) {
    // Verify lesson exists and belongs to the teacher's course
    const lesson = await this.lessonsRepository.findById(dto.lessonId);
    if (!lesson) {
      throw new NotFoundException('Lesson not found or not owned by teacher');
    }

    // Direct ownership check: find lesson owned by teacher
    const lessonOwnedByTeacher =
      await this.lessonsRepository.findByIdCourseAndTeacher(
        dto.lessonId,
        lesson.courseId,
        teacherId,
      );
    if (!lessonOwnedByTeacher) {
      throw new NotFoundException('Lesson not found or not owned by teacher');
    }

    return this.quizzesRepository.create({
      title: dto.title,
      lessonId: dto.lessonId,
    });
  }

  async addQuestionToQuiz(
    teacherId: string,
    quizId: string,
    dto: CreateQuestionDto,
  ) {
    const quiz = await this.quizzesRepository.findByIdWithTeacher(
      quizId,
      teacherId,
    );
    if (!quiz) {
      throw new NotFoundException('Quiz not found or not owned by teacher');
    }

    return this.questionsRepository.create({
      quizId,
      type: dto.type,
      content: dto.content,
      correctAnswer: dto.correctAnswer,
      score: dto.score,
    });
  }

  async submitQuiz(userId: string, dto: SubmitQuizDto) {
    const quiz = await this.quizzesRepository.findByIdWithQuestions(dto.quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const existing = await this.submissionsRepository.findByUserAndQuiz(
      userId,
      dto.quizId,
    );
    if (existing) {
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

    return this.submissionsRepository.create({
      userId,
      quizId: dto.quizId,
      answer: JSON.stringify(dto.answers),
      score: normalizedScore,
    });
  }
}
