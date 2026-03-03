import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseStatus } from '@prisma/client';
import { EnrollmentsRepository } from './repositories/enrollments.repository';
import { CoursesRepository } from '../courses/repositories/courses.repository';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async enroll(userId: string, courseId: string) {
    const course = await this.coursesRepository.findById(courseId);
    if (!course || course.status !== CourseStatus.PUBLISHED) {
      throw new NotFoundException('Course not found');
    }

    return this.enrollmentsRepository.upsert(userId, courseId);
  }

  async listMyEnrollments(userId: string) {
    return this.enrollmentsRepository.findByUser(userId);
  }

  async getMyEnrollmentForCourse(userId: string, courseId: string) {
    const enrollment = await this.enrollmentsRepository.findByUserAndCourse(
      userId,
      courseId,
    );
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    return enrollment;
  }
}
