import {
  PrismaClient,
  UserRole,
  CourseLevel,
  CourseStatus,
  QuestionType,
  AIRequestType,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function clearDatabase() {
  // Xóa theo thứ tự tránh lỗi foreign key
  await prisma.recommendation.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.aIRequest.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsers() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: passwordHash,
      fullName: 'System Admin',
      role: UserRole.ADMIN,
    },
  });

  const teacher = await prisma.user.create({
    data: {
      email: 'teacher@example.com',
      password: passwordHash,
      fullName: 'Main Teacher',
      role: UserRole.TEACHER,
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: 'student1@example.com',
      password: passwordHash,
      fullName: 'Student One',
      role: UserRole.STUDENT,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'student2@example.com',
      password: passwordHash,
      fullName: 'Student Two',
      role: UserRole.STUDENT,
    },
  });

  const student3 = await prisma.user.create({
    data: {
      email: 'student3@example.com',
      password: passwordHash,
      fullName: 'Student Three',
      role: UserRole.STUDENT,
    },
  });

  return { admin, teacher, student1, student2, student3 };
}

async function seedCoursesAndLessons(teacherId: string) {
  const course1 = await prisma.course.create({
    data: {
      title: 'Intro to TypeScript',
      description: 'Khóa học nhập môn TypeScript cho người đã biết JavaScript.',
      level: CourseLevel.BEGINNER,
      price: 0,
      status: CourseStatus.PUBLISHED,
      teacherId,
      lessons: {
        create: [
          {
            title: 'Giới thiệu TypeScript',
            content:
              'Tổng quan về TypeScript và lợi ích so với JavaScript thuần.',
            orderIndex: 1,
            duration: 15,
          },
          {
            title: 'Kiểu dữ liệu cơ bản',
            content: 'Tìm hiểu number, string, boolean, array, tuple, enum.',
            orderIndex: 2,
            duration: 25,
          },
        ],
      },
    },
    include: { lessons: true },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Node.js & NestJS Fundamentals',
      description: 'Xây dựng REST API với NestJS và Prisma.',
      level: CourseLevel.INTERMEDIATE,
      price: 49,
      status: CourseStatus.PUBLISHED,
      teacherId,
      lessons: {
        create: [
          {
            title: 'Kiến trúc NestJS',
            content: 'Module, Controller, Service và Dependency Injection.',
            orderIndex: 1,
            duration: 30,
          },
          {
            title: 'Kết nối Database với Prisma',
            content: 'Prisma schema, migration, PrismaClient.',
            orderIndex: 2,
            duration: 40,
          },
        ],
      },
    },
    include: { lessons: true },
  });

  // Thêm ~10 khóa học demo khác (chỉ cần lesson đơn giản)
  await prisma.course.create({
    data: {
      title: 'React for Beginners',
      description: 'Học React từ zero tới dựng được SPA đơn giản.',
      level: CourseLevel.BEGINNER,
      price: 19,
      status: CourseStatus.PUBLISHED,
      teacherId,
      lessons: {
        create: [
          {
            title: 'JSX & Component cơ bản',
            content: 'Giới thiệu JSX, function component, props.',
            orderIndex: 1,
            duration: 20,
          },
        ],
      },
    },
  });

  await prisma.course.create({
    data: {
      title: 'Advanced React Patterns',
      description: 'Context, custom hooks, performance optimization.',
      level: CourseLevel.ADVANCED,
      price: 69,
      status: CourseStatus.PUBLISHED,
      teacherId,
      lessons: {
        create: [
          {
            title: 'Custom Hooks',
            content: 'Tách logic dùng chung bằng custom hooks.',
            orderIndex: 1,
            duration: 30,
          },
        ],
      },
    },
  });

  await prisma.course.create({
    data: {
      title: 'Database Design Basics',
      description: 'Chuẩn hóa, quan hệ 1-n, n-n, index.',
      level: CourseLevel.BEGINNER,
      price: 15,
      status: CourseStatus.PUBLISHED,
      teacherId,
      lessons: {
        create: [
          {
            title: 'Thiết kế bảng & khóa chính',
            content: 'Cách thiết kế entity, primary key, foreign key.',
            orderIndex: 1,
            duration: 25,
          },
        ],
      },
    },
  });

  await prisma.course.create({
    data: {
      title: 'Git & GitHub Workflow',
      description: 'Branching, pull request, code review.',
      level: CourseLevel.BEGINNER,
      price: 0,
      status: CourseStatus.PUBLISHED,
      teacherId,
      lessons: {
        create: [
          {
            title: 'Git cơ bản',
            content: 'commit, branch, merge, resolve conflict.',
            orderIndex: 1,
            duration: 30,
          },
        ],
      },
    },
  });

  await prisma.course.create({
    data: {
      title: 'Clean Code Practices',
      description: 'Viết code dễ đọc, dễ bảo trì.',
      level: CourseLevel.INTERMEDIATE,
      price: 39,
      status: CourseStatus.PUBLISHED,
      teacherId,
      lessons: {
        create: [
          {
            title: 'Naming & Function nhỏ',
            content: 'Quy tắc đặt tên và tách hàm nhỏ.',
            orderIndex: 1,
            duration: 35,
          },
        ],
      },
    },
  });

  await prisma.course.create({
    data: {
      title: 'Docker for Developers',
      description: 'Container hóa ứng dụng web, docker-compose.',
      level: CourseLevel.INTERMEDIATE,
      price: 29,
      status: CourseStatus.PUBLISHED,
      teacherId,
      lessons: {
        create: [
          {
            title: 'Docker image & container',
            content: 'Dockerfile, build image, run container.',
            orderIndex: 1,
            duration: 40,
          },
        ],
      },
    },
  });

  await prisma.course.create({
    data: {
      title: 'Testing JavaScript Applications',
      description: 'Unit test, integration test với Jest.',
      level: CourseLevel.INTERMEDIATE,
      price: 35,
      status: CourseStatus.PUBLISHED,
      teacherId,
      lessons: {
        create: [
          {
            title: 'Unit test cơ bản',
            content: 'Arrange, Act, Assert, mock & stub.',
            orderIndex: 1,
            duration: 30,
          },
        ],
      },
    },
  });

  await prisma.course.create({
    data: {
      title: 'System Design Interview Prep',
      description: 'Ôn tập các khái niệm system design phổ biến.',
      level: CourseLevel.ADVANCED,
      price: 99,
      status: CourseStatus.PUBLISHED,
      teacherId,
      lessons: {
        create: [
          {
            title: 'Scalability & Reliability',
            content: 'Horizontal scaling, load balancer, replication.',
            orderIndex: 1,
            duration: 45,
          },
        ],
      },
    },
  });

  await prisma.course.create({
    data: {
      title: 'Intro to Machine Learning',
      description: 'Khái niệm supervised, unsupervised, overfitting.',
      level: CourseLevel.BEGINNER,
      price: 59,
      status: CourseStatus.PUBLISHED,
      teacherId,
      lessons: {
        create: [
          {
            title: 'Pipeline ML cơ bản',
            content: 'Thu thập dữ liệu, train, evaluate, deploy.',
            orderIndex: 1,
            duration: 35,
          },
        ],
      },
    },
  });

  await prisma.course.create({
    data: {
      title: 'Prompt Engineering for LLMs',
      description: 'Kỹ thuật viết prompt hiệu quả cho mô hình ngôn ngữ.',
      level: CourseLevel.INTERMEDIATE,
      price: 45,
      status: CourseStatus.PUBLISHED,
      teacherId,
      lessons: {
        create: [
          {
            title: 'Prompt cơ bản đến nâng cao',
            content: 'Zero-shot, few-shot, chain-of-thought.',
            orderIndex: 1,
            duration: 40,
          },
        ],
      },
    },
  });

  return { course1, course2 };
}

