/**
 * Generate openapi.json without starting the server.
 * Run: pnpm openapi:generate
 */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';

async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const baseUrl =
    configService.get<string>('BASE_URL') || `http://localhost:${port}`;

  const config = new DocumentBuilder()
    .setTitle('AI-LMS API')
    .setDescription(
      'API cho hệ thống AI-Powered Learning Management System: auth, users, courses, lessons, enrollments, quizzes, AI features.',
    )
    .setVersion('1.0')
    .addServer(baseUrl, 'Current environment')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
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
  const outPath = join(process.cwd(), 'openapi.json');
  writeFileSync(outPath, JSON.stringify(document, null, 2), 'utf-8');

  console.log(`OpenAPI spec written to ${outPath}`);
  process.exit(0);
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
