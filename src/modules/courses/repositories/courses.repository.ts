import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Course, CourseLevel, CourseStatus } from '@prisma/client';

@Injectable()
export class CoursesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublished(): Promise<Partial<Course>[]> {
    return this.prisma.course.findMany({
      where: { status: CourseStatus.PUBLISHED, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        level: true,
        price: true,
        thumbnailUrl: true,
        status: true,
        teacherId: true,
        createdAt: true,
      },
    });
  }

  async findById(id: string): Promise<Course & { lessons: any[] } | null> {
    return this.prisma.course.findFirst({
      where: { id, deletedAt: null },
      include: {
        lessons: {
          where: { deletedAt: null },
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            title: true,
            duration: true,
            orderIndex: true,
          },
        },
      },
    }) as any;
  }

  async findByIdAndTeacher(
    id: string,
    teacherId: string,
  ): Promise<Course | null> {
    return this.prisma.course.findFirst({
      where: { id, teacherId, deletedAt: null },
    });
  }

  async create(data: {
    title: string;
    description: string;
    level: CourseLevel;
    price: number;
    thumbnailUrl?: string;
    status: CourseStatus;
    teacherId: string;
  }): Promise<Course> {
    return this.prisma.course.create({ data });
  }

  async update(id: string, data: Partial<Course>): Promise<Course> {
    return this.prisma.course.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