async function seedEnrollmentsAndProgress(
  courseIds: string[],
  students: string[],
) {
  for (const studentId of students) {
    for (const courseId of courseIds) {
      await prisma.enrollment.create({
        data: {
          userId: studentId,
          courseId,
          progress: 0,
        },
      });
    }
  }
}

async function seedQuizzesAndQuestions(lessonId: string) {
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Quiz: Cơ bản TypeScript',
      lessonId,
      questions: {
        create: [
          {
            type: QuestionType.MCQ,
            content: 'Kiểu dữ liệu nào sau đây KHÔNG có trong TypeScript?',
            correctAnswer: 'dynamic',
            score: 1,
          },
          {
            type: QuestionType.TEXT,
            content:
              'Giải thích lợi ích của việc dùng type/interface trong TypeScript.',
            score: 2,
          },
        ],
      },
    },
    include: { questions: true },
  });

  return quiz;
}

async function seedSubmissions(quizId: string, userId: string) {
  await prisma.submission.create({
    data: {
      userId,
      quizId,
      answer: JSON.stringify({
        q1: 'dynamic',
        q2: 'Giúp code dễ bảo trì, tự hoàn thành tốt hơn và giảm bug runtime.',
      }),
      score: 3,
      aiFeedback:
        'Bài làm tốt, nêu đúng ý chính về type safety và maintainability.',
    },
  });
}

