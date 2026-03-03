import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { PrismaService } from './prisma/prisma.service';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // Security headers
  app.use(helmet());

  // CORS – only allow explicitly listed origins
  const rawOrigins = configService.get<string>(
    'CORS_ORIGINS',
    `http://localhost:3001`,
  );
  const allowedOrigins = rawOrigins.split(',').map((o) => o.trim());
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, mobile apps, same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const baseUrl =
    configService.get<string>('BASE_URL') || `http://localhost:${port}`;

  const config = new DocumentBuilder()
    .setTitle('AI-LMS API')
    .setDescription(
      'API cho hệ thống AI-Powered Learning Management System: auth, users, courses, lessons, enrollments, quizzes, AI features.',
    )
    .setVersion('1.0')
    .addServer(baseUrl, 'Current environment')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addTag('auth', 'Đăng ký, đăng nhập, refresh token')
    .addTag('users', 'Quản lý user và profile')
    .addTag('courses', 'Khóa học, lesson: CRUD course + lesson')
    .addTag('enrollments', 'Ghi danh khóa học')
    .addTag('quizzes', 'Quiz và nộp bài')
    .addTag('ai', 'Tính năng AI: generate quiz, grade essay')
    .addTag('health', 'Health check')
    .addTag('root', 'API root')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs-json',
    swaggerOptions: { persistAuthorization: true },
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(port);
}

bootstrap();
