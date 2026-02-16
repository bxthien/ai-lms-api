import {
  PrismaClient,
  CourseLevel,
  CourseStatus,
  UserRole,
  UserStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Seed users
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: passwordHash,
      fullName: 'Admin User',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      email: 'teacher@example.com',
      password: passwordHash,
      fullName: 'Teacher One',
      role: UserRole.TEACHER,
      status: UserStatus.ACTIVE,
      isVerified: true,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      password: passwordHash,
      fullName: 'Student One',
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      isVerified: true,
    },
  });

  // Seed courses + lessons for teacher
  const nestCourse = await prisma.course.create({
    data: {
      title: 'NestJS Fundamentals',
      description: 'Học NestJS từ cơ bản đến nâng cao với ví dụ thực tế.',
      level: CourseLevel.BEGINNER,
      price: 49.99,
      thumbnailUrl: 'https://example.com/thumbnails/nestjs.png',
      status: CourseStatus.PUBLISHED,
      teacherId: teacher.id,
      lessons: {
        create: [
          {
            title: 'Giới thiệu NestJS',
            content: 'Tổng quan kiến trúc và triết lý của NestJS.',
            orderIndex: 1,
            duration: 15,
          },
          {
            title: 'Module & Dependency Injection',
            content: 'Hiểu về module, provider, DI container.',
            orderIndex: 2,
            duration: 25,
          },
          {
            title: 'Controller & Service',
            content: 'Xây dựng REST API cơ bản với controller/service.',
            orderIndex: 3,
            duration: 30,
          },
        ],
      },
    },
  });

  const prismaCourse = await prisma.course.create({
    data: {
      title: 'Prisma ORM với PostgreSQL',
      description: 'Thiết kế schema, migration và query với Prisma.',
      level: CourseLevel.INTERMEDIATE,
      price: 59.99,
      thumbnailUrl: 'https://example.com/thumbnails/prisma.png',
      status: CourseStatus.DRAFT,
      teacherId: teacher.id,
      lessons: {
        create: [
          {
            title: 'Giới thiệu Prisma',
            content: 'Prisma Client, Migrate, Studio.',
            orderIndex: 1,
            duration: 20,
          },
          {
            title: 'Thiết kế schema cho LMS',
            content: 'Mapping ERD AI-LMS sang Prisma schema.',
            orderIndex: 2,
            duration: 35,
          },
        ],
      },
    },
  });

  // Example enrollment for student
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: nestCourse.id,
      },
    },
    update: {},
    create: {
      userId: student.id,
      courseId: nestCourse.id,
      progress: 0,
      status: 'ACTIVE',
    },
  });

  console.log('Seed completed: users, courses, lessons, enrollment');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
