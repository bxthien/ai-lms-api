import { Injectable, NotFoundException } from '@nestjs/common';
import { CoursesRepository } from './repositories/courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseStatus } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async listPublished() {
    return this.coursesRepository.findAllPublished();
  }

  async findById(id: string) {
    const course = await this.coursesRepository.findById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async createForTeacher(teacherId: string, dto: CreateCourseDto) {
    return this.coursesRepository.create({
      title: dto.title,
      description: dto.description,
      level: dto.level,
      price: dto.price,
      thumbnailUrl: dto.thumbnailUrl,
      status: CourseStatus.DRAFT,
      teacherId,
    });
  }

  async updateCourse(id: string, teacherId: string, dto: UpdateCourseDto) {
    const existing = await this.coursesRepository.findByIdAndTeacher(
      id,
      teacherId,
    );
    if (!existing) {
      throw new NotFoundException('Course not found or not owned by teacher');
    }

    return this.coursesRepository.update(id, {
      title: dto.title ?? existing.title,
      description: dto.description ?? existing.description,
      level: dto.level ?? existing.level,
      price: dto.price ?? existing.price,
      thumbnailUrl: dto.thumbnailUrl ?? existing.thumbnailUrl,
    });
  }

  async publishCourse(id: string, teacherId: string) {
    const existing = await this.coursesRepository.findByIdAndTeacher(
      id,
      teacherId,
    );
    if (!existing) {
      throw new NotFoundException('Course not found or not owned by teacher');
    }
    return this.coursesRepository.update(id, {
      status: CourseStatus.PUBLISHED,
    });
  }

  async unpublishCourse(id: string, teacherId: string) {
    const existing = await this.coursesRepository.findByIdAndTeacher(
      id,
      teacherId,
    );
    if (!existing) {
      throw new NotFoundException('Course not found or not owned by teacher');
    }
    return this.coursesRepository.update(id, { status: CourseStatus.DRAFT });
  }

  async softDelete(id: string, teacherId: string) {
    const existing = await this.coursesRepository.findByIdAndTeacher(
      id,
      teacherId,
    );
    if (!existing) {
      throw new NotFoundException('Course not found or not owned by teacher');
    }
    await this.coursesRepository.softDelete(id);
  }
}
