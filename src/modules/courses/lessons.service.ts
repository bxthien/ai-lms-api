import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonsRepository } from './repositories/lessons.repository';
import { CoursesRepository } from './repositories/courses.repository';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async listByCourse(courseId: string) {
    const course = await this.coursesRepository.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return this.lessonsRepository.findByCourse(courseId);
  }

  async findById(courseId: string, lessonId: string) {
    const lesson = await this.lessonsRepository.findByIdAndCourse(
      lessonId,
      courseId,
    );
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
    const course = await this.coursesRepository.findByIdAndTeacher(
      courseId,
      teacherId,
    );
    if (!course) {
      throw new NotFoundException('Course not found or not owned by teacher');
    }

    return this.lessonsRepository.create({
      courseId,
      title: dto.title,
      videoUrl: dto.videoUrl,
      content: dto.content,
      orderIndex: dto.orderIndex,
      duration: dto.duration,
    });
  }

  async updateLesson(
    courseId: string,
    lessonId: string,
    teacherId: string,
    dto: UpdateLessonDto,
  ) {
    const lesson = await this.lessonsRepository.findByIdCourseAndTeacher(
      lessonId,
      courseId,
      teacherId,
    );
    if (!lesson) {
      throw new NotFoundException('Lesson not found or not owned by teacher');
    }

    return this.lessonsRepository.update(lessonId, {
      title: dto.title ?? lesson.title,
      videoUrl: dto.videoUrl !== undefined ? dto.videoUrl : lesson.videoUrl,
      content: dto.content ?? lesson.content,
      orderIndex: dto.orderIndex ?? lesson.orderIndex,
      duration: dto.duration ?? lesson.duration,
    });
  }

  async softDelete(courseId: string, lessonId: string, teacherId: string) {
    const lesson = await this.lessonsRepository.findByIdCourseAndTeacher(
      lessonId,
      courseId,
      teacherId,
    );
    if (!lesson) {
      throw new NotFoundException('Lesson not found or not owned by teacher');
    }
    await this.lessonsRepository.softDelete(lessonId);
  }
}
