import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
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

  // --- Lessons (teacher only, course must be owned) ---

  async listLessons(courseId: string) {
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, deletedAt: null },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.lesson.findMany({
      where: { courseId, deletedAt: null },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async getLesson(courseId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, courseId, deletedAt: null },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson;
  }

  async createLesson(
    courseId: string,
    teacherId: string,
    dto: CreateLessonDto,
  ) {
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, teacherId, deletedAt: null },
    });
    if (!course) {
      throw new NotFoundException('Course not found or not owned by teacher');
    }

    return this.prisma.lesson.create({
      data: {
        courseId,
        title: dto.title,
        videoUrl: dto.videoUrl,
        content: dto.content,
        orderIndex: dto.orderIndex,
        duration: dto.duration,
      },
    });
  }

  async updateLesson(
    courseId: string,
    lessonId: string,
    teacherId: string,
    dto: UpdateLessonDto,
  ) {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id: lessonId,
        courseId,
        deletedAt: null,
        course: { teacherId },
      },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found or not owned by teacher');
    }

    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: dto.title ?? lesson.title,
        videoUrl: dto.videoUrl !== undefined ? dto.videoUrl : lesson.videoUrl,
        content: dto.content ?? lesson.content,
        orderIndex: dto.orderIndex ?? lesson.orderIndex,
        duration: dto.duration ?? lesson.duration,
      },
    });
  }

  async softDeleteLesson(
    courseId: string,
    lessonId: string,
    teacherId: string,
  ) {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id: lessonId,
        courseId,
        deletedAt: null,
        course: { teacherId },
      },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found or not owned by teacher');
    }

    await this.prisma.lesson.update({
      where: { id: lessonId },
      data: { deletedAt: new Date() },
    });
  }
}
