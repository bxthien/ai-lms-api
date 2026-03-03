import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { LessonsService } from './lessons.service';
import { CoursesRepository } from './repositories/courses.repository';
import { LessonsRepository } from './repositories/lessons.repository';

@Module({
  controllers: [CoursesController],
  providers: [
    CoursesService,
    LessonsService,
    CoursesRepository,
    LessonsRepository,
  ],
  exports: [CoursesRepository, LessonsRepository],
})
export class CoursesModule {}
