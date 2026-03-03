import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Lesson } from '@prisma/client';

@Injectable()
export class LessonsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCourse(courseId: string): Promise<Lesson[]> {
    return this.prisma.lesson.findMany({
      where: { courseId, deletedAt: null },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async findById(id: string): Promise<Lesson | null> {
    return this.prisma.lesson.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByIdAndCourse(
    id: string,
    courseId: string,
  ): Promise<Lesson | null> {
    return this.prisma.lesson.findFirst({
      where: { id, courseId, deletedAt: null },
    });
  }

  async findByIdCourseAndTeacher(
    id: string,
    courseId: string,
    teacherId: string,
  ): Promise<Lesson | null> {
    return this.prisma.lesson.findFirst({
      where: {
        id,
        courseId,
        deletedAt: null,
        course: { teacherId },
      },
    });
  }

  async create(data: {
    courseId: string;
    title: string;
    videoUrl?: string;
    content: string;
    orderIndex: number;
    duration: number;
  }): Promise<Lesson> {
    return this.prisma.lesson.create({ data });
  }

  async update(id: string, data: Partial<Lesson>): Promise<Lesson> {
    return this.prisma.lesson.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.lesson.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
