import { Module } from '@nestjs/common';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { QuizzesRepository } from './repositories/quizzes.repository';
import { QuestionsRepository } from './repositories/questions.repository';
import { SubmissionsRepository } from './repositories/submissions.repository';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [CoursesModule],
  controllers: [QuizzesController],
  providers: [
    QuizzesService,
    QuizzesRepository,
    QuestionsRepository,
    SubmissionsRepository,
  ],
})
export class QuizzesModule {}