async function seedAIRequests(userId: string) {
  await prisma.aIRequest.createMany({
    data: [
      {
        userId,
        type: AIRequestType.GENERATE_QUIZ,
        prompt: 'Generate 5 MCQ questions about TypeScript basic types.',
        response: 'Generated 5 questions about TypeScript types...',
        tokens: 250,
        cost: 0.0025,
      },
      {
        userId,
        type: AIRequestType.GRADE_ESSAY,
        prompt:
          'Grade essay about benefits of static typing in large codebases.',
        response:
          'Essay is well structured, highlights maintainability and tooling.',
        tokens: 320,
        cost: 0.0032,
      },
    ],
  });
}

async function seedNotifications(userId: string) {
  await prisma.notification.createMany({
    data: [
      {
        userId,
        type: 'COURSE_ENROLLED',
        content: 'Bạn đã ghi danh khóa học "Intro to TypeScript".',
      },
      {
        userId,
        type: 'QUIZ_SUBMITTED',
        content: 'Bạn vừa nộp bài quiz "Quiz: Cơ bản TypeScript".',
      },
    ],
  });
}

async function seedActivityLogs(userId: string) {
  await prisma.activityLog.createMany({
    data: [
      {
        userId,
        action: 'LOGIN',
        entity: 'User',
        entityId: userId,
        metadata: { ip: '127.0.0.1' },
      },
      {
        userId,
        action: 'ENROLL_COURSE',
        entity: 'Course',
        entityId: 'dummy', // sẽ cập nhật cụ thể hơn nếu cần sau
      },
    ],
  });
}

async function seedCertificatesAndSubscriptions(
  userId: string,
  courseId: string,
) {
  await prisma.certificate.create({
    data: {
      userId,
      courseId,
    },
  });

  await prisma.subscription.create({
    data: {
      userId,
      plan: 'basic',
      status: 'active',
      startedAt: new Date(),
    },
  });
}

async function seedRecommendations(userId: string, courseId: string) {
  await prisma.recommendation.create({
    data: {
      userId,
      courseId,
      score: 0.92,
      reason:
        'Bạn đã hoàn thành các khóa học lập trình cơ bản, nên tham gia khóa nâng cao này.',
    },
  });
}

async function main() {
  console.log('🌱 Clearing existing data...');
  await clearDatabase();

  console.log('🌱 Seeding users...');
  const { teacher, student1 } = await seedUsers();

  console.log('🌱 Seeding courses & lessons...');
  const { course1 } = await seedCoursesAndLessons(teacher.id);

  console.log('🌱 Seeding enrollments & progress...');
  await seedEnrollmentsAndProgress([course1.id], [student1.id]);

  console.log('🌱 Seeding quizzes & questions...');
  const firstLesson = await prisma.lesson.findFirstOrThrow({
    where: { courseId: course1.id },
    orderBy: { orderIndex: 'asc' },
  });
  const quiz = await seedQuizzesAndQuestions(firstLesson.id);

  console.log('🌱 Seeding submissions...');
  await seedSubmissions(quiz.id, student1.id);

  console.log('🌱 Seeding AI requests...');
  await seedAIRequests(student1.id);

  console.log('🌱 Seeding notifications...');
  await seedNotifications(student1.id);

  console.log('🌱 Seeding activity logs...');
  await seedActivityLogs(student1.id);

  console.log('🌱 Seeding certificates & subscriptions...');
  await seedCertificatesAndSubscriptions(student1.id, course1.id);

  console.log('🌱 Seeding recommendations...');
  await seedRecommendations(student1.id, course1.id);

  console.log('✅ Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
