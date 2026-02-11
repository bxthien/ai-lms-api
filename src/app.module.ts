import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { AiModule } from './modules/ai/ai.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_HOST: Joi.string().default('localhost'),
        POSTGRES_PORT: Joi.number().default(5432),
        DATABASE_URL: Joi.string().uri().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRES_IN: Joi.number().default(900),
        JWT_REFRESH_EXPIRES_IN: Joi.number().default(604800),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().allow('').optional(),
      }),
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    EnrollmentsModule,
    QuizzesModule,
    AiModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
