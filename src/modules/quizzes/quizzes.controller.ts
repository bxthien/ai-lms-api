import { Controller, Get } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  listQuizzes() {
    // TODO: implement list quizzes
    return this.quizzesService.placeholder();
  }
}
