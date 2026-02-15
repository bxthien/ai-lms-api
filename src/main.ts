import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('AI-LMS API')
    .setDescription('AI Powered Learning Management System API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Đăng ký, đăng nhập, refresh token')
    .addTag('users', 'Quản lý user và profile')
    .addTag('courses', 'Khóa học và bài học')
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

  if (process.env.WRITE_OPENAPI_SPEC === 'true') {
    const fs = await import('fs');
    const path = await import('path');
    const outPath = path.join(process.cwd(), 'openapi.json');
    fs.writeFileSync(outPath, JSON.stringify(document, null, 2), 'utf-8');
    // eslint-disable-next-line no-console
    console.log(`OpenAPI spec written to ${outPath}`);
  }

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(port);
}

bootstrap();
