import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),

        // CORS (comma-separated list of allowed origins)
        CORS_ORIGINS: Joi.string().default('http://localhost:3001'),

        // Rate Limiting
        THROTTLE_TTL: Joi.number().default(60000), // ms, default 1 minute
        THROTTLE_LIMIT: Joi.number().default(60), // requests per TTL
        THROTTLE_AUTH_LIMIT: Joi.number().default(5), // stricter for auth routes

        // Database (Cloud SQL / local Postgres)
        // POSTGRES_USER: Joi.string().required(),
        // POSTGRES_PASSWORD: Joi.string().required(),
        // POSTGRES_DB: Joi.string().required(),
        // POSTGRES_HOST: Joi.string().default('localhost'),
        // POSTGRES_PORT: Joi.number().default(5432),
        DATABASE_URL: Joi.string().uri().required(),

        // Auth / Security
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRES_IN: Joi.number().default(900),
        JWT_REFRESH_EXPIRES_IN: Joi.number().default(604800),

        // Optional GCP / Vertex AI configuration
        GCP_PROJECT_ID: Joi.string().optional(),
        GCP_LOCATION: Joi.string().optional(),
        VERTEX_AI_MODEL: Joi.string().optional(),
      }),
    }),
    // Rate limiting – two named throttlers:
    //   'global' → 60 req / 60s for all routes
    //   'auth'   →  5 req / 60s for login/register (applied via @Throttle decorator)
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: 'global',
          ttl: config.get<number>('THROTTLE_TTL', 60_000),
          limit: config.get<number>('THROTTLE_LIMIT', 60),
        },
        {
          name: 'auth',
          ttl: config.get<number>('THROTTLE_TTL', 60_000),
          limit: config.get<number>('THROTTLE_AUTH_LIMIT', 5),
        },
      ],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    EnrollmentsModule,
    QuizzesModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Register ThrottlerGuard globally via DI (correct pattern)
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
