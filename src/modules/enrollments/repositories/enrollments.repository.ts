import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Enrollment } from '@prisma/client';

@Injectable()
export class EnrollmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      orderBy: { enrolledAt: 'desc' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            level: true,
            price: true,
            thumbnailUrl: true,
            status: true,
          },
        },
      },
    });
  }

  async findByUserAndCourse(
    userId: string,
    courseId: string,
  ): Promise<(Enrollment & { course: any }) | null> {
    return this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { course: { select: { id: true, title: true } } },
    }) as any;
  }

  async upsert(userId: string, courseId: string): Promise<Enrollment> {
    return this.prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { status: 'ACTIVE' },
      create: { userId, courseId, progress: 0, status: 'ACTIVE' },
    });
  }

  async updateProgress(
    userId: string,
    courseId: string,
    progress: number,
  ): Promise<Enrollment> {
    return this.prisma.enrollment.update({
      where: { userId_courseId: { userId, courseId } },
      data: { progress },
    });
  }
}
