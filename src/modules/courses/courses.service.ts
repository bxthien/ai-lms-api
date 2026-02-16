import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseStatus } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublished() {
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

  async findById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            title: true,
            duration: true,
            orderIndex: true,
          },
        },
      },
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async createForTeacher(teacherId: string, dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        title: dto.title,
        description: dto.description,
        level: dto.level,
        price: dto.price,
        thumbnailUrl: dto.thumbnailUrl,
        status: CourseStatus.DRAFT,
        teacherId,
      },
    });
  }

  async updateCourse(id: string, teacherId: string, dto: UpdateCourseDto) {
    const existing = await this.prisma.course.findFirst({
      where: { id, teacherId, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('Course not found or not owned by teacher');
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        title: dto.title ?? existing.title,
        description: dto.description ?? existing.description,
        level: dto.level ?? existing.level,
        price: dto.price ?? existing.price,
        thumbnailUrl: dto.thumbnailUrl ?? existing.thumbnailUrl,
      },
    });
  }

  async publishCourse(id: string, teacherId: string) {
    const existing = await this.prisma.course.findFirst({
      where: { id, teacherId, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('Course not found or not owned by teacher');
    }

    return this.prisma.course.update({
      where: { id },
      data: { status: CourseStatus.PUBLISHED },
    });
  }

  async unpublishCourse(id: string, teacherId: string) {
    const existing = await this.prisma.course.findFirst({
      where: { id, teacherId, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('Course not found or not owned by teacher');
    }

    return this.prisma.course.update({
      where: { id },
      data: { status: CourseStatus.DRAFT },
    });
  }

  async softDelete(id: string, teacherId: string) {
    const existing = await this.prisma.course.findFirst({
      where: { id, teacherId, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('Course not found or not owned by teacher');
    }

    await this.prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
